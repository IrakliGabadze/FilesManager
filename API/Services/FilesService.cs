using API.Enums;
using API.Helpers;
using API.Models;
using Microsoft.Extensions.Options;
using System.IO;

namespace API.Services;

public class FilesService
{
    private static string _filesRootFolderPath = default!;
    private const string InternalFilesRootFolderPartialPath = "FilesRootFolder"!;

    public FilesService(IWebHostEnvironment env, IOptions<Settings> options)
    {
        _filesRootFolderPath = options.Value.FilesRootFolderPath;

        if (string.IsNullOrWhiteSpace(_filesRootFolderPath))
            _filesRootFolderPath = Path.Combine(env.ContentRootPath, InternalFilesRootFolderPartialPath);

        if (!_filesRootFolderPath.EndsWith("\\"))
            _filesRootFolderPath = $"{_filesRootFolderPath}\\";
    }

    public List<FolderItem> GetFolderItems(string? folderPartialPath)
    {
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

                //TODO get FolderItemType
                var folderItemType = isFolder ? FolderItemType.Folder : FolderItemType.OtherFile;
                //TODO get file media type
                var folderItem = new FolderItem(item.Name, item.FullName.Replace(_filesRootFolderPath, string.Empty), folderItemType, null, isFolder ? null : item.Extension);

                result.Add(folderItem);
            }
        }

        return result.OrderByDescending(f => f.Type == FolderItemType.Folder).ToList();
    }

    private static bool IsFolder(FileSystemInfo fileSystemInfo) => fileSystemInfo is DirectoryInfo;
}
