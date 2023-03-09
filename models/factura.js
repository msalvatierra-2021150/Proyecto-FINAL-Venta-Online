const { Schema, model } = require('mongoose');

const FacturaSchema = Schema({
    NITEmisor: {
        type: String,
        required: [true , 'El NIT Del Emisor es obligatorio']
    },
    fecha: {
        type: Date,
        default: Date.now  
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    nombreUsuario: {
        type: String,
        required: [true , 'El nombre del Usuario es obligatorio']
    },
    NITReceptor: {
        type: String,
        required: [true , 'El NIT del receptor es obligatorio']
    },
    cart: {
        type: Array,
        default: []
    },
    total: {
        type: Number,
        required: [true , 'El total es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
});


module.exports = model('Factura', FacturaSchema);