const {Schema , model } = require('mongoose');

const articuloSchema = Schema({
    titulo: {
        type: String,
        require:  true
    },
    contenido: {
        type: String,
        require:  true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    imagen: {
        type: Date,
        // default: "default.png"
    }
})
module.exports = model("Articulo", articuloSchema, "articulos");







