//Importaciones
const { Router } = require('express');
const { check } = require('express-validator');
const { getAdmin, postAdmin, putAdmin, deleteAdmin, deleteCliente, EditarCliente, mostrarProductosPorUsuario } = require('../controllers/admin');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { tieneRole, esAdminRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar',[
    validarJWT,
    esAdminRole
] ,getAdmin);

router.post('/agregar', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 digitos').isLength( { min: 6 } ),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom( emailExiste ),
    validarCampos,
] ,postAdmin);

router.put('/editar', [
    validarJWT,
    esAdminRole,
    validarCampos
] ,putAdmin);


router.delete('/eliminar', [
    validarJWT,
    esAdminRole,
    validarCampos
] ,deleteAdmin);

router.delete('/eliminar/usuario/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,deleteCliente);

router.put('/editar/usuario/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] ,EditarCliente);

router.get('/mostrar/compras/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validarCampos
] , mostrarProductosPorUsuario);
module.exports = router;


// ROUTES