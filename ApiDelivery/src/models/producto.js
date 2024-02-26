const {Schema, model} = require('mongoose')

const ProductoSchema = new Schema({
	nombre:{
		type: String,	    		 
	    required:[true, 'Se requiere un nombre del producto'],	    
	    minlength: [3, 'El nombre debe tener al menos 3 caracteres.'], 
	    maxlength: [50, 'El nombre no debe exceder los 50 caracteres.']
	},
	precio:{		
		type: Number,
    	required:[true, 'Se requiere el precio'],
    	min: [0, 'El precio no puede ser negativo.']
	},	
	cantidad:{
 		type: Number,
    	required:[true, 'Se requiere la cantidad'],
	    min: [0, 'La cantidad no puede ser negativa.']
	}
},{
	timestamp:true
})

module.exports = model('producto', ProductoSchema)