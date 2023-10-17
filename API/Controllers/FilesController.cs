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

    [HttpGet]
    [Route("GetFolderItems")]
    public List<FolderItem> GetFolderItems([FromQuery] string? folderPartialPath) =>
        _filesService.GetFolderItems(folderPartialPath);

    [HttpPost]
    [Route("DeleteFolderItem")]
    public void DeleteFolderItem([FromBody] string folderPartialPath) =>
        _filesService.DeleteFolderItem(folderPartialPath);

    [HttpPost]
    [Route("CopyFolderItem")]
    public void CopyFolderItem([FromBody] CopyCutFolderItem copyFolderItem) =>
       _filesService.CopyFolderItem(copyFolderItem);

    [HttpPost]
    [Route("CutFolderItem")]
    public void CutFolderItem([FromBody] CopyCutFolderItem cutFolderItem) =>
       _filesService.CutFolderItem(cutFolderItem);
}
