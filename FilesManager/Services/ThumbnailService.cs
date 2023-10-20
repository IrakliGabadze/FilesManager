using FilesManager.Helpers;
using ImageMagick;
using Microsoft.Extensions.Caching.Memory;

namespace FilesManager.Services;

#pragma warning disable CA1416 // Validate platform compatibility

public class ThumbnailService
{
    private readonly IMemoryCache _cache;

    private static readonly MemoryCacheEntryOptions _cacheEntryOptions = new MemoryCacheEntryOptions()
                                                                            .SetSlidingExpiration(TimeSpan.FromHours(1))
                                                                            .SetAbsoluteExpiration(TimeSpan.FromDays(1));

    public ThumbnailService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public string? GetImageThumbnail(string imagePath, string ext)
    {
        try
        {
            if (_cache.TryGetValue(imagePath, out var cachedThumbnail) && cachedThumbnail is not null)
                return cachedThumbnail.ToString()!;

            using var image = new MagickImage(imagePath);

            var size = new MagickGeometry(1500, 0) { IgnoreAspectRatio = false };
            
            image.Resize(size);

            var thumbnailBytes = image.ToByteArray();

            var fullBaseBase64String = GetFullBase64String(thumbnailBytes, ext);

            _cache.Set(imagePath, fullBaseBase64String, _cacheEntryOptions);

            return fullBaseBase64String;
        }
        catch
        {
            return null;
        }

    }

    public static string GetFullBase64String(byte[] bytes, string fileExt) =>
        $"data:{PathHelper.GetMimeType(fileExt)};charset=utf-8;base64,{Convert.ToBase64String(bytes)}";
}
#pragma warning restore CA1416 // Validate platform compatibility
