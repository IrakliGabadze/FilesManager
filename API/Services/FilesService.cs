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

    public async Task<List<FolderItem>> GetFolderItemsAsync(string? folderPartialPath)
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

                var folderItemType = isFolder ? FolderItemType.Folder : PathHelper.GetFolderItemType(item.Name);

                var fileMediaType = isFolder ? null : PathHelper.GetMimeType(item.Extension);

                var partialPath = item.FullName.Replace(_filesRootFolderPath, string.Empty);

                var folderItem = new FolderItem(
                    item.Name,
                    partialPath,
                    folderItemType,
                    fileMediaType,
                    item.Extension,
                    await GetFileThumbnailAsync(folderItemType, partialPath));

                result.Add(folderItem);
            }
        }

        return result.OrderByDescending(f => f.Type == FolderItemType.Folder).ToList();
    }

    private static bool IsFolder(FileSystemInfo fileSystemInfo) => fileSystemInfo is DirectoryInfo;
  
    private async Task<string?> GetFileThumbnailAsync(FolderItemType folderItemType, string partialPath)
    {
        if (folderItemType == FolderItemType.Image)
            return await _thumbnailService.GetImageThumbnailAsync(partialPath);

        //TODO video thumbnail

        return null;
    }

   
}
