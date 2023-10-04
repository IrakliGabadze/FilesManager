using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    [HttpGet(Name = "GetFolderItems")]
    public List<string> GetFiles()
    {
       return new List<string>(0);
    }
}
