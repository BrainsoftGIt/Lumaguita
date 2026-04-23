#!/bin/bash
cd $(dirname "$0")/..

POSTGRES_STATUS_FILE="/status.d/${POSTGRES_SHARE_D:-${SERVICE:-srv-luma}-postgres}/READY"

# Aguardar até o arquivo de estado ser criado
until [ -f "${POSTGRES_STATUS_FILE}" ]; do
  echo "Banco de dados ainda não está pronto. Aguardando..."
  sleep 2
done

until pg_isready -h "${POSTGRES_HOST:-postgres}" -p "${POSTGRES_PORT:-5432}" -U "${DATABASE_USERNAME:-luma}" -d "${DATABASE_NAME:-luma}"; do
  echo "Waiting for luma to be ready..."
  sleep 2
done



until pg_isready -h "${CLINICA_POSTGRES_HOST:-postgres}" -p "${CLINICA_POSTGRES_PORT:-5432}" -U "${CLINICA_DATABASE_USERNAME:-clinic}" -d "${CLINICA_DATABASE_NAME:-clinic}"; do
  echo "Waiting for clinic to be ready..."
  sleep 2
done


node server/launcher/root --appMode test --app LUMA
