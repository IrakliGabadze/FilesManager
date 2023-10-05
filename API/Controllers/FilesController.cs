using API.Models;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class FilesController : ControllerBase
{
    private readonly FilesService _filesService;

    public FilesController(FilesService filesService)
    {
        _filesService = filesService;
    }

    [HttpGet(Name = "GetFolderItems")]
    public List<FolderItem> GetFolderItems([FromQuery] string? folderPartialPath) => 
        _filesService.GetFolderItems(folderPartialPath);
}
