﻿using FilesManager.Server.Enums;
using FilesManager.Server.Models;
using Microsoft.Extensions.Options;

namespace FilesManager.Server.Helpers;

public static class PathHelper
{
    private const string InternalFilesRootFolderPartialPath = "Server\\FilesRootFolder";

    private static readonly char[] InvalidChars = Path.GetInvalidPathChars();

    public static string GetSafePath(string path, bool checkForNullOrWhiteSpace = true)
    {
        if (checkForNullOrWhiteSpace && string.IsNullOrWhiteSpace(path))
            throw new InvalidOperationException("Path can't be null or white space.");

        var normalizedPath = GetNormalizedPath(path);

        if (!StartsOrEndsWithSlash(normalizedPath) && !ContainsPathTraversal(normalizedPath) && ContainsInvalidCharacters(normalizedPath))
            throw new InvalidOperationException();

        return normalizedPath;
    }

    private static bool ContainsPathTraversal(string path)
    {
        foreach (var component in path.Split(Path.DirectorySeparatorChar))
        {
            if (component == "..")
                return true;
        }

        return false;
    }

    private static bool ContainsInvalidCharacters(string path)
    {
        foreach (char c in InvalidChars)
        {
            if (path.Contains(c))
                return true;
        }

        return false;
    }

    private static bool StartsOrEndsWithSlash(string partialPath) => 
        partialPath.StartsWith("\\") || partialPath.StartsWith("/") || partialPath.EndsWith("\\") || partialPath.EndsWith("/");

    public static FolderItemType GetFolderItemType(string fileName)
    {
        if (IsImage(fileName))
            return FolderItemType.Image;

        if (IsVideo(fileName))
            return FolderItemType.Video;

        if (IsAudio(fileName))
            return FolderItemType.Audio;

        return FolderItemType.OtherFile;
    }

    public static string GetCleanRootFolderPath(IWebHostEnvironment env, IOptions<Settings> options)
    {
        var filesRootFolderPath = options.Value.FilesRootFolderPath;

        if (string.IsNullOrWhiteSpace(filesRootFolderPath))
            filesRootFolderPath = Path.Combine(env.ContentRootPath, InternalFilesRootFolderPartialPath);
        else
            filesRootFolderPath = new DirectoryInfo(filesRootFolderPath).FullName;

        if (!filesRootFolderPath.EndsWith("\\"))
            filesRootFolderPath = $"{filesRootFolderPath}\\";

        return filesRootFolderPath;
    }

    public static string GetNormalizedPath(string path) => path.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);


    public static readonly List<string> SupportedFileFormats = new()
    {
       ".mp4", ".mp3", ".jpg", ".jpeg", ".png", ".svg", ".pdf", ".json", ".txt", ".xml", ".docx", ".pptx", ".xlsx", ".zip", ".rar",
    };

    public static string? GetMimeType(string fileExt) => fileExt.ToLower() switch
    {
        ".jpg" or ".jpeg" => "image/jpeg",
        ".png" => "image/png",
        ".svg" => "image/svg+xml",
        ".pdf" => "application/pdf",
        ".json" => "application/json;",
        ".txt" or ".xml" => "text/plain;",
        ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".zip" => "application/zip",
        ".rar" => "application/vnd.rar",
        ".mp4" => "video/mp4",
        ".webm" => "video/webm",
        ".ogv" => "video/ogg",
        ".avi" => "video/x-msvideo",
        ".mov" => "video/quicktime",
        ".mpeg" => "video/mpeg",
        ".mpg" => "video/mpeg",
        ".3gp" => "video/3gpp",
        ".3g2" => "video/3gpp2",
        ".flv" => "video/x-flv",
        ".mkv" => "video/x-matroska",
        ".mp3" => "audio/mpeg",
        ".ogg" => "audio/ogg",
        ".oga" => "audio/ogg",
        ".wav" => "audio/wav",
        ".aac" => "audio/aac",
        ".flac" => "audio/flac",
        ".midi" => "audio/midi",
        ".mid" => "audio/midi",
        ".weba" => "audio/webm",
        ".ram" => "audio/x-pn-realaudio",
        ".rm" => "audio/x-pn-realaudio",
        ".wma" => "audio/x-ms-wma",
        ".opus" => "audio/opus",
        _ => null
    };

    public static bool IsVideo(string fileName) => fileName.EndsWith(".mp4", StringComparison.InvariantCultureIgnoreCase);

    public static bool IsAudio(string fileName) => fileName.EndsWith(".mp4", StringComparison.InvariantCultureIgnoreCase);

    public static bool IsImage(string fileName) => fileName.EndsWith(".jpg", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".jpeg", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".png", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".svg", StringComparison.InvariantCultureIgnoreCase);
}