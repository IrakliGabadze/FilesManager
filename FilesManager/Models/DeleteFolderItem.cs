using System.Text.Json.Serialization;

namespace FilesManager.Models;

public class DeleteFolderItem
{
    [JsonConstructor]
    public DeleteFolderItem(string partialPath)
    {
        PartialPath = partialPath;
    }

    public string PartialPath { get; set; }
}
