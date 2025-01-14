const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Establecemos los parámetros de conexión
const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'curd'
});

// Conexión a la database
conexion.connect(function(error) {
    if (error) {
        throw error;
    } else {
        console.log("¡Conexión exitosa a la base de datos!");
    }
});

app.get('/', function(req, res) {
    res.send('Ruta INICIO');
});

// Mostrar todos los artículos
app.get('/api/articulos', (req, res) => {
    conexion.query('SELECT * FROM articulos', (error, filas) => {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
});

// Mostrar un SOLO artículo
app.get('/api/articulos/:id', (req, res) => {
    conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error, fila) => {
        if (error) {
            throw error;
        } else {
            res.send(fila);
        }
    });
});

// Crear un artículo
app.post('/api/articulos', (req, res) => {
    let data = { descripcion: req.body.descripcion, precio: req.body.precio, stock: req.body.stock };
    console.log(data)
    let sql = "INSERT INTO articulos SET ?";
    conexion.query(sql, data, function(err, result) {
        if (err) {
            throw err;
        } else {
            Object.assign(data, { id: result.insertId });
            res.send(data);
        }
    });
});

// Editar artículo
app.put('/api/articulos/:id', (req, res) => {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    let precio = req.body.precio;
    let stock = req.body.stock;
    let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";
    conexion.query(sql, [descripcion, precio, stock, id], function(error, results) {
        if (error) {
            throw error;
        } else {
            res.send(results);
        }
    });
});

// Eliminar artículo
app.delete('/api/articulos/:id', (req, res) => {
    conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], function(error, filas) {
        if (error) {
            throw error;
        } else {
            res.send(filas);
        }
    });
});

const puerto = process.env.PUERTO || 3000;
app.listen(puerto, function() {
    console.log("Servidor Ok en puerto:" + puerto);
});
