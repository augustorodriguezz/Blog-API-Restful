const express = require('express');
const router = express.Router();
const multer = require('multer');

const articuloControlador = require('../controladores/Articulo');

const almacenamineto = multer.diskStorage({
    destination: (req, file , cb) => {
        cb(null , './imagenes/articulos');
    },
    fileName: (req, file , cb) => {
        cb(null , 'articulo' + Date.now() + file.originalname);
    }
})
const subidas = multer({storage: almacenamineto});

//crear rutas
router.get('/ruta-de-prueba', articuloControlador.prueba);
router.get('/materias', articuloControlador.materias);

//rutas útiles, utilizo el método post que sirve para guardar algo en mi base de datos. Get solo te lo devuelve
router.post('/crear', articuloControlador.crear);
router.get('/articulos/:ultimos?', articuloControlador.listar);
router.get('/articulo/:id', articuloControlador.uno);
router.delete('/articulo/:id', articuloControlador.borrar);
router.put('/articulo/:id', articuloControlador.editar);
router.post('/subir-imagen/:id',[subidas.single('file')], articuloControlador.subir);
router.get('/imagen/:fichero', articuloControlador.imagen);
router.get('/buscar/:busqueda', articuloControlador.buscador);



module.exports = router;