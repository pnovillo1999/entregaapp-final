const {Schema, model} = require('mongoose')
const product = require('./producto')
const user = require('./usuario')

const PedidoSchema = new Schema({	
	
	codigo_producto:{
		type: Schema.ObjectId,
		required:true,
		ref:product		
	},
	codigo_usuario:{		
		type: Schema.ObjectId,
		required:true,
		ref:user		
	},
	cantidad:{
 		type: Number,
    	required:[true, 'Se requiere la cantidad'],
	    min: [0, 'La cantidad no puede ser negativa.']
	},	
	fecha_realizada:{
		 type: Date,
		 default: new Date()
	},	
	fecha_entrega:{
		type: Date,
		default:function(){
			const now=new Date()
			now.setDate(now.getDate()+2)
			return now
		}		
	}
},{
	timestamp:true
})

module.exports = model('pedido', PedidoSchema)