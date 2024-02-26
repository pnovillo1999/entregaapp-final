const bcrypt = require('bcrypt')
const usuarioSchema = require("../models/usuario")
const auth = require('../auth/jwt')

const controller = {}

controller.allusuarios = async function(req, res){	

	if(req.rol != "admin"){
		return res.status(404).json({error:false, message:'no tenes permiso para ver los usuarios, debes ser admin'})
	}

	const usuarios = await usuarioSchema.find({rol:"usuario"}).select('-password')
	if(usuarios){
		return res.status(200).json({success:true, usuarios})
	}
	
	return res.status(200).json({error:false, menssage:'no hay usuarios registrados'})
	
}

controller.usuarioId = async function(req, res){	
	try{
		await usuarioSchema.validate({_id:req.params.id},['_id'])

		const verify = await usuarioSchema.find({_id:req.userId})		

		if(req.rol != "admin" && verify.length==0){
			
			return res.status(404).json({error:false, message:'no tiene permiso para editar este usuario, debes ser admin o no sos propietario'})
		}

		const usuarioId = await usuarioSchema.findById(req.params.id).select('-password')					

		return res.json({success:true, usuarioId})
	}catch(err){
		//console.log(err)
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}
			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro inválido'})	
			}
			return res.status(404).json({error:false, menssage:errores})
		}

		return res.status(500).json({error:false, menssage:'hubor un error en el sistema'})

	}

}

controller.acceso = async function(req, res){	
	try{

		const acceso_usuario = await usuarioSchema.find({email:req.body.email})
		
		
		if(acceso_usuario.length==0){
			return res.status(404).json({error:false, credenciales:"email incorrecto"})
		}
		// Verificar la contraseña utilizando bcrypt.compare

    	const contrasenaValida = await bcrypt.compare(req.body.password, acceso_usuario[0].password);

    	if (!contrasenaValida) {
      		return res.status(404).json({ error: false, credenciales: "password inválido" });
    	}

		const acceso = auth.generarToken(acceso_usuario[0]._id.toHexString(), acceso_usuario[0])

		return res.status(200).json({success:true, credenciales:acceso})
		
	}catch(err){
		console.log(err)
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}
			/*if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro inválido'})	
			}*/
			return res.status(404).json({error:false, menssage:errores})
		}

		return res.status(500).json({error:false, menssage:'hubor un error en el sistema'})

	}

}

controller.createUsuario = async function(req, res){

	try{
		
		const query = await usuarioSchema.find().select('-password')
		let perfil = "usuario"

		if(query.length==0){
			perfil = "admin"
		}

		const salt = 10
		let passCrypt =req.body.password

		if(req.body.password.length >=6){
			passCrypt = await bcrypt.hash(req.body.password, salt)
		}

		const users = await usuarioSchema({
			username:req.body.username,
			email:req.body.email,
			password: passCrypt,
			rol: perfil
		})

		await users.save()
		

		const acceso = auth.generarToken(users._id.toHexString(), users)

		return res.status(200).json({success:true, menssage:'usuario creado',credenciales:acceso})

	}catch(err){
		console.log(err)
		/*if(err.errors.username){
			return res.status(404).json({error:false, menssage:err.errors.username.properties.message})	
		}
		if(err.errors.email){
			return res.status(404).json({error:false, menssage:err.errors.email.properties.message})	
		}		
		if(err.errors.password){
			return res.status(404).json({error:false, menssage:err.errors.password.properties.message})	
			
		}*/
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			return res.status(404).json({error:false, menssage:errores})	
		}

		return res.status(500).json({error:false, menssage:'hubor un error interno'})
	}	
}

controller.updateUsuario = async function(req, res){

	try{
		if(req.params.id.length==24){

			await usuarioSchema.validate({_id:req.params.id},['_id'])
			/*await usuarioSchema.validate({username:req.body.username},['username'])
			await usuarioSchema.validate({email:req.body.email},['email'])
			await usuarioSchema.validate({password:req.body.password},['password'])*/

			const verify = await usuarioSchema.find({_id:req.userId})		

			if(req.rol != "admin" && verify.length==0){
				return res.status(404).json({error:false, message:'no tiene permiso para editar este usuario, debes ser admin o no son tus datos'})
			}

			const update = await usuarioSchema.updateOne({_id:req.params.id},{
				username:req.body.username,
				email:req.body.email,
				password:req.body.password
			})	

			return res.status(200).json({success:true, menssage:'usuario actualizado'})
		}

		return res.status(400).json({error:false, menssage:'parametro inválido'})
		

	}catch(err){
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro inválido'})	
			}	

			return res.status(400).json({error:false, menssage:errores})	
		}

		return res.status(500).json({error:false, menssage:'hubor un error en la actualizacion, porfavor verifique los parametros'})
	}	
}

controller.deleteUsuario = async function(req, res){
	try{
		await usuarioSchema.validate({_id:req.params.id},['_id'])

		const verify = await usuarioSchema.find({_id:req.userId})		

		if(req.rol != "admin" && verify.length==0){
			return res.status(404).json({error:false, message:'no tiene permiso para eliminar este usuario, debes ser admin o no sos propietario'})
		}

		const d = await usuarioSchema.deleteOne({_id:req.params.id}).exec()	
		
		return res.status(200).json({success:true, menssage:'usuario eliminado'})			

	}catch(err){

		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}
			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro inválido'})	
			}
			return res.status(404).json({error:false, menssage:errores})
		}

 		return res.status(500).json({ success: false, message: 'Error interno del servidor' });
	}
	
}

module.exports = controller