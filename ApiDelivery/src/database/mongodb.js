const mgoose = require('mongoose')

require("dotenv").config()
//console.log(process.env.URI)

mgoose.connect(process.env.URI)
.then(function(db){
	console.log("la base de datos de MongoDB esta connectada")
})
.catch(function(err){
	console.log(err)
})