﻿using System.Text.Json.Serialization;

namespace API.Models;

public class CopyCutFolderItem
{
    [JsonConstructor]
    public CopyCutFolderItem(string oldPath, string newPath, bool overwrite)
    {
        OldPath = oldPath;
        NewPath = newPath;
        Overwrite = overwrite;
    }

    public string OldPath { get; set; }
    public string NewPath { get; set; }
    public bool Overwrite { get; set; }
}
