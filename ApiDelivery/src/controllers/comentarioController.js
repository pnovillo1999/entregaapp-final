const comentarioSchema = require("../models/comentario")

const controller = {}

controller.allComentario = async function(req, res){

	if(req.rol == "admin"){
		const comment = await comentarioSchema.find().populate('codigo_usuario').exec()	
		
		return comment.length != 0 ? res.status(200).json({success:true, comment}) : res.status(200).json({success:true, message: "no hay comentarios"})
	}

	const comment = await comentarioSchema.find({codigo_usuario:req.userId}).populate('codigo_usuario').exec()

	if(comment.length!=0){
		return res.status(200).json({success:true, comment})
	}
	return res.status(200).json({error:false, menssage:'no tenes comentarios hechos'})

}

controller.comentarioId = async function(req, res){

	try{

		await comentarioSchema.validate({_id:req.params.id},['_id'])

		let commentId = []

		if(req.rol != "admin"){
			 commentId = await comentarioSchema.find({_id:req.params.id, codigo_usuario:req.userId}).populate('codigo_usuario').exec()	
		}else{
			 commentId = await comentarioSchema.findById(req.params.id).populate('codigo_usuario').exec()
		}		

		if(commentId.length!=0){
			return res.status(200).json({success:true, commentId})
		}
	
		return res.status(404).json({error:false, menssage:'no estas autorizado ver el comentario'})

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
		
		return res.status(500).json({error:false, menssage:'hubor un error en el sistema'})
	}
}

controller.createComentario = async function(req, res){

	try{	

		const commentCreate = await comentarioSchema({
			titulo:req.body.titulo,
			comentario:req.body.comentario,
			codigo_usuario:req.userId
		})

		await commentCreate.save()
		return res.status(200).json({success:true, menssage:'comentario registrado'})		

	}catch(err){
		if(err.name== 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}			

			return res.status(404).json({error:false, menssage:errores})
		}
		
		return res.status(500).json({error:false, message:'hubo un error en el sistema'})
	}	

}

controller.updateComentario = async function(req, res){

	try{

		if(req.params.id.length==24){		

			await comentarioSchema.validate({_id:req.params.id},['_id'])
			await comentarioSchema.validate({titulo:req.body.titulo},['titulo'])
			await comentarioSchema.validate({comentario:req.body.comentario},['comentario'])

			const verify = await comentarioSchema.find({_id:req.params.id, codigo_usuario:req.userId})			

			if(verify.length==0){
				return res.status(404).json({error:true, message:'no tiene permiso de editar el comentario'})
			}

			const commentUpdate = await comentarioSchema.updateOne({_id:req.params.id},{
				titulo:req.body.titulo,
				comentario:req.body.comentario,
				codigo_usuario:req.userId
			})
			
			return res.status(200).json({success:true, menssage:'comentario actualizado'})
		}

		return res.status(404).json({success:false, menssage:'parametro inválido'})

	}catch(err){
		if(err.name== 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			if(errores._id){
				return res.status(404).json({error:false, menssage:'parametro inválido'})	
			}		

			return res.status(404).json({error:false, menssage:errores})
		}

		return res.status(500).json({erro:false, message:'hubo un error en el sistema'})
	}

}

controller.deleteComentario = async function(req, res){
	try{

		await comentarioSchema.validate({_id:req.params.id},['_id'])

		if(req.rol != "admin"){
			const verify = await comentarioSchema.find({_id:req.params.id, codigo_usuario:req.userId})				

			if(verify.length==0){
				return res.status(404).json({error:true, message:'no tiene permiso de eliminar el comentario'})
			}
		}

		const d = await comentarioSchema.deleteOne({_id:req.params.id}).exec()

		return res.status(200).json({success:true, message:'comentario eliminado'})


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

 		return res.status(500).json({ success: false, message: 'Error interno del servidor' });
	}
}

module.exports = controller