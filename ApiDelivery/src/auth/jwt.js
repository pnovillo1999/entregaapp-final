const jwt = require('jsonwebtoken')

const key = 'pablo'

function generarToken(id, usuario){	
	const {username, rol } = usuario
	const payload = { usuario }

	const token = jwt.sign(payload, key, {expiresIn:'1h'})

	return {id, username, rol, token}
}

function verificarToken(req, res, next){
	let token = req.header('Authorization')

	//token = typeof token=="undefined" ? token : token.slice(7)	

	if(!token){
		return res.status(401).json({mensaje:'Token no generado'})
	}

	jwt.verify(token, key,(error, decoded)=>{
		if(error){
			return res.status(401).json({mensaje:'Token no valido, Ud no esta registrado'})
		}	

		req.userId = decoded.usuario._id
		req.rol = decoded.usuario.rol

		next()
	})
}

module.exports={
	generarToken,
	verificarToken
}