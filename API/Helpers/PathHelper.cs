namespace API.Helpers;

public class PathHelper
{
    private static readonly char[] InvalidChars = Path.GetInvalidPathChars();

    public static bool PathIsSafe(string path) => !ContainsPathTraversal(path) && !ContainsInvalidCharacters(path);

    private static bool ContainsPathTraversal(string path)
    {
        var normalizedPath = GetNormalizedPath(path);

        var components = normalizedPath.Split(Path.DirectorySeparatorChar);

        foreach (var component in components)
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

    public static string GetNormalizedPath(string path) => path.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);

    public static readonly List<string> SupportedFileFormats = new()
    {
       ".mp4", ".mp3", ".jpg", ".jpeg", ".png", ".svg", ".pdf", ".json", ".txt", ".xml", ".docx", ".pptx", ".xlsx", ".zip", ".rar",
    };

    public static string? GetMimeType(string fileExt) => fileExt.ToLower() switch
    {
        ".mp4" => "video/mp4",
        ".mp3" => "audio/mpeg",
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
        _ => null
    };

    public static bool IsVideo(string fileName) => fileName.EndsWith(".mp4", StringComparison.InvariantCultureIgnoreCase);

    public static bool IsAudio(string fileName) => fileName.EndsWith(".mp4", StringComparison.InvariantCultureIgnoreCase);

    public static bool IsImage(string fileName) => fileName.EndsWith(".jpg", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".jpeg", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".png", StringComparison.InvariantCultureIgnoreCase) ||
                                            fileName.EndsWith(".svg", StringComparison.InvariantCultureIgnoreCase);
}