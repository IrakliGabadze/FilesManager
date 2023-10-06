using API.Enums;
using API.Helpers;
using API.Models;
using Microsoft.Extensions.Options;

namespace API.Services;

public class FilesService
{
    private const string InternalFilesRootFolderPartialPath = "FilesRootFolder"!;
    
    private static string _filesRootFolderPath = default!;

    public FilesService(IWebHostEnvironment env, IOptions<Settings> options)
    {
        GetCleanRootFolderPath(env, options);
    }

    public List<FolderItem> GetFolderItems(string? folderPartialPath)
    {
        if (folderPartialPath?.StartsWith("\\") == true || folderPartialPath?.StartsWith("/") == true)
            throw new InvalidOperationException($"Invalid characters in folder partial path: {folderPartialPath}");

        var result = new List<FolderItem>(0);

        var isNullOrWhiteSpace = string.IsNullOrWhiteSpace(folderPartialPath);

        if (isNullOrWhiteSpace || PathHelper.PathIsSafe(folderPartialPath!))
        {
            var fullPath = isNullOrWhiteSpace ? _filesRootFolderPath : Path.Combine(_filesRootFolderPath, folderPartialPath!);

            if (!Directory.Exists(fullPath))
                throw new InvalidOperationException($"Folder does not exists for path: {fullPath}");

            var directoryInfo = new DirectoryInfo(fullPath);

            var folderItems = directoryInfo.GetFileSystemInfos();

            foreach (var item in folderItems)
            {
                var isFolder = IsFolder(item);

                var folderItemType = isFolder ? FolderItemType.Folder : GetFolderItemType(item.Name);

                var fileMediaType = isFolder ? null : PathHelper.GetMimeType(item.Extension);

                var folderItem = new FolderItem(item.Name, item.FullName.Replace(_filesRootFolderPath, string.Empty), folderItemType, fileMediaType, isFolder ? null : item.Extension);

                result.Add(folderItem);
            }
        }

        return result.OrderByDescending(f => f.Type == FolderItemType.Folder).ToList();
    }

    private static bool IsFolder(FileSystemInfo fileSystemInfo) => fileSystemInfo is DirectoryInfo;

    private static FolderItemType GetFolderItemType(string fileName)
    {
        if (PathHelper.IsImage(fileName))
            return FolderItemType.Image;

        if (PathHelper.IsVideo(fileName))
            return FolderItemType.Video;

        if (PathHelper.IsAudio(fileName))
            return FolderItemType.Audio;

        return FolderItemType.OtherFile;
    }

    private static void GetCleanRootFolderPath(IWebHostEnvironment env, IOptions<Settings> options)
    {
        _filesRootFolderPath = options.Value.FilesRootFolderPath;

        if (string.IsNullOrWhiteSpace(_filesRootFolderPath))
        {
            _filesRootFolderPath = Path.Combine(env.ContentRootPath, InternalFilesRootFolderPartialPath);
        }
        else
        {
            var directoryInfo = new DirectoryInfo(_filesRootFolderPath);

            if (!_filesRootFolderPath.EndsWith("\\"))
                _filesRootFolderPath = $"{directoryInfo.FullName}\\";
            else
                _filesRootFolderPath = directoryInfo.FullName;
        }
    }
}
