const usuario = require('../controllers/usuarioController')
const producto = require('../controllers/productoController')
const pedido = require('../controllers/pedidoController')
const comentario = require('../controllers/comentarioController')
const express = require('express')
const router = express.Router()
const auth = require('../auth/jwt')


//RUTAS API
router.get('/api/usuario', auth.verificarToken, usuario.allusuarios) //Admin
router.get('/api/usuario/:id',auth.verificarToken, usuario.usuarioId) //x
router.post('/api/usuario', usuario.createUsuario) //x
router.post('/api/usuario/acceso', usuario.acceso) //x
router.put('/api/usuario/:id', auth.verificarToken, usuario.updateUsuario)//x
router.delete('/api/usuario/:id', auth.verificarToken, usuario.deleteUsuario)//x


router.get('/api/producto', auth.verificarToken, producto.allproducto) //x
router.get('/api/producto/:id', auth.verificarToken, producto.productoId) //x
router.post('/api/producto', auth.verificarToken, producto.createProducto) //Admin
router.put('/api/producto/:id', auth.verificarToken, producto.updateProducto) //Admin
router.delete('/api/producto/:id', auth.verificarToken, producto.deleteProducto) //Admin


router.get('/api/pedido', auth.verificarToken, pedido.allPedido) //x
router.get('/api/pedido/:id', auth.verificarToken, pedido.pedidoId) //x
router.post('/api/pedido', auth.verificarToken, pedido.createPedido) //x
router.put('/api/pedido/:id', auth.verificarToken, pedido.updatePedido)//x
router.delete('/api/pedido/:id', auth.verificarToken, pedido.deletePedido)//x


router.get('/api/comentario', auth.verificarToken, comentario.allComentario) //x
router.get('/api/comentario/:id',auth.verificarToken, comentario.comentarioId) //x
router.post('/api/comentario', auth.verificarToken, comentario.createComentario)//x
router.put('/api/comentario/:id', auth.verificarToken, comentario.updateComentario) //x
router.delete('/api/comentario/:id', auth.verificarToken, comentario.deleteComentario) //x

module.exports = router