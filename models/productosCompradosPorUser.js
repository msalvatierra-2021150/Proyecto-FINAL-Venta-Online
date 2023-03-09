const { Schema, model } = require('mongoose');

const ProductoCompradoPorUserSchema = Schema({
    estado: {
        type: Boolean,
        default: true
    },
    contadorDeComprados: {
        type: Number,
        default: 0
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    producto_id: {
        type: String
    },
    producto_nombre: {
        type: String
    }
});


module.exports = model('ProductosCompradosPorUser', ProductoCompradoPorUserSchema);