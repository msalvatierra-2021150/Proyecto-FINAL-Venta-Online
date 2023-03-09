const { request, response } = require('express');
const categoria = require('../models/categoria');
const Categoria = require('../models/categoria');
const Producto = require('../models/producto');

const getCategorias = async (req = request, res = response) => {

     //condiciones del get
     const query = { estado: true };

     const listaCategorias = await Promise.all([
         Categoria.countDocuments(query),
         Categoria.find(query).populate('usuario', 'nombre')
     ]);
 
     res.json({
         msg: 'get Api - Controlador Usuario',
        listaCategorias
     });

}


const getCategoriaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const categoriaById = await Categoria.findById( id ).populate('usuario', 'nombre');

   res.status(201).json( categoriaById );

}


const postCategoria = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    //validacion para verificar si ya existe dicha categoria para que no lo agregue
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);
    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}


const putCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...resto } = req.body;

    resto.nombre = resto.nombre.toUpperCase();
    resto.usuario = req.usuario._id;

    //Editar o actualiar la cateogira
    const categoriaEditada = await Categoria.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json(categoriaEditada);

}

const deleteCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const categoriaPorDefecto = 'DEFECTO';

        //Verificar si Por DEFECTO existe
        const existeCategoria = await Categoria.findOne({nombre: categoriaPorDefecto});
    
        if ( !existeCategoria ) {
            const categoria = new Categoria( {
                nombre: 'DEFECTO',
                usuario: req.usuario.id
            });

            //Guardar en DB
            await categoria.save();
        }

        const query1 = { nombre:'DEFECTO' }
        const idCategoriaDefecto = await Categoria.findOne(query1);


    //Pasar la categoria que tenia por una DEFECTO
    const producto  = await Producto.updateMany({categoria: id},{ categoria:  idCategoriaDefecto.id});

    //Editar o actualiar la cateogira: Estado FALSE
    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.status(201).json(categoriaBorrada);

}

module.exports = {
    getCategorias,
    getCategoriaPorID,
    postCategoria,
    putCategoria,
    deleteCategoria
}
