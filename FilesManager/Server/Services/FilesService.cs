using FilesManager.Server.Enums;
using FilesManager.Server.Helpers;
using FilesManager.Server.Models;
using Microsoft.Extensions.Options;

namespace FilesManager.Server.Services;

public class FilesService
{
    private static string _filesRootFolderPath = default!;

    private readonly ThumbnailService _thumbnailService;

    public FilesService(IWebHostEnvironment env, IOptions<Settings> options, ThumbnailService thumbnailHelper)
    {
        _thumbnailService = thumbnailHelper;
        _filesRootFolderPath = PathHelper.GetCleanRootFolderPath(env, options);
    }

    public List<FolderItem> GetFolderItems(string? folderPartialPath)
    {
        var safePath = string.IsNullOrWhiteSpace(folderPartialPath) ? _filesRootFolderPath : GetFullSafePath(folderPartialPath, false);

        var result = new List<FolderItem>(0);

        if (!Directory.Exists(safePath))
            ThrowDoesNotExistException(safePath);

        var directoryInfo = new DirectoryInfo(safePath);

        foreach (var item in directoryInfo.GetFileSystemInfos())
        {
            var isFolder = IsFolder(item);

            var folderItemType = isFolder ? FolderItemType.Folder : PathHelper.GetFolderItemType(item.Name);

            var fileMediaType = isFolder ? null : PathHelper.GetMimeType(item.Extension);

            var partialPath = item.FullName.Replace(_filesRootFolderPath, string.Empty);

            var folderItem = new FolderItem(
                item.Name,
                partialPath,
                folderItemType,
                fileMediaType,
                item.Extension,
                null); //GetFileThumbnail(folderItemType, item.FullName, item.Extension));

            result.Add(folderItem);
        }

        return result.OrderByDescending(f => f.Type == FolderItemType.Folder).ToList();
    }

    public void RenameFolderItem(RenameFolderItem renameFolderItem)
    {
        var safePath = GetFullSafePath(renameFolderItem.Path);

        var safeName = PathHelper.GetSafePath(renameFolderItem.Name);

        if (safeName.Length > 64)
            throw new InvalidOperationException($"Name nust not be longer than 50 characters");

        var parentDirectory = Path.GetDirectoryName(safePath)!;

        if (Directory.Exists(safePath))
        {
            var newFolderPath = Path.Combine(parentDirectory, safeName);

            Directory.Move(safePath, newFolderPath);
        }
        else if (File.Exists(safePath))
        {
            var newFilePath = Path.Combine(parentDirectory, safeName);

            File.Move(safePath, newFilePath);
        }
        else
        {
            ThrowDoesNotExistException(safePath);
        }
    }

    public void DeleteFolderItem(string folderItemPartialPath)
    {
        var safePath = GetFullSafePath(folderItemPartialPath);

        if (Directory.Exists(safePath))
            Directory.Delete(safePath, true);
        else if (File.Exists(safePath))
            File.Delete(safePath);
        else
            ThrowDoesNotExistException(safePath);
    }

    public void CutOrCopyFolderItem(CutOrCopyFolderItem copyFolderItem, bool isCut)
    {
        var (safeOldPath, safeNewPath, isFolder) = GetSafePathsToCutOrCopy(copyFolderItem, isCut);

        if (isFolder)
        {
            try
            {
                if (isCut)
                    Directory.Move(safeOldPath, safeNewPath);
                else
                    DirectoryCopy(safeOldPath, safeNewPath, copyFolderItem.Overwrite);
            }
            catch
            {
                if (Directory.Exists(safeNewPath))
                    Directory.Delete(safeNewPath, true); //Clear already copied items

                throw;
            }
        }
        else
        {
            if (isCut)
                File.Move(safeOldPath, safeNewPath, copyFolderItem.Overwrite);
            else
                File.Copy(safeOldPath, safeNewPath, copyFolderItem.Overwrite);
        }
    }

    private static void DirectoryCopy(string sourceDir, string targetDir, bool overwrite)
    {
        Directory.CreateDirectory(targetDir);

        foreach (var file in Directory.GetFiles(sourceDir))
        {
            var fileName = Path.GetFileName(file);
            var destFile = Path.Combine(targetDir, fileName);
            File.Copy(file, destFile, overwrite);
        }

        foreach (var subDir in Directory.GetDirectories(sourceDir))
        {
            var destSubDir = Path.Combine(targetDir, Path.GetFileName(subDir));
            DirectoryCopy(subDir, destSubDir, overwrite);
        }
    }

    private static (string safeOldPath, string safeNewPath, bool isFolder) GetSafePathsToCutOrCopy(CutOrCopyFolderItem copyFolderItem, bool isCut)
    {
        var safeOldPath = GetFullSafePath(copyFolderItem.OldPath);

        var isFolder = Directory.Exists(safeOldPath);

        if (!isFolder && !File.Exists(safeOldPath))
            ThrowDoesNotExistException(safeOldPath);

        var safeTargetFolderPath = string.IsNullOrWhiteSpace(copyFolderItem.TargetFolderPath) ?
             _filesRootFolderPath : GetFullSafePath(copyFolderItem.TargetFolderPath);

        var folderItemNameWithExt = Path.GetFileName(safeOldPath);

        var ext = Path.GetExtension(folderItemNameWithExt);

        var safeNewPath = Path.Combine(safeTargetFolderPath, folderItemNameWithExt);

        if (!copyFolderItem.Overwrite && safeOldPath == safeNewPath)
        {
            if (isCut)
                throw new InvalidOperationException($"Folder item with name '{folderItemNameWithExt}' already exists");

            var folderItemNameWithoutExt = folderItemNameWithExt;

            if (!isFolder)
                folderItemNameWithoutExt = folderItemNameWithExt[..^ext.Length];

            var fileSystemInfos = new DirectoryInfo(safeTargetFolderPath).GetFileSystemInfos();

            var num = 1;

            while (fileSystemInfos.Any(fs => fs.Name == folderItemNameWithExt))
            {
                folderItemNameWithExt = $"{folderItemNameWithoutExt} - Copy ({num}){(isFolder ? string.Empty : ext)}";
                num++;
            }

            if (folderItemNameWithExt.Length > 64)
                throw new InvalidOperationException($"Too much characters in folder item name");

            safeNewPath = Path.Combine(safeTargetFolderPath, folderItemNameWithExt);
        }

        return (safeOldPath, safeNewPath, isFolder);
    }


    private static string GetFullSafePath(string partialPath, bool checkForNullOrWhiteSpace = true) =>
        Path.Combine(_filesRootFolderPath, PathHelper.GetSafePath(partialPath, checkForNullOrWhiteSpace));

    private static bool IsFolder(FileSystemInfo fileSystemInfo) => fileSystemInfo is DirectoryInfo;

    private string? GetFileThumbnail(FolderItemType folderItemType, string fullPath, string ext)
    {
        if (folderItemType == FolderItemType.Image)
            return _thumbnailService.GetImageThumbnail(fullPath, ext);

        //TODO video thumbnail

        return null;
    }

    private static void ThrowDoesNotExistException(string forPath) =>
        throw new InvalidOperationException($"Folder item does not exists for path: {forPath}");
}
