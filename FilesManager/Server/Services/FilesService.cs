using FilesManager.Server.Enums;
using FilesManager.Server.Helpers;
using FilesManager.Server.Models;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.IO.Compression;

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

    public async Task DownloadZippedFolderWithImmediateStreamingAsync(HttpContext httpContext, string folderPartialPath, CancellationToken cancellationToken)
    {
        var safeFullPath = GetFullSafePath(folderPartialPath);

        var directoryInfo = new DirectoryInfo(safeFullPath);

        if (!directoryInfo.Exists)
            ThrowDoesNotExistException(safeFullPath);

        ConfigureResponseForFileDownload(httpContext, $"{Uri.EscapeDataString(directoryInfo.Name)}.zip");

        using var zipArchive = new ZipArchive(httpContext.Response.Body, ZipArchiveMode.Create, true);

        await ZipDirectoryRecursiveAsync(zipArchive, new DirectoryInfo(safeFullPath), httpContext.Response.Body, safeFullPath);
    }

    public async Task DownloadFileWithImmediateStreamingAsync(HttpContext httpContext, string filePartialPath, CancellationToken cancellationToken)
    {
        var safeFullPath = GetFullSafePath(filePartialPath);

        var fileInfo = new FileInfo(safeFullPath);

        if (!fileInfo.Exists)
            ThrowDoesNotExistException(safeFullPath);

        ConfigureResponseForFileDownload(httpContext, Uri.EscapeDataString(fileInfo.Name));

        await using var fs = new FileStream(safeFullPath, FileMode.Open, FileAccess.Read, FileShare.Read);

        await fs.CopyToAsync(httpContext.Response.Body, cancellationToken);

        await httpContext.Response.Body.FlushAsync(cancellationToken);
    }

    public IActionResult PreviewVideoOrAudioFile(string partialPath)
    {
        var safeFullPath = GetFullSafePath(partialPath);

        if (!File.Exists(safeFullPath))
            ThrowDoesNotExistException(safeFullPath);

        var fs = new FileStream(safeFullPath, FileMode.Open, FileAccess.Read, FileShare.Read);

        try
        {
            var mimeType = PathHelper.GetMimeType(Path.GetExtension(safeFullPath)) ?? "application/octet-stream";

            return new FileStreamResult(fs, mimeType)
            {
                EnableRangeProcessing = true
            };
        }
        catch (Exception)
        {
            fs.Dispose();
            throw;
        }
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

            var folderItemType = isFolder ? FolderItemType.Folder : PathHelper.GetFileType(item.Extension);

            var partialPath = item.FullName.Replace(_filesRootFolderPath, string.Empty);

            result.Add(new FolderItem(item.Name, partialPath, folderItemType, item.Extension, null));
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

    public async Task UploadFilesAsync(string mainFolderPartialPath, HttpRequest request, CancellationToken cancellationToken)
    {
        var safeMainFolderPartialPath = PathHelper.GetSafePath(mainFolderPartialPath);

        if (!IsMultipartContentType(request.ContentType))
            return;

        var formCollection = await request.ReadFormAsync(cancellationToken);

        foreach (var file in formCollection.Files)
        {
            if (file.Length == 0)
                continue;

            var safeFileName = PathHelper.GetSafePath(file.FileName);

            var fullDestPath = Path.Combine(_filesRootFolderPath, safeMainFolderPartialPath, safeFileName);

            var buffer = new byte[file.Length];

            await using var stream = file.OpenReadStream();

            await using var fsDest = new FileStream(fullDestPath, FileMode.Create, FileAccess.Write);

            await stream.CopyToAsync(fsDest, cancellationToken);
        }
    }

    private static bool IsMultipartContentType(string? contentType) =>
        !string.IsNullOrEmpty(contentType) && contentType.Contains("multipart/", StringComparison.OrdinalIgnoreCase);

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

    private static async Task ZipDirectoryRecursiveAsync(ZipArchive archive, DirectoryInfo dir, Stream responseBody, string mainFolderFullPath)
    {
        foreach (var file in dir.GetFiles())
        {
            await using var fs = new FileStream(file.FullName, FileMode.Open, FileAccess.Read, FileShare.Read);

            var entryPath = file.FullName[(mainFolderFullPath.Length + 1)..]; // + 1 for slash \

            var entry = archive.CreateEntry(entryPath, CompressionLevel.Fastest);

            await using var entryStream = entry.Open();

            await fs.CopyToAsync(entryStream);

            await responseBody.FlushAsync();
        }

        foreach (DirectoryInfo subDir in dir.GetDirectories())
        {
            var folderEntryPath = subDir.FullName[(mainFolderFullPath.Length + 1)..];

            archive.CreateEntry($"{folderEntryPath}\\", CompressionLevel.NoCompression); //For empty folders

            await ZipDirectoryRecursiveAsync(archive, subDir, responseBody, mainFolderFullPath);
        }
    }

    private static void ConfigureResponseForFileDownload(HttpContext httpContext, string fileName, bool allowSynchronousIO)
    {
        httpContext.Features.Get<IHttpResponseBodyFeature>()?.DisableBuffering();
        httpContext.Response.Headers.Add("Content-Disposition", $"attachment; filename={fileName}");
        httpContext.Response.ContentType = PathHelper.GetMimeType(Path.GetExtension(fileName));

        if (!allowSynchronousIO)
            return;

        var syncIOFeature = httpContext.Features.Get<IHttpBodyControlFeature>();

        if (syncIOFeature is not null)
            syncIOFeature.AllowSynchronousIO = true;
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

            for (var num = 1; fileSystemInfos.Any(fs => fs.Name == folderItemNameWithExt); num++)
            {
                folderItemNameWithExt = $"{folderItemNameWithoutExt} - Copy ({num}){(isFolder ? string.Empty : ext)}";
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
        if (folderItemType == FolderItemType.HtmlImage)
            return _thumbnailService.GetImageThumbnail(fullPath, ext);

        //TODO video thumbnail

        return null;
    }

    private static void ThrowDoesNotExistException(string forPath) =>
        throw new InvalidOperationException($"Folder item does not exists for path: {forPath}");
}
