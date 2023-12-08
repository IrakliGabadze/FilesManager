using FilesManager.Server.Extensions;
using FilesManager.Server.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

const string CorsPolicyname = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSettings(builder.Configuration);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.ExpireTimeSpan =  TimeSpan.FromDays(1);
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.None;
});

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyname, policy =>
    {
        policy.AllowCredentials()
              .WithOrigins("https://localhost:44411")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddMemoryCache();

builder.Services.AddSingleton<ThumbnailService>();

builder.Services.AddSingleton<FilesService>();

builder.Services.AddSingleton<AuthService>();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
    app.UseHsts();

app.UseHttpsRedirection();

app.UseCors(CorsPolicyname);

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

app.Run();
