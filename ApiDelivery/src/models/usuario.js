const {Schema, model} = require('mongoose')

const UsuarioSchema = new Schema({
	username:{
		type:String,
		required:[true, 'Se requiere un nombre usuario'],
		minlength: [3, 'El nombre de usuario debe tener al menos 3 caracteres.']		
	},
	email:{
		type:String,
		required:[true, 'Se requiere una dirección de correo electrónico.'],
		unique: [true, 'La dirección de correo electrónico ya está en uso.'],
    	match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'La dirección de correo electrónico no es válida.'],

	},
	password:{
 		type: String,
    	required: [true, 'Se requiere una contraseña.'],
    	minlength: [6, 'La contraseña debe tener al menos 6 caracteres.']
	},
	rol:{
		type:String		
	}
},{
	timestamp:true
})

module.exports = model('usuario', UsuarioSchema)