const { response } = require('express');


const usuariosGet = (req, res = response) => {
    
    const { q, nombre, apiKey, page = 1, limit } = req.query;
    
    res.json({
        msg: 'GET API - controlador',
        q,
        nombre,
        apiKey,
        page,
        limit
    });
}

const usuariosPost = (req, res) => {
    
    const { nombre, edad } = req.body;
    
    res.status(201).json({
        msg: 'POST API - controlador',
        nombre,
        edad
    });
}

const usuariosPut = (req, res) => {
    
    const { id } = req.params;
    
    res.json({
        msg: 'PUT API - controlador',
        id
    });
}

const usuariosPatch = (req, res) => {
    res.json({
        msg: 'PATCH API - controlador'
    });
}

const usuariosDelete = (req, res) => {
    res.json({
        msg: 'DELETE API - controlador'
    });
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}