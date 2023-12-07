namespace FilesManager.Server.Models;

public class AuthUserResponse
{
    public AuthUserResponse(string username, IEnumerable<string> roles)
    {
        Username = username;
        Roles = roles;
    }

    public string Username { get; set; }
    public IEnumerable<string> Roles { get; set; }
}
