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
    public void DeleteFolderItem([FromBody] DeleteFolderItem deleteFolderItem) =>
        _filesService.DeleteFolderItem(deleteFolderItem.PartialPath);

    [HttpPost]
    [Route("CopyFolderItem")]
    public void CopyFolderItem([FromBody] CutOrCopyFolderItem copyFolderItem) =>
       _filesService.CopyFolderItem(copyFolderItem);

    [HttpPost]
    [Route("CutFolderItem")]
    public void CutFolderItem([FromBody] CutOrCopyFolderItem cutFolderItem) =>
       _filesService.CutFolderItem(cutFolderItem);

    [HttpPost]
    [Route("RenameFolderItem")]
    public void RenameFolderItem([FromBody] RenameFolderItem renameFolderItem) =>
       _filesService.RenameFolderItem(renameFolderItem);
}
