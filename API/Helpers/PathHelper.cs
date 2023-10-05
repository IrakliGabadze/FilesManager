namespace API.Helpers;

public class PathHelper
{
    private static readonly char[] InvalidChars = Path.GetInvalidPathChars();

    public static bool PathIsSafe(string path) => !ContainsPathTraversal(path) && !ContainsInvalidCharacters(path);

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