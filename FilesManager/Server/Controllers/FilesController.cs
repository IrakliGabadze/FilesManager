using FilesManager.Server.Models;
using FilesManager.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace FilesManager.Server.Controllers;

[ApiController]
[Route("[controller]")]
[Authorize(Roles = "Administrator")]
public class FilesController : ControllerBase
{
    private readonly FilesService _filesService;

    public FilesController(FilesService filesService)
    {
        _filesService = filesService;
    }

    [HttpGet]
    [Route("DownloadFolder")]
    public Task DownloadZipAsync([FromQuery] string folderItemPartialPath, CancellationToken cancellationToken) =>
        _filesService.DownloadZippedFolderWithImmediateStreamingAsync(HttpContext, folderItemPartialPath, cancellationToken);

    [HttpGet]
    [Route("DownloadFile")]
    public Task DownloadFileAsync([FromQuery] string folderItemPartialPath, CancellationToken cancellationToken) =>
        _filesService.DownloadFileWithImmediateStreamingAsync(HttpContext, folderItemPartialPath, cancellationToken);

    [HttpGet]
    [Route("GetFolderItems")]
    public List<FolderItem> GetFolderItems([FromQuery] string? folderPartialPath) =>
        _filesService.GetFolderItems(folderPartialPath);

    [HttpPost]
    [Route("DeleteFolderItem")]
    public void DeleteFolderItem([FromBody] DeleteFolderItem deleteFolderItem) =>
        _filesService.DeleteFolderItem(deleteFolderItem.PartialPath);

    [HttpPost]
    [Route("CutFolderItem")]
    public void CutFolderItem([FromBody] CutOrCopyFolderItem cutFolderItem) =>
       _filesService.CutOrCopyFolderItem(cutFolderItem, true);

    [HttpPost]
    [Route("CopyFolderItem")]
    public void CopyFolderItem([FromBody] CutOrCopyFolderItem copyFolderItem) =>
       _filesService.CutOrCopyFolderItem(copyFolderItem, false);

    [HttpPost]
    [Route("RenameFolderItem")]
    public void RenameFolderItem([FromBody] RenameFolderItem renameFolderItem) =>
       _filesService.RenameFolderItem(renameFolderItem);

    [HttpPost]
    [Route("CreateFolder")]
    public void CreateFolder([FromBody] CreateFolder createFolder) =>
     _filesService.CreateFolder(createFolder);

    [HttpGet]
    [Route("PreviewVideoOrAudioFile")]
    public IActionResult PreviewVideoOrAudioFile([FromQuery] string partialPath) =>
        _filesService.PreviewVideoOrAudioFile(partialPath);

    [HttpPost]
    [Route("UploadFiles")]
    [DisableRequestSizeLimit]
    [RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue, ValueLengthLimit = int.MaxValue)]
    public Task UploadFilesAsync([FromQuery] string? mainFolderPartialPath, CancellationToken cancellationToken) =>
        _filesService.UploadFilesAsync(mainFolderPartialPath, Request, cancellationToken);
}
