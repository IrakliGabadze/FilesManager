using System.Text.Json.Serialization;

namespace FilesManager.Models;

public class CutOrCopyFolderItem
{
    [JsonConstructor]
    public CutOrCopyFolderItem(string oldPath, string? newPath, bool overwrite)
    {
        OldPath = oldPath;
        NewPath = newPath;
        Overwrite = overwrite;
    }

    public string OldPath { get; set; }
    public string? NewPath { get; set; }
    public bool Overwrite { get; set; }
}
