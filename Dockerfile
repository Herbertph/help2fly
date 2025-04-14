# Etapa 1: build da aplicação
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ./AuthService ./AuthService

WORKDIR /src/AuthService
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out ./

ENV ASPNETCORE_URLS=http://+:80
EXPOSE 80

ENTRYPOINT ["dotnet", "AuthService.dll"]
