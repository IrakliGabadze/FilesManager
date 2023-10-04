namespace API.Helpers;

public class PathHelper
{
    private static readonly char[] InvalidChars = Path.GetInvalidPathChars();

    private static string _mainFolderPath = default!;
    
    public PathHelper(IConfiguration configuration)
    {
        var filesRootFolderPath = configuration["FilesRootFolderPath"];

        if (string.IsNullOrWhiteSpace(filesRootFolderPath) || Directory.Exists(filesRootFolderPath))
            throw new InvalidOperationException("FilesRootFolderPath is not defined in");

        _mainFolderPath = filesRootFolderPath;
    }

    public static bool PathIsSafe(string path) => !ContainsPathTraversal(path) && !ContainsInvalidCharacters(path);

    public static string MainFolderPath => _mainFolderPath;

    private static bool ContainsPathTraversal(string path)
    {
        var normalizedPath = path.Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);

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
}