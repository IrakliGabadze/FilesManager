using API.Enums;

namespace API.Models;

public class FolderItem
{
    public FolderItem(string name, string path, FolderItemType type, string? fileMediaType = null, string? fileExt = null, string? fileThumbnail = null)
    {
        Name = name;
        Path = path;
        Type = type;
        FileMediaType = fileMediaType;
        FileExt = fileExt;
        FileThumbnail = fileThumbnail;
    }

    public string Path { get; set; }
    public string Name { get; set; }
    public FolderItemType Type { get; set; }
    public string? FileMediaType { get; set; }
    public string? FileExt { get; set; }
    public string? FileThumbnail { get; set; }
}
