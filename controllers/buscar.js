const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];


const buscarProductos = async( termino = '', res = response) => {
    //Le doy el nombre y busca concidencia, y verifica si tiene id valido
    const esMongoID = ObjectId.isValid( termino );  //TRUE

    if ( esMongoID ) {
        const producto = await Producto.findById(termino);
        return res.json({
            results: ( producto ) ? [ producto ] : [] 
            //Preugntar si el usuario existe, si no existe regresa un array vacio
        });
    } 

    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find({
        $or: [ { nombre: regex } ],
        $and: [ { estado: true } ]
    });

    res.json({
        results: productos
    })
}

const buscarPorCategorias = async( termino = '', res = response) => {
     const query = { nombre : termino.toUpperCase() };

    const categoriaEncontrada  = await Categoria.findOne(query);

    const producto = await Producto.find({categoria: categoriaEncontrada.id});

    return res.json({
        producto
    })

    /*
    //Expresiones regulares, buscar sin impotar mayusculas y minusculas (DIFIERE DE EL)
    const regex = new RegExp( producto.nombre , 'i');

    const productos = await Producto.find({
        $or: [ { nombre: regex } ]
    });

    res.json({
        results: productos
    })
    */
}

const buscar = (req = request, res = response) => {

    const { coleccion, termino } = req.params;

    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `La colección: ${ coleccion } no existe en la DB
                  Las colecciones permitidas son: ${ coleccionesPermitidas }`
        });
    }


    switch (coleccion) {
        case 'usuarios':

        break;
        case 'categorias':
            buscarPorCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino, res);
        break;
        default:
            res.status(500).json({
                msg: 'Ups, se me olvido hacer esta busqueda...'
            });
        break;
    }

}


module.exports = {
    buscar
}