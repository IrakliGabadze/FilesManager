using FilesManager.Server.Enums;

namespace FilesManager.Server.Models;

public class FolderItem
{
    public FolderItem(string name, string path, FolderItemType type, string? fileExt = null, string? fileThumbnail = null)
    {
        Name = name;
        Path = path;
        Type = type;
        FileExt = fileExt;
        FileThumbnail = fileThumbnail;
    }

    public string Path { get; set; }
    public string Name { get; set; }
    public FolderItemType Type { get; set; }
    public string? FileExt { get; set; }
    public string? FileThumbnail { get; set; }
}
