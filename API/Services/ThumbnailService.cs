using Microsoft.Extensions.Caching.Memory;
using System.Drawing;
using System.Drawing.Imaging;

namespace API.Services;

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

    public async Task<string> GetImageThumbnailAsync(string imagePath)
    {
        if (_cache.TryGetValue(imagePath, out var cachedThumbnail) && cachedThumbnail is not null)
            return cachedThumbnail.ToString()!;

        using var image = Image.FromFile(imagePath);

        var thumbnailSize = CalculateThumbnailSize(image, 100);

        using var thumbnail = image.GetThumbnailImage(thumbnailSize.Width, thumbnailSize.Height, null, nint.Zero);

        await using MemoryStream ms = new();

        thumbnail.Save(ms, ImageFormat.Jpeg);

        var thumbnailBytes = ms.ToArray();

        var base64String = Convert.ToBase64String(thumbnailBytes);

        _cache.Set(imagePath, base64String, _cacheEntryOptions);

        return base64String;
    }

    private static Size CalculateThumbnailSize(Image originalImage, int desiredWidth)
    {
        var aspectRatio = (float)originalImage.Width / originalImage.Height;

        var width = desiredWidth;

        var height = (int)(desiredWidth / aspectRatio);

        return new Size(width, height);
    }
}
#pragma warning restore CA1416 // Validate platform compatibility
