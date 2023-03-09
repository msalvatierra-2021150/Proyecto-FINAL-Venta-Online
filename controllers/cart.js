const { request, response } = require("express");
//Importación del modelo
const Usuario = require("../models/usuario");
const Producto = require("../models/producto");
const usuario = require("../models/usuario");

const getCarrito = async (req = request, res = response) => {
  try {
    const idUsuario = req.usuario.id;
    const { cart } = await Usuario.findById(idUsuario).populate("cart.itemId");

    return res.status(200).json({ cart });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const postCarrito = async (req = request, res = response) => {
  const { itemId } = req.params;

  try {
    const item = await Producto.findById(itemId);

    if (!item) {
      return res.status(404).json({ message: "Producto no existente" });
    }

    const idUsuario = req.usuario.id;
    const { cart } = await Usuario.findById(idUsuario);

    const existeEnCarrito = cart.find((item) => item.itemId === itemId);

    if (existeEnCarrito) {
      existeEnCarrito.quantity += 1;
      existeEnCarrito.nombre = item.nombre;
      existeEnCarrito.precio = item.precio;
    } else {
      cart.push({ itemId, quantity: 1 });
    }

    await Usuario.findByIdAndUpdate(idUsuario, { cart });
    return res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putCarrito = async (req = request, res = response) => {
    const { itemId } = req.params;

    try {
      const item = await Producto.findById(itemId);
  
      if (!item) {
        return res.status(404).json({ message: "Producto no existente" });
      }
  
      const idUsuario = req.usuario.id;
      const { cart } = await Usuario.findById(idUsuario);
  
      const existeEnCarrito = cart.find((item) => item.itemId === itemId);
  
      if (existeEnCarrito) {
        if( existeEnCarrito.quantity <= 1) {
            deleteCarrito(req, res);
            return res.status(200).json({ message: "Producto eliminado carrito" });
        }
        existeEnCarrito.quantity -= 1;
      }
  
      await Usuario.findByIdAndUpdate(idUsuario, { cart });
      return res.status(200).json({ message: "Producto degradado en 1 al carrito" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCarrito = async (req = request, res = response) => {
  const { itemId } = req.params;

  try {
    const idUsuario = req.usuario.id;
    const { cart } = await usuario.findById(idUsuario);

    //Filter crea un nuevo array con los items que cumplan con la condicion
    const carritoActualizado = cart.filter((item) => item.itemId !== itemId);

    await Usuario.findByIdAndUpdate(idUsuario, { cart: carritoActualizado });
    return res.status(200).json({ message: "Item eliminado del carrito" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};  

module.exports = {
  getCarrito,
  postCarrito,
  putCarrito,
  deleteCarrito,
};
