const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  pool: {
    max: 500,       // Reducir el número máximo de conexiones
    min: 0,         // Permitir que el pool cierre conexiones inactivas
    acquire: 300, // Ajustar el tiempo máximo de espera para obtener una conexión
    idle: 1000,    // Ajustar el tiempo máximo de inactividad antes de cerrar una conexión
  },
});

// Verificación de conexión
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('Error al conectar con la base de datos:', err);
  });

module.exports = sequelize;