/*jshint esversion: 6 */
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
    
});

connection.connect((err)=>{
    if (err) {
        console.log(`El error de conexion es: ${err}`);
        return;
    } else {
        console.log("¡Conexion a la base de datos exitosa!");
    }
});


module.exports = connection;