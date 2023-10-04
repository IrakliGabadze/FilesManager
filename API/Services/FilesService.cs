using API.Helpers;
using API.Models;
using System.IO;

namespace API.Services;

public class FilesService
{
    public List<FolderItem> GetFolderItems(string requestedFolderPartialPath)
    {
        var result = new List<FolderItem>(0);

        if (PathHelper.PathIsSafe(requestedFolderPartialPath))
        {
            var fullPath = Path.Combine(PathHelper.MainFolderPath, requestedFolderPartialPath);

            if (!Directory.Exists(fullPath))
                throw new InvalidOperationException($"Folder does not exists for path: {fullPath}");

            var directoryInfo = new DirectoryInfo(fullPath);

            var folderItems = directoryInfo.GetFileSystemInfos();

            foreach (var item in folderItems) 
            {
                var isFolder = IsFolder(item);

                var folderItem = new FolderItem(item.Name, item.FullName.Replace(PathHelper.MainFolderPath, ""), isFolder, isFolder ? null : item.Extension);

                result.Add(folderItem);
            }
        }

        return result.OrderBy(f => f.IsFolder).ToList();
    }

    private static bool IsFolder(FileSystemInfo fileSystemInfo) => fileSystemInfo is DirectoryInfo;
}
