using System.Text.Json.Serialization;

namespace FilesManager.Server.Models;

public class CutOrCopyFolderItem
{
    [JsonConstructor]
    public CutOrCopyFolderItem(string oldPath, string? targetFolderPath, bool overwrite)
    {
        OldPath = oldPath;
        TargetFolderPath = targetFolderPath;
        Overwrite = overwrite;
    }

    public string OldPath { get; set; }
    public string? TargetFolderPath { get; set; }
    public bool Overwrite { get; set; }
}
