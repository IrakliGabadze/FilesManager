using System.Text.Json.Serialization;

namespace FilesManager.Server.Models;

public class CreateFolder
{
    [JsonConstructor]
    public CreateFolder(string? parentFolderPartialPath, string name)
    {
        ParentFolderPartialPath = parentFolderPartialPath;
        Name = name;
    }

    public string? ParentFolderPartialPath { get; set; }
    public string Name { get; set; }
}
