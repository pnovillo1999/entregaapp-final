const {Schema, model} = require('mongoose')
const user = require('./usuario')

const ComentarioSchema = new Schema({
	titulo:{
		type:String,
		required:[true, 'Se requiere un titulo'],
		minlength: [10, 'El asunto debe tener al menos 10 caracteres.']
	},
	comentario:{
		type:String,
		required:[true, 'Se requiere escribir el comentario.'],		
		minlength: [20, 'El comentario debe tener al menos 20 caracteres.']
	},
	codigo_usuario:{
 		type: Schema.ObjectId,
 		ref:user
	}
},{
	timestamp:true
})

module.exports = model('comentario', ComentarioSchema)