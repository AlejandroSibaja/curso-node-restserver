const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {
    
    // const { q, nombre, apiKey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0 } = req.query;
    
    // const usuarios = await Usuario.find({ estado: true })
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments({ estado: true });

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments({ estado: true }),
        Usuario.find({ estado: true })
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async(req, res) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    // Guardar en DB
    await usuario.save();
    
    res.status(201).json({
        usuario
    });
}

const usuariosPut = async(req, res) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    // TODO: validar contra base de datos
    if( password ) {
        // Encriptar contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    };

    const usuario = await Usuario.findByIdAndUpdate( id, resto );
    
    res.json(usuario);
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'PATCH API - controlador'
    });
}

const usuariosDelete = async(req, res) => {
    
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuario = await Usuario.findByIdAndUpdate( id, { estado: false } );

    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}