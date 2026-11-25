name: Pipeline DevSecOps - Clinica

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  security-checks:
    runs-on: ubuntu-latest
    steps:
      - name: Descargar codigo fuente
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Escaneo de dependencias (SCA - lodash/minimist)
        run: npm audit --audit-level=high || true

      - name: Analisis estatico de codigo (SAST - SQL Injection)
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/javascript p/owasp-top-ten
