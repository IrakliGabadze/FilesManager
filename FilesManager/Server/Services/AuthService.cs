using FilesManager.Server.Models;

namespace FilesManager.Server.Services;

public class AuthService
{
    public (bool isValidUser, List<string>? roles) ValidateUserCredentialsAndGetRoles(LoginRequest loginRequest)
    {
        //TODO Check user in db and get roles
        if (loginRequest.Username != "Admin" && loginRequest.Password != "Admin")
            return (false, null);

        var roles = new List<string>()
        {
            "Administrator"
        };

        return true
    }
}
