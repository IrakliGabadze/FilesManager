namespace FilesManager.Server.Models;

public class AuthUserResponse
{
    public AuthUserResponse(string username, List<string> roles)
    {
        Username = username;
        Roles = roles;
    }

    public string Username { get; set; }
    public List<string> Roles { get; set; }
}
