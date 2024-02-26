import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import Swal from 'sweetalert2';

const iniciarProducto = {
	nombre:'',
	precio:'',
	cantidad:''
}
export const EditarProductoPage = ()=>{		

	const [islogin, setIsLogin] = useState('')
	const [producto, setProducto] = useState(iniciarProducto)
	const [updateProducto, setUpdateProducto] = useState (iniciarProducto)
	const token = sessionStorage.getItem('token')
	const navigate = useNavigate()
	const {id}  = useParams()

	const fetchDataProducto = ()=>{
		fetch(`http://localhost:3000/api/producto/${id}`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)						
			if(json.error==undefined){			
				let jsonProducto = json.productId				
				setProducto(jsonProducto)
			}						
			//console.log(producto)
		}).catch((err)=>{
			alert("fallo en la carga de datos")
			navigate("/")
		})
	}

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
			fetchDataProducto()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const handleChange=(e)=>{
		setUpdateProducto({
			...updateProducto,
			[e.target.name]:e.target.value
		})

	}

	const handleSubmit=(e)=>{
		e.preventDefault()

		console.log(updateProducto)

		updateData(updateProducto)
	}


	const updateData = (data)=>{

		fetch(`http://localhost:3000/api/producto/${id}`,{
			method:'PUT',
			headers:{								
				"Content-Type": "application/json",
				"Authorization":token
			},
			body:JSON.stringify(data)
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			if(json.error==undefined){
				Swal.fire({
				    icon: 'success',
				    title: 'Notificación',
				    text: json.menssage,
				    showConfirmButton: false,
				    timer: 2000, // milisegundos
				});
				setTimeout(function(){
					navigate(`/producto-panel`)
				},4000)
			}else{
				throw new Error(res.menssage)
			}
		}).catch((err)=>{
			alert("hubo un error")
		})
	}

	const handleReset = ()=>{
		setProducto(iniciarProducto)		
	}	

	const handleLogout = async()=>{	
		if(sessionStorage.getItem('usuario')){
			sessionStorage.clear()
			navigate("/")
		}
	}

	return(
		<>	
		<Header handleLogout={handleLogout} login={islogin} />
		<section className="flex-grow-1">
			<h1 className="text-center my-sm-3 my-md-4">EDITAR PRODUCTO</h1>
			<hr className="container" />				
			<div className="row w-50 mx-auto ">
				 <form onSubmit={handleSubmit} className="border border-2 pt-5 pb-2 px-5 rounded-3" id="login">				 						
					<div className="mb-3">
					  <label className="form-label">Nombre</label>
					  <input 
					   	type="text" 
					   	className="form-control" 
					   	name="nombre"					   	
					   	onChange={handleChange}
					   	placeholder={producto.nombre}
					    required />
					</div>
					<div className="mb-3">
						<label className="form-label">Precio</label>
						<input 
							type="text"
							className="form-control" 
							name="precio" 														
							onChange={handleChange}
							placeholder={producto.precio}
							required />
					</div>
					<div className="mb-3">
						<label className="form-label">Cantidad</label>
						<input 
							type="text"
							className="form-control" 
							name="cantidad" 														
							onChange={handleChange}
							placeholder={producto.cantidad}
							required />
					</div>
					<div className="mb-3 text-center">	  
				  		<input type="submit" className="btn btn-success" id="btn" value="Actualizar" />
					</div>	
				 </form>
			</div>
		</section>
		<Footer />
		</>
	)
}