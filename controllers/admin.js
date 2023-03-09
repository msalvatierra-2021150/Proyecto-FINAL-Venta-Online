const { response, request } = require('express');
const bcrypt = require('bcryptjs');
//Importación del modelo
const Usuario = require('../models/usuario');
const ProductosCompradosPorUser = require("../models/productosCompradosPorUser");

const getAdmin = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true , _id: req.usuario.id};

    const listaUsuarios = await Usuario.findById(query);

        return res.json({
            msg: 'get Api - Controlador Usuario',
            Usuario,
            listaUsuarios
        });
}

const postAdmin = async (req = request, res = response) => {
    //Desestructuración
    const { nombre, correo, password} = req.body;
    const rol = req.body.rol || 'ADMIN_ROLE';

    const usuarioGuardadoDB = new Usuario({ nombre, correo, password, rol });

    //Encriptar password
    const salt = bcrypt.genSaltSync();
    usuarioGuardadoDB.password = bcrypt.hashSync(password, salt);

    //Guardar en BD
    await usuarioGuardadoDB.save();

    res.json({
        msg: 'Post Api - Post Usuario',
        usuarioGuardadoDB
    });

}


const putAdmin = async (req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const  id  = req.usuario.id;
    const { _id, img,  rol,  estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)

    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }

        const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
        return res.json({
            msg: 'PUT editar user',
            usuarioEditado
        });
}

const deleteAdmin = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const { id } = req.usuario;

    //Eliminar cambiando el estado a false
    const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });

    return res.json({
        msg: 'DELETE eliminar user',
        usuarioEliminado
    });
}

const deleteCliente = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const {id} = req.params

    //condiciones del get
    const query = { estado: true , _id: req.usuario.id};
    const listaUsuarios = await Usuario.findById(query);

    if ( listaUsuarios.rol == 'ADMIN_ROLE') {
        //Verificar que no elimine otro admin
        const usuarioAEliminar = await Usuario.findById(id);
        if (usuarioAEliminar.rol == 'ADMIN_ROLE') {
            return res.json({
                msg: 'NO PUEDE ELIMINAR A OTRO ADMINISTRADOR',
            });
        } else {
            //Eliminar cambiando el estado a false
            const usuarioEliminado = await Usuario.findByIdAndUpdate(id, { estado: false });
            return res.json({
                msg: 'DELETE eliminar user',
                usuarioEliminado
            });
        }
    } else {
        return res.json({
            msg: 'No es un Administrador'
        });
    }
}

const EditarCliente = async(req = request, res = response) => {
    //Req.params sirve para traer parametros de las rutas
    const {id} = req.params

    const { _id, img,  rol,  estado, google, ...resto } = req.body;
    //Los parametros img, rol, estado y google no se modifican, el resto de valores si (nombre, correo y password)
    
    //Si la password existe o viene en el req.body, la encripta
    if ( resto.password ) {
        //Encriptar password
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(resto.password, salt);
    }
        
    //condiciones del get
    const query = { estado: true , _id: req.usuario.id};
    const listaUsuarios = await Usuario.findById(query);

    if ( listaUsuarios.rol == 'ADMIN_ROLE') {
        //Verificar que no elimine otro admin
        const usuarioAEliminar = await Usuario.findById(id);
        if (usuarioAEliminar.rol == 'ADMIN_ROLE') {
            return res.json({
                msg: 'NO PUEDE EDITAR A OTRO ADMINISTRADOR',
            });
        } else {
            //Editar al usuario por el id
            const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
            return res.json({
                msg: 'PUT editar user',
                usuarioEditado
            });
        }
    } else {
        return res.json({
            msg: 'No es un Administrador'
        });
    }
}

const mostrarProductosPorUsuario = async (req = request, res = response) => {

    //condiciones del get
    const query = { estado: true , usuario: req.params.id};

    const productosCompradosPorUser  = await ProductosCompradosPorUser.find(query);

        return res.json({
            msg: 'get Api - Productos comprados por el Usuario',
            productosCompradosPorUser
        });
}


module.exports = {
    getAdmin,
    postAdmin,
    putAdmin,
    deleteAdmin,
    deleteCliente,
    EditarCliente,
    mostrarProductosPorUsuario
}


// CONTROLADOR