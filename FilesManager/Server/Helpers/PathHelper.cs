using FilesManager.Server.Enums;
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

    public static FolderItemType GetFileType(string fileExt)
    {
        if (IsHtmlSupportedImage(fileExt))
            return FolderItemType.HtmlImage;

        if (IsHtmlSupportedVideo(fileExt))
            return FolderItemType.HtmlVideo;

        if (IsHtmlSupportedAudio(fileExt))
            return FolderItemType.HtmlAudio;

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

    public static string? GetMimeType(string fileExt) => fileExt.ToLower() switch
    {
        ".png" => "image/png",
        ".jpg" or ".jpeg" => "image/jpeg",
        ".gif" => "image/gif",
        ".bmp" => "image/bmp",
        ".ico" => "image/x-icon",
        ".webp" => "image/webp",
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

    private static bool IsHtmlSupportedVideo(string fileExt) => ExtensionExists(fileExt, HtmlVideoFormats);

    private static bool IsHtmlSupportedAudio(string fileExt) => ExtensionExists(fileExt, HtmlAudioFormats);

    private static bool IsHtmlSupportedImage(string fileExt) => ExtensionExists(fileExt, HtmlImageFormats);

    private static bool ExtensionExists(string fileExt, List<string> existingList) =>
        existingList.Exists(ext => ext.Equals(fileExt, StringComparison.InvariantCultureIgnoreCase));

    private static readonly List<string> HtmlImageFormats = new()
    {
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".ico",
        ".webp",
        ".svg"
    };

    private static readonly List<string> HtmlVideoFormats = new()
    {
        ".mp4",
        ".webm",
        ".ogv"
    };

    private static readonly List<string> HtmlAudioFormats = new()
    {
        ".mp3",
        ".ogg",
        ".opus",
        ".wav",
        ".aac"
    };

    private static readonly List<string> SupportedFileFormatsToUpload = new()
    {
       ".mp4", ".mp3", ".jpg", ".jpeg", ".png", ".svg", ".pdf", ".json", ".txt", ".xml", ".docx", ".pptx", ".xlsx", ".zip", ".rar",
    };

}