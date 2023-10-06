﻿using API.Helpers;
using API.Models;

namespace API.Extensions;

public static class SettingsExt
{
    public const string SettingsNameInAppSettings = "Settings";

    public static IServiceCollection ConfigureSettings(this IServiceCollection self, IConfiguration config)
    {
        var settings = new Settings();

        var section = config.GetSection(SettingsNameInAppSettings);

        section.Bind(settings);

        if (!string.IsNullOrWhiteSpace(settings.FilesRootFolderPath) &&
            (!PathHelper.PathIsSafe(settings.FilesRootFolderPath) || !Directory.Exists(settings.FilesRootFolderPath)))
        {
            throw new InvalidOperationException("FilesRootFolderPath is not correct in appsettings.json");
        }

        self.Configure<Settings>(section);

        return self;
    }
}
