using System.Text.Json.Serialization;

namespace API.Models;

public class DeleteFolderItem
{
    [JsonConstructor]
    public DeleteFolderItem(string partialPath)
    {
        PartialPath = partialPath;
    }

    public string PartialPath { get; set; }
}
