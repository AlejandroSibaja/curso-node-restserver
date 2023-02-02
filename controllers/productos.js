const { response } = require("express");
const { Producto } = require('../models');

const obtenerProductos = async(req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;

    const [ total, productos ] = await Promise.all([
        Producto.countDocuments({ estado: true }),
        Producto.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
    ])
    
    res.json({
        total,
        productos
    });
}

const obtenerProducto = async(req, res = response) => {

    const { id } = req.params;

    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    
    res.json( producto );
}

const crearProducto = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre,
        usuario: req.usuario._id,
    }

    const producto = new Producto( data );

    // Guardar DB
    await producto.save();

    res.status(201).json( producto );

}

const actualizarProducto = async(req, res) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if ( data.nombre ) {
        data.nombre  = data.nombre.toUpperCase();
    }
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, data, { new: true });
    
    res.json(producto);
}

const borrarProducto = async(req, res) => {
    
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false }, { new: true });

    res.json(producto);
}

module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}