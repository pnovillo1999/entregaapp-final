const productoSchema = require("../models/producto")

const controller = {}

controller.allproducto = async function(req, res){
	const productos = await productoSchema.find()
	if(productos){
		return res.status(200).json({success:true, productos})
	}

	return res.status(200).json({error:false, menssage:'no hay productos'})

}

controller.productoId = async function(req, res){
	try{

		await productoSchema.validate({_id:req.params.id},['_id'])

		const productId = await productoSchema.findById(req.params.id)
		
		return res.status(200).json({success:true, productId})

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

controller.createProducto = async function(req, res){
	try{	

		if(req.rol != "admin"){
			return res.status(404).json({error:false, message:'no tiene permiso para crear, debes ser admin'})
		}		

		const product = await productoSchema({
			nombre:req.body.nombre,
			precio:req.body.precio,
			cantidad:req.body.cantidad			
		})

		await product.save()

		return res.status(200).json({success:true, menssage:'producto registrado'})

	}catch(err){		
		if(err.name  == 'ValidationError'){
			const errores = {}

			for(const field in err.errors){
				errores[field] = err.errors[field].message
			}

			return res.status(404).json({error:false, menssage:errores})	
		}

		return res.status(500).json({error:false, menssage:'hubor un error en el registro'})
	}	
}

controller.updateProducto = async function(req, res){

	try{
		if(req.params.id.length==24){

			if(req.rol != "admin"){
				return res.status(404).json({error:false, message:'no tiene permiso para crear, debes ser admin'})
			}

			//console.log(req.body.nombre)

			/*await productoSchema.validate({_id:req.params.id})
			await productoSchema.validate({nombre:req.body.nombre},['nombre'])
			await productoSchema.validate({precio:req.body.precio},['precio'])
			await productoSchema.validate({cantidad:req.body.cantidad},['cantidad'])*/

			const product = await productoSchema.updateOne({_id:req.params.id},{
				nombre:req.body.nombre,
				precio:req.body.precio,
				cantidad:req.body.cantidad			
			})			

			return res.status(200).json({success:true, menssage:'producto actualizado'})
		}

		return res.status(404).json({success:true, menssage:'parametro inválido'})
		

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

		return res.status(500).json({error:false, menssage:'hubor un error en el registro'})
	}	
}

controller.deleteProducto = async function(req, res){

	try{

		if(req.rol != "admin"){
			return res.status(404).json({error:false, message:'no tiene permiso para eliminar, debes ser admin'})
		}

		await productoSchema.validate({_id:req.params.id},['_id'])

		const d = await productoSchema.deleteOne({_id:req.params.id}).exec()	
		
		return res.status(200).json({success:true, menssage:'producto eliminado'})			

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