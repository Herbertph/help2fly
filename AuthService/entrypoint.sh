#!/bin/sh

echo "Aguardando o banco de dados ficar pronto..."

until pg_isready -h auth-db -p 5432 -U admin; do
  sleep 1
done

echo "Banco de dados pronto! Iniciando aplicação..."
dotnet AuthService.dll
