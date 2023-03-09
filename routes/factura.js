const { Router } = require('express');
const { check } = require('express-validator');

//Controllers
const { getFacturas, getFacturaPorId, postFactura, putFactura, deleteFactura} = require('../controllers/factura');
const { existeFacturaPorId } = require('../helpers/db-validators');

// Middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminRole } = require('../middlewares/validar-roles');


const router = Router();

//Manejo de rutas

// Obtener todas las categorias - publico
router.get('/mostrar',[
    validarJWT,
    validarCampos
], getFacturas );


// Obtener una categoria por id - publico
router.get('/mostrar/:id', [
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeFacturaPorId ),
    validarCampos
], getFacturaPorId );

// Crear categoria - privada - cualquier persona con un token válido
router.post('/agregar', [
    validarJWT,
    check('NITReceptor', 'El NIT del Receptor es Obligatorio').not().isEmpty(),
    validarCampos
] ,postFactura);

// Actuaizar categoria - privada - cualquier persona con un token válido
router.put('/editar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeFacturaPorId ),
    validarCampos
] ,putFactura);

//Borrar una categoria - privado - Solo el admin puede eliminar una categoria (estado: false)
router.delete('/eliminar/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo Válido').isMongoId(),
    check('id').custom( existeFacturaPorId ),
    validarCampos
] ,deleteFactura);



module.exports = router;