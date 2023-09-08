const validator = require('validator');
const Articulo = require('../modelos/Articulo');
const fs = require('fs');
const path = require('path');

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: 'Mensaje de prueba'
    })

}

const materias = (req, res) => {
    return res.status(200).json({
        primer_cuatri: 'Medios e intro',
        segundo_cuatri: 'Algebra y física',
        tercer_cuatri: 'Análisis y economía',
        cuatro_cuatri: 'Estabilidad 1, proba e hidráulica general'
    })

}
const crear = (req, res) => {

    // Recoger parámetros por post a guardar 
    let parametros = req.body;
    // Validar datos
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 3, max: undefined });
        let validar_contenido = !validator.isEmpty(parametros.contenido);
        if (!validar_titulo || !validar_contenido) {
            throw new Error('No se ha validado la info');
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Faltan datos por enviar',

        })
    }
    // Crear el objeto a guardar
    const articulo = new Articulo(parametros);

    // Asignar valores al objeto basado en el modelo (manual o automático)
    //modo manual: articulo.titulo = parametros.titulo; y así con todos, pero pasandole al parametro (parametros) ya está

    // Guardar el artículo en la base de datos
    articulo.save().then((articuloGuardado) => {

        if (!articuloGuardado) {
            return res.status(400).json({
                status: 'error',
                mensaje: 'No se ha guardado el artículo'
            });
        }
        // Devolver el resultado
        return res.status(200).json({
            status: 'success',
            articulo: articuloGuardado,
            mensaje: 'Artículo guardao con éxito'
        })
    })

}
const listar = (req, res) => {

    let consulta = Articulo.find({});
    if (req.params.ultimos) {
        consulta.limit(2);
    }
    consulta.sort({ fecha: -1 }).exec().then((articulos) => {
        try {
            if (!articulos) {
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'No se han encontrado artículos'
                });
            }
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se han encontrado artículos'
            })
        }


        return res.status(200).send({
            status: 'success',
            parametro: req.params.ultimos,
            articulos,

        })
    })
}
const uno = (req, res) => {
    //recoger un parametro que le pasamos por la url
    let id = req.params.id;

    //buscar el artículo
    Articulo.findById(id).then((articulo) => {

        //si no existe devolver error
        try {
            if (!articulo) {
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'No se han encontrado artículos'
                });
            }
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se han encontrado artículos'
            })
        }
        //si existe devolver el resultado
        return res.status(200).json({
            status: 'success',
            articulo

        })
    })

}

const borrar = (req, res) => {
    let articulo_id = req.params.id;
    Articulo.findOneAndDelete({ _id: articulo_id }).then((articuloBorrado) => {
        try {
            if (!articuloBorrado) {
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'No se han encontrado artículos'
                });
            }
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se han encontrado artículos'
            })
        }
        return res.status(200).json({
            status: 'success',
            articulo: articuloBorrado,
            mensaje: 'Articulo borrado exitosamente'

        })
    });
}

const editar = (req, res) => {
    let articuloId = req.params.id;

    //recoger datos del body
    let parametros = req.body;

    //validar datos
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
            validator.isLength(parametros.titulo, { min: 3, max: undefined });
        let validar_contenido = !validator.isEmpty(parametros.contenido);
        if (!validar_titulo || !validar_contenido) {
            throw new Error('No se ha validado la info');
        }
    }
    catch (error) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Faltan datos por enviar',

        })
    }

    Articulo.findOneAndUpdate({ _id: articuloId }, parametros, { new: true }).then((articuloActualizado) => {
        try {
            if (!articuloActualizado) {
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'Error al actualizar'
                });
            }
        } catch (error) {
            return res.status(404).json({
                status: 'error',
                mensaje: 'Error al actualizar'
            })
        }
        return res.status(200).json({
            status: 'success',
            articulo: articuloActualizado,
            mensaje: 'Articulo actualizado exitosamente'
        })
    })

}

const subir = (req, res) => {
    //configurar multer
    //listo en rutas
    //recoger el archivo de imagen subido
    if (!req.file && !req.files) {
        return res.status(400).json({
            status: 'error',
            mensaje: 'Petición invalida'
        })
    }
    //nombre del archivo 
    let nombreArchivo = req.file.originalname;

    //extension del archivo
    let nombreArchivo_split = nombreArchivo.split('\.');
    let extension = nombreArchivo_split[1];
    //comporbar extension correcto
    if (extension != 'jpg' && extension != 'png' && extension != 'jpeg' && extension != 'gif') {
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: 'error',
                mensaje: 'Archivo inválido'
            })
        })
    } else {
        let articuloId = req.params.id;



        Articulo.findOneAndUpdate({ _id: articuloId }, {imagen: req.file.filename}, { new: true }).then((articuloActualizado) => {
            try {
                if (!articuloActualizado) {
                    return res.status(404).json({
                        status: 'error',
                        mensaje: 'Error al actualizar'
                    });
                }
            } catch (error) {
                return res.status(404).json({
                    status: 'error',
                    mensaje: 'Error al actualizar'
                })
            }
            return res.status(200).json({
                status: 'success',
                articulo: articuloActualizado,
                mensaje: 'Articulo actualizado exitosamente'
            })
        })

        //si todo va bien actualizar el articulo
        return res.status(200).json({
            status: 'success',
            files: req.file,
            nombreArchivo_split
        })
    }

}

const imagen = (req , res) => {
    let fichero = req.params.fichero;
    let ruta_fisica = './imagenes/articulos/'+fichero;
    fs.stat(ruta_fisica , (error , existe)=> {
        if(existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: 'error',
                mensaje: 'La imagen no existe'
            })
        }
    })
}

const buscador = (req , res) => {
    // sacar el string de busqueda
    let busqueda = req.params.busqueda
    // find or 
    Articulo.find({ '$or':[
        {titulo: {'$regex': busqueda , '$options': 'i'}},
        {contenido: {'$regex': busqueda , '$options': 'i'}},
    ]})
    .sort({fecha: -1})
    .exec().then((articulosEncontrados)=> {
        if(!articulosEncontrados || articulosEncontrados.length < 1){
            return res.status(404).json({
                status: 'error',
                mensaje: 'No se ha encontrado ningún artículo bajo ese criterio de busqueda'
            })
        }
        return res.status(200).json({
            status: 'success',
            articulos: articulosEncontrados
        })
    })
    //orden 
    
    // ejecutar consulta

    //devolver resultados
}

module.exports = {
    prueba,
    materias,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador

}