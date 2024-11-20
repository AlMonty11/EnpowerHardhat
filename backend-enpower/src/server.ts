const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Keycloak = require('keycloak-connect');
require('dotenv').config();

// dotenv.config();
const mongoUri: string = `mongodb://${process.env.DB_IP}:27017/${process.env.MONGO_DB}`;

if (mongoUri=="") {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}
// Configuración de conexión a MongoDB
mongoose.connect(mongoUri as string, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Conectado a MongoDB");
}).catch((err: Error) => {
  console.error("Error de conexión a MongoDB:", err);
});

// Configuración de Express
const app = express();
app.use(bodyParser.json());

app.use(cors());

// Configuración de Keycloak
const keycloak = new Keycloak({}, {
  "realm": process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_URL,
  "ssl-required": "external",
  "resource": process.env.KEYCLOAK_CLIENT_ID,
  "credentials": {
    "secret": process.env.KEYCLOAK_CLIENT_SECRET
  },
  "confidential-port": 0
});

app.use(keycloak.middleware());

// Ruta protegida de ejemplo
app.get(`http://${process.env.KEYCLOAK_IP}:8180/api/secure-data`, keycloak.protect(), (req: Request, res: Response) => {
  res.json();
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});


