using System.Text.Json.Serialization;

namespace FilesManager.Models;

public class RenameFolderItem
{
    [JsonConstructor]
    public RenameFolderItem(string path, string name)
    {
        Path = path;
        Name = name;
    }

    public string Path { get; set; }
    public string Name { get; set; }
}
