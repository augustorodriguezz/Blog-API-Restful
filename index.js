const { conexion } = require('./basedatos/conexion');
const express = require('express');
const cors = require('cors');

//inicializando app
console.log('App arrancada');

//conectando a la base de datos
conexion();

//crear un servidor de node
const app = express();
const puerto = 3900;

//configurar el cors
app.use(cors());

//convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//crear rutas o endpoints

const rutas_articulo = require('./rutas/Articulo');
app.use('/api', rutas_articulo);

app.get('/probando', (req, res) => {
    return res.status(200).json([{
        nombre: 'Augusto',
        apellido: 'Rodriguez',
        carrera: 'Ingeniería Civil',
        edad: 21
    },{
        nombre: 'Marin',
        apellido: 'Gonzalez',
        carrera: 'Abogacía',
        edad: 23
    }, {
        nombre: 'Romina',
        apellido: 'Paredes',
        carrera: 'Veterinaria',
        edad: 20
    }
    ]);    
})

app.get('/', (req, res) => {
    return res.status(200).send(`
    <h1>Empezando a crear una API Rest con Node</h1>
    `);    
})

//crear servidor y escuchar servidores
app.listen(puerto , ()=> {
    console.log('Servidor corriendo en el puerto: '+puerto);
})