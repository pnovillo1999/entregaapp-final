const express = require('express')
const cors = require('cors')
const fileUpload = require('express-fileupload')
require('./database/mongodb')
const router = require('./routes/route')
const path = require('path')
const app = express()
const puerto = 3000

app.use(cors())
app.use(express.json())
//app.use(express.urlencoded({extended:false}))

app.use(fileUpload())
app.use(express.static(path.join(__dirname,"public")))
//app.use(express.static(__dirname+"/public"))
app.use(router)

app.listen(puerto,function(){
	console.log("se conectó en el puerto", puerto)
})
