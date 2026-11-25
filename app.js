const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Mitigación de hallazgos web (OWASP ZAP): Cabeceras de seguridad HTTP y ocultar versión del servidor
app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());

// Conexión a la base de datos de expedientes de la clínica
const db = new sqlite3.Database('./clinica.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  }
});

// 2. Ruta corregida: Búsqueda segura de expediente de paciente
app.get('/api/pacientes', (req, res) => {
  const { curp } = req.query;

  // Validación básica de entrada antes de consultar
  if (!curp || typeof curp !== 'string' || curp.trim().length === 0) {
    return res.status(400).json({ error: 'El parámetro CURP es obligatorio.' });
  }

  /* 
   * ANTES (Vulnerable a SQL Injection por concatenación directa):
   * const query = "SELECT id, nombre, diagnostico, alergias FROM pacientes WHERE curp = '" + curp + "'";
   * db.all(query, [], (err, rows) => { ... });
   */

  // DESPUÉS (Corregido con consulta parametrizada):
  const querySegura = 'SELECT id, nombre, diagnostico, alergias FROM pacientes WHERE curp = ?';

  db.all(querySegura, [curp.trim()], (err, rows) => {
    if (err) {
      // No exponer detalles internos de SQL al cliente
      return res.status(500).json({ error: 'Error interno al consultar el expediente.' });
    }
    return res.json({ resultados: rows });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de la clínica ejecutándose de forma segura en el puerto ${PORT}`);
});
