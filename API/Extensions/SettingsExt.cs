using API.Models;
using Microsoft.Extensions.Configuration;
using System.Runtime.CompilerServices;

namespace API.Extensions;

public static class SettingsExt
{
    public const string SettingsNameInAppSettings = "Settings";

    public static IServiceCollection ConfigureSettings(this IServiceCollection self, IConfiguration config)
    {
        var settings = new Settings();

        var section = config.GetSection(SettingsNameInAppSettings);
        
        section.Bind(settings);

        if (string.IsNullOrWhiteSpace(settings.FilesRootFolderPath))
            throw new InvalidOperationException("FilesRootFolderPath is not defined in appsettings.json");

        if (!Directory.Exists(settings.FilesRootFolderPath))
            throw new InvalidOperationException($"FilesRootFolderPath does not exists. Path: {settings.FilesRootFolderPath}");

        self.Configure<Settings>(section);

        return self;
    }
}
