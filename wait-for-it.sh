#!/bin/sh

set -e

host="$1"
port="$2"
shift 2
cmd="$@"

# Nombre maximum de tentatives avant d'abandonner
max_attempts=30
attempts=0

echo "\033[33m⏳ Attente de MySQL sur $host:$port...\033[0m"

until nc -z "$host" "$port"; do
  attempts=$((attempts + 1))

  if [ "$attempts" -ge "$max_attempts" ]; then
    echo "\033[31m❌ Échec : MySQL n'est pas disponible après $max_attempts tentatives.\033[0m"
    exit 1
  fi

  >&2 echo "MySQL est indisponible - nouvelle tentative dans 1s ($attempts/$max_attempts)"
  sleep 1
done

echo "\033[32m✅ MySQL est disponible - exécution de la commande...\033[0m"
exec $cmd
