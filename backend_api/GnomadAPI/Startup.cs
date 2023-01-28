/************************************************************************************************
*
* Author: Bryce Schultz, Andrew Rice, Karter Zwetschke, Andrew Ramirez, Stephen Thomson
* Date: 11/28/2022
*
* Purpose: Sets up the REST API, Swagger, and google authentication.
*
************************************************************************************************/

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Interfaces;
using System.IO;
using System.Reflection;
using TravelCompanionAPI.Data;
using TravelCompanionAPI.Models;

namespace TravelCompanionAPI
{
    public class Startup
    {
        private const string CorsPolicyName = "AppPolicy";

        public Startup(IConfiguration configuration)
        {
            // Set the configuration
            Configuration = configuration;

            // Get the connection string from the configuration
            // and set the DatabaseConnection singleton to use it.
            string connection_string = configuration.GetConnectionString("TestingDatabase");
            DatabaseConnection.getInstance().setConnectionString(connection_string);
        }

        public IConfiguration Configuration { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options => options.AddPolicy(
                CorsPolicyName,
                builder => builder
                .WithOrigins("http://localhost:5000", "https://*.google.com", "https://*.googleusercontent.com")
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .SetIsOriginAllowed(origin =>
                {
                    return true;
                })
            ));

            services.AddControllers();

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
            .AddJwtBearer(o =>
            {
                o.IncludeErrorDetails = true;
                o.SecurityTokenValidators.Clear();
                o.SecurityTokenValidators.Add(new GoogleTokenValidator());
            });

            services.AddAuthorization();

            services.AddSwaggerGen(c =>
            {
                OpenApiInfo info = new OpenApiInfo { Title = "TravelCompanionAPI", Version = "v1" };
                c.SwaggerDoc("v1", info);

                c.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.OAuth2,
                    Flows = new OpenApiOAuthFlows
                    {
                        AuthorizationCode = new OpenApiOAuthFlow
                        {
                            AuthorizationUrl = new Uri($"https://accounts.google.com/o/oauth2/auth"),
                            TokenUrl = new Uri($"https://oauth2.googleapis.com/token"),
                            Scopes = new Dictionary<string, string>
                            {
                                {
                                    "https://www.googleapis.com/auth/userinfo.email",
                                    "Email"
                                },
                                {
                                    "https://www.googleapis.com/auth/userinfo.profile",
                                    "Profile"
                                }
                            }
                        }
                    },
                    Extensions = new Dictionary<string, IOpenApiExtension>
                    {
                        {"x-tokenName", new OpenApiString("id_token")}
                    }
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Id = "oauth2", //The name of the previously defined security scheme.
                                Type = ReferenceType.SecurityScheme
                            }
                        },
                        new List<string>()
                    }
                });

                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });

            //Adds dependency injection so that UserTableModifier gets called wherever IDataRepository gets called
            services.AddTransient<IDataRepository<User>, UserTableModifier>();
            //Adds dependency injection so that PinTagTableModifier gets called wherever IDataRepository gets called
            services.AddTransient<IDataRepository<PinTag>, PinTagTableModifier>();
            //Adds dependency injection so that PinTableModifier gets called wherever IDataRepository gets called
            services.AddTransient<IDataRepository<Pin>, PinTableModifier>();
            //Adds a singleton to UserTableModifier
            services.AddSingleton<UserTableModifier>();
            //Adds a singleton to PinTableModifier
            services.AddSingleton<PinTableModifier>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (!Debugger.IsAttached)
            {
                app.UseHttpsRedirection();
            }

            app.UseAuthentication();

            app.UseRouting();

            app.UseCors(CorsPolicyName);

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "TravelCompanionAPI v1");
                    c.OAuthConfigObject.ClientId = Configuration["Authentication:Google:client_id"];
                    c.OAuthConfigObject.ClientSecret = Configuration["Authentication:Google:client_secret"];
                });
            }
        }
    }
}
