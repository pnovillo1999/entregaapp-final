const pedidoSchema = require("../models/pedido")
const productoSchema = require("../models/producto")
const usuarioSchema = require("../models/usuario")

const controller = {}

controller.allPedido = async function(req, res){

	if(req.rol == "admin"){
		const order = await pedidoSchema.find().populate('codigo_producto').populate('codigo_usuario').exec()

		return order.length != 0 ? res.status(200).json({success:true, order}) : res.status(200).json({success:true, message: "no hay pedidos"})
	}

	const order = await pedidoSchema.find({codigo_usuario:req.userId}).populate('codigo_producto').populate('codigo_producto').exec()	

	if(order.length!=0){
		return res.status(200).json({success:true, order})
	}	
	return res.status(200).json({error:false, menssage:'no tenes pedidos'})
}

controller.pedidoId = async function(req, res){

	try{
		await pedidoSchema.validate({_id:req.params.id},['_id'])
		let pedidoId = []
		if(req.rol != "admin"){	
			pedidoId = await pedidoSchema.find({_id:req.params.id, codigo_usuario:req.userId}).populate('codigo_producto').populate('codigo_usuario').exec()		
		}else{
			pedidoId = await pedidoSchema.findById(req.params.id).populate('codigo_producto').populate('codigo_usuario').exec()		

			console.log(pedidoId)
		}				

		if(pedidoId.length!=0){
			return res.status(200).json({success:true, pedidoId})	
		}

		return res.status(404).json({error:false, menssage:'no estas autorizado acceder a este pedido'})		

	}catch(err){
	console.log(err)		
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

controller.createPedido = async function(req, res){

	try{
		
		await pedidoSchema.validate({codigo_producto:req.body.codigo_producto},['codigo_producto'])
		if(!parseInt(req.body.cantidad)){
			await pedidoSchema.validate({codigo_producto:req.body.cantidad},['cantidad'])	
		}	

		let codUser =req.userId

		if(req.rol == "admin"){	
			await pedidoSchema.validate({codigo_usuario:req.body.codigo_usuario},['codigo_usuario'])
			codUser = req.body.codigo_usuario						
		}							

		const order = await pedidoSchema({
			codigo_producto:req.body.codigo_producto,
			codigo_usuario:codUser,
			cantidad:req.body.cantidad
		})

		await order.save()
		return res.status(200).json({success:true, message:'pedido registrado'})
		
	}catch(err){		
		//console.log(err)
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			if(errores.codigo_producto){
				return res.status(404).json({error:false, menssage:"el codigo del producto es invalido"})					
			}			

			if(errores.codigo_usuario){
				return res.status(404).json({error:false, menssage:"el codigo del usuario es invalido"})								}	

			return res.status(404).json({error:false, menssage:errores})	
		}

		return res.status(500).json({error:false, menssage:'hubor un error en el sistema'})
	}	
}

controller.updatePedido = async function(req, res){	

	try{
		
		if(req.params.id.length==24){	
			let codeUser=req.userId 				

			if(req.rol == "admin"){				
				codeUser=req.body.codigo_usuario
			}

			await pedidoSchema.validate({_id:req.params.id},['_id'])
			await pedidoSchema.validate({codigo_producto:req.body.codigo_producto},['codigo_producto'])
			await pedidoSchema.validate({codigo_usuario:codeUser},['codigo_usuario'])
			await pedidoSchema.validate({cantidad:req.body.cantidad},['cantidad'])

			if(req.rol!="admin"){
				const verify = await pedidoSchema.find({_id:req.params.id, codigo_usuario:codeUser})				

				if(verify.length==0){
					return res.status(404).json({error:true, message:'no tiene permiso de editar al pedido solicitado'})
				}
			}									
		
			const order = await pedidoSchema.updateOne({_id:req.params.id},{
				codigo_producto:req.body.codigo_producto,
				codigo_usuario:codeUser,
				cantidad:req.body.cantidad
			})
		
			return res.status(200).json({success:true, menssage:'pedido actualizado'})
		}

		return res.status(404).json({success:true, message:'parametro inválido'})		

	}catch(err){		
		console.log(err)
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro id inválido'})	
			}

			if(errores.codigo_producto){
				return res.status(404).json({error:false, menssage:"el codigo del producto es inválido"})					
			}

			if(errores.codigo_usuario){
				return res.status(404).json({error:false, menssage:"el codigo de usuario es inválido"})					
			}
			
			return res.status(404).json({error:false, menssage:errores})	
		}

		return res.status(500).json({error:false, menssage:'hubor un error en el sistema'})
	}	
}

controller.deletePedido = async function(req, res){
	try{
		await pedidoSchema.validate({_id:req.params.id},['_id'])
		
		if(req.rol != "admin"){	
			const verify = await pedidoSchema.find({_id:req.params.id, codigo_usuario:req.userId})				

			console.log(req.userId)
			
			if(verify.length==0){
				return res.status(404).json({error:true, message:'no tiene permiso de eliminar este pedido'})
			}

		}
		
		const d = await pedidoSchema.deleteOne({_id:req.params.id}).exec()

		return res.status(200).json({success:true, menssage:'pedido eliminado'})


	}catch(err){
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}
			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro id inválido'})	
			}
			return res.status(404).json({error:false, menssage:errores})
		}

 		return res.status(500).json({ success: false, message: 'Error interno del servidor' });
	}

	//	return res.status(200).json({success:true, menssage:'pedido eliminado'})
}

module.exports = controller