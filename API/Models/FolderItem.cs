using API.Enums;

namespace API.Models;

public class FolderItem
{
    public FolderItem(string name, string path, FolderItemType type, string? fileMediaType = null, string? fileExt = null)
    {
        Name = name;
        Path = path;
        Type = type;
        FileMediaType = fileMediaType;
        FileExt = fileExt;
    }

    public string Path { get; set; }
    public string Name { get; set; }
    public FolderItemType Type { get; set; }
    public string? FileMediaType { get; set; }
    public string? FileExt { get; set; }
}
