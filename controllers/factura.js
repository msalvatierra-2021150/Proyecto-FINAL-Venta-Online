const { request, response, json } = require("express");

const Factura = require("../models/factura");
const Producto = require("../models/producto");
const ProductosCompradosPorUser = require("../models/productosCompradosPorUser");

const getFacturas = async (req = request, res = response) => {
  //condiciones del get
  const query = { usuario: req.usuario.id };

  const listaFacturas = await Promise.all([
    Factura.countDocuments(query),
    Factura.find(query)
      //.populate('usuario', 'nombre')
      .populate("usuario", "cart"),
  ]);

  return res.json({
    msg: "Lista de Facturas del Cliente",
    listaFacturas,
  });
};

const getFacturaPorId = async (req = request, res = response) => {
  const { id } = req.params;
  const facturaById = await Factura.findById(id);
  res.status(201).json(facturaById);
};

const postFactura = async (req = request, res = response) => {
  const { estado, ...body } = req.body;
  //Omite estado y toma lo demas del body
  const NITEmisor = "1234567-8";

  let totalQuantity = 0;
  let totalPrice = 0;

  //Obtener Info de cada producto

  const carrito = req.usuario.cart;

  //Hacer la sumatoria para el total
  for (let i = 0; i < carrito.length; i++) {
    totalQuantity += carrito[i].quantity;
    totalPrice += carrito[i].precio * carrito[i].quantity;
  }

  let idProducto;
  let stockLlevado;
  let hayStock = true;
  //Actualizar el Stock de los productos comprados
  for (let i = 0; i < carrito.length; i++) {
    //Accedo al ID del producto en el carrito
    idProducto = carrito[i].itemId;

    //Accedo a la cantidad del producto en el carrito
    stockLlevado = carrito[i].quantity;

    //Traigo el Producto de la DB con el ID del producto en el carrito
    let prouductoById = await Producto.findById(idProducto);

    //Revisar que el stock del Producto de la DB sea mayor que el que me llevo
    if (prouductoById.stock < stockLlevado) {
      res.json({
        msg: `El Stock a llevar es mayor del stock actual del producto ${prouductoById.nombre}`,
      });
        hayStock = false;
      break;
    }
    //Accedo al stock del Producto de la DB y le resto la cantidad del producto en el carrito
    prouductoById.stock = prouductoById.stock - stockLlevado;

    let data = {
      stock: prouductoById.stock,
      contadorDeVendidos: prouductoById.contadorDeVendidos + carrito[i].quantity
    };
    //Actualizo el Producto con el Stock actualizado
    let productoActualizado = await Producto.findByIdAndUpdate(
      idProducto,
      data,
      { new: true }
    );

  }

  for (let i = 0; i < carrito.length; i++) {
    //Agrego los productos Comprados por el usuario a el registro de Productos Comprados por user
    const productoComprado = await ProductosCompradosPorUser.findOne({producto_id: carrito[i].itemId, usuario: req.usuario.id});
    console.log(productoComprado);
    if (productoComprado) {
      productoComprado.contadorDeComprados = productoComprado.contadorDeComprados + carrito[i].quantity;
      await productoComprado.save();
    } else {
      const nuevoProductoDelUser = new ProductosCompradosPorUser({
        contadorDeComprados: carrito[i].quantity,
        usuario: req.usuario.id,
        producto_id: carrito[i].itemId,
        producto_nombre: carrito[i].nombre
      });

      await nuevoProductoDelUser.save();
    }
  }

  if (hayStock) {
    //Generar la data a guardar
    const data = {
      ...body,
      NITEmisor: NITEmisor,
      usuario: req.usuario.id,
      nombreUsuario: req.usuario.nombre,
      cart: req.usuario.cart,
      total: totalPrice,
    };

    const factura = await Factura(data);

    //Guardar en DB
    await factura.save();

    res.status(201).json(factura);
    //Despues de esto puedo vaciar el carrito para que se cree la factura, y la proxima
    //Vez genera una nueva factura
  }
};

const putFactura = async (req = request, res = response) => {
  return res.json({
    msg: "Put Factura",
    listaProductos,
  });

  const { id } = req.params;
  const { estado, usuario, ...restoData } = req.body;

  if (restoData.nombre) {
    restoData.nombre = restoData.nombre.toUpperCase();
    restoData.usuario = req.usuario._id;
  }

  const productoActualizado = await Factura.findByIdAndUpdate(id, restoData, {
    new: true,
  });

  res.status(201).json({
    msg: "Put Controller Producto",
    productoActualizado,
  });
};

const deleteFactura = async (req = request, res = response) => {
  return res.json({
    msg: "delete factura",
    listaProductos,
  });

  const { id } = req.params;
  //Eliminar fisicamente de la DB
  //const productoEliminado = await Producto.findByIdAndDelete( id );

  //Eliminar por el estado:false
  const productoEliminado_ = await Factura.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    msg: "DELETE",
    //productoEliminado,
    productoEliminado_,
  });
};

module.exports = {
  postFactura,
  putFactura,
  deleteFactura,
  getFacturas,
  getFacturaPorId,
};
