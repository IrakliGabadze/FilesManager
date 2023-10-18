using API.Enums;
using API.Helpers;
using API.Models;
using Microsoft.Extensions.Options;

namespace API.Services;

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
            throw new InvalidOperationException($"Folder does not exists for path: {safePath}");

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
            throw new InvalidOperationException($"Folder item does not exists for path: {safePath}");
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
            throw new InvalidOperationException($"Folder item does not exists for path: {safePath}");
    }

    public void CutFolderItem(CopyCutFolderItem cutFolderItem)
    {
        var safeOldPath = GetFullSafePath(cutFolderItem.OldPath);
        var safeNewPath = Path.Combine(GetFullSafePath(cutFolderItem.NewPath), Path.GetFileName(safeOldPath));

        if (Directory.Exists(safeOldPath))
        {
            try
            {
                Directory.Move(safeOldPath, safeNewPath);
            }
            catch
            {
                if (Directory.Exists(safeNewPath))
                    Directory.Delete(safeNewPath, true); //Clear already moved items

                throw;
            }
        }
        else if (File.Exists(safeOldPath))
        {
            File.Move(safeOldPath, safeNewPath, cutFolderItem.Overwrite);
        }
        else
        {
            throw new InvalidOperationException($"Folder item does not exists for path: {safeOldPath}");
        }
    }

    public void CopyFolderItem(CopyCutFolderItem copyFolderItem)
    {
        var safeOldPath = GetFullSafePath(copyFolderItem.OldPath);
        var safeNewPath = GetFullSafePath(copyFolderItem.NewPath);
        var mainTargetDir = Path.Combine(safeNewPath, Path.GetFileName(safeOldPath));

        if (Directory.Exists(safeOldPath))
        {
            try
            {
                DirectoryCopy(safeOldPath, mainTargetDir, copyFolderItem.Overwrite);
            }
            catch
            {
                if (Directory.Exists(mainTargetDir))
                    Directory.Delete(mainTargetDir, true); //Clear already copied items

                throw;
            }
        }
        else if (File.Exists(safeOldPath))
        {
            File.Copy(safeOldPath, safeNewPath, copyFolderItem.Overwrite);
        }
        else
        {
            throw new InvalidOperationException($"Folder item does not exists for path: {safeOldPath}");
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
}
