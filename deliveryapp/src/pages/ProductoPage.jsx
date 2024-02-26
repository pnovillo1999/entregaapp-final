import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import Swal from 'sweetalert2';

let iniciarComentario = {
	titulo:'',
	comentario:''
}

export const ProductoPage = ()=>{		
	const [islogin, setIsLogin] = useState('')
	const [producto, setProducto] = useState([])
	const [comentario, setComentario] = useState(iniciarComentario)
	const navigate = useNavigate();

	const { id } = useParams()

	let token = sessionStorage.getItem('token')
	let id_user = sessionStorage.getItem('id')
	//console.log(token)
	//console.log(id)

	useEffect(()=>{	
		if(sessionStorage.getItem('usuario')){
			let token = sessionStorage.getItem('token')

			fetch(`http://localhost:3000/api/producto/${id}`,{
				headers:{				
					"Content-Type": "application/json",
					"Authorization":token
				}
			}).then(res=>res.json())
			.then((json)=>{
				console.log(json)
				if(json.menssage){
					navigate("/registro")
					return false
				}
				setProducto(json.productId)

			})
			setIsLogin(sessionStorage.getItem('rol'))	
		}	

	},[])	

	const handleSubmit = function(e){
		e.preventDefault()		
		
		let order = {
			codigo_producto:e.target[0].value,
			codido_usuario:e.target[1].value,
			cantidad:e.target[2].value
		}

		createPedido(order)
	}

	const createPedido=(data)=>{
		console.log(JSON.stringify(data))
		fetch(`http://localhost:3000/api/pedido`,{
			method:'POST',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			},
			body:JSON.stringify(data)
		}).then(res=>res.json())
		.then((res)=>{
			console.log(res)						
			if(res.error==undefined){
				Swal.fire({
				    icon: 'success',
				    title: 'Notificación',
				    text: res.message + ', tu pedido se entregara en 2 dias',
				    showConfirmButton: false,
				    timer: 3000, // milisegundos
				});
				setTimeout(function(){
					navigate("/productos")
				},1000)				
			}else{
				console.log(res)
				throw new Error(res.menssage.cantidad)
			}
		})
		.catch((err)=>{
			Swal.fire({
			    icon: 'error',
			    title: 'Notificación',
			    text: err,
			    showConfirmButton: false,
			    timer: 3000, // milisegundos
			});
		})
	}

	const handleChangeComent = (e) =>{
		setComentario({
			...comentario,
			[e.target.name]:e.target.value
		})		
	}

	const handleSubmitComent = (e) =>{
		e.preventDefault()

		createComent(comentario)
		handleReset()
	}

	const createComent = (data)=>{
		fetch(`http://localhost:3000/api/comentario`,{
			method:'POST',
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
			}else{
				throw new Error("Datos errores o incompletos")
			}
		}).catch((err)=>{
			Swal.fire({
			    icon: 'error',
			    title: 'Notificación',
			    text: err,
			    showConfirmButton: false,
			    timer: 2000, // milisegundos
			});			
		})

	}

	const handleReset = ()=>{
		setComentario(iniciarComentario)
	}


	const handleLogout = async()=>{	
		if(sessionStorage.getItem('usuario')){
			sessionStorage.clear()
			setIsLogin(null)
			navigate("/")
		}
	}


	return(
		<>
		<Header handleLogout={handleLogout} login={islogin} />		           	
		<section className="container flex-grow-1">
			<div className="row mt-3">
				<section className="col-md-4">
					<img src="../images/producto.jpg" alt="alta"  width="100%"/>
				</section>
				<section className="col-md-8 d-flex flex-column justify-content-center align-items-center">				
					<h1>{producto.nombre}</h1>
					<h3>$ {producto.precio}</h3>					
					<form onSubmit={handleSubmit}>
						<input 
							type="hidden" 
							name="id_prod" 
							value={producto._id} 
						/>
						<input 
							type="hidden" 
							name="id_user" 
							value={id_user} 
						/>
						<input 
							type="number" 
							className="form-control" 
							name="cantidad" 
							placeholder="ingrese cantidad" 							
							required
						/>
						<div className="mt-2">
							<input 
								type="submit" 
								className="btn btn-success" 
								value="agregar Pedido" 
							/>		
						</div>						
					</form>	
					
				</section>			
				<div className="text-center py-2">
					<h4>Desea hacer un comentario</h4>
					<form onSubmit={handleSubmitComent} className="border border-2 pt-5 pb-2 px-5 rounded-3">				 						
						<div className="mb-3">
						  <label className="form-label">Titulo</label>
						  <input 
						   type="text" 
						   className="form-control" 
						   name="titulo"
						   placeholder="Ingrese el motivo"
						   onChange={handleChangeComent}
						   value={comentario.titulo}						   
						    />
						</div>
						<div className="mb-3">
							<label className="form-label">Comentario</label>
							<textarea 
								className="form-control" 
								name="comentario" 
								cols="30"
								placeholder="Ingrese el comentario"	
								onChange={handleChangeComent}
								value={comentario.comentario}							
								></textarea>
						</div>
						<div className="mb-3 text-center">	  
					  		<input type="submit" className="btn btn-success" id="btn" value="enviar" />
						</div>
					</form>	
					<hr/>
					<a href="/" className="btn btn-primary">Home</a>
				</div>
			</div>
		</section>
		
		<Footer />
		</>
	)
}