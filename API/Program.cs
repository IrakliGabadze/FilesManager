using API.Extensions;
using API.Services;

const string CorsPolicyname = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

builder.Services.ConfigureSettings(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: CorsPolicyname, policy =>
            {
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            });
});

builder.Services.AddSingleton<FilesService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CorsPolicyname);

app.UseAuthorization();

app.MapControllers();

app.Run();
