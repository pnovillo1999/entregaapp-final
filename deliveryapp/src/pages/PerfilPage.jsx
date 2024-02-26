import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import Swal from 'sweetalert2';

export const PerfilPage = ()=>{		
	const [islogin, setIsLogin] = useState('')
	const [usuario, setUsuario] = useState('')
	const [pedido, setPedido] = useState([])
	const [messagesp, setMessagesp] = useState([])
	const [comentario, setComentario] = useState([])
	const [messagesc, setMessagesc] = useState([])
	const { id } = useParams()
	const navigate = useNavigate()

	let token = sessionStorage.getItem('token')

	useEffect(()=>{	
		if(sessionStorage.getItem('usuario')){			

			fetch(`http://localhost:3000/api/usuario/${id}`,{
				headers:{				
					"Content-Type": "application/json",
					"Authorization":token				
				}
			}).then(res=>res.json())
			.then((json)=>{
				if(json.usuarioId==undefined){
					navigate("/login")
					return false
				}
				setUsuario(json.usuarioId)
				
			})

			setIsLogin(sessionStorage.getItem('rol'))	
			cargarPedido()
			cargarComentario()
		}else{
			navigate("/login")
		}	

	},[])

	const cargarPedido = ()=>{
		fetch('http://localhost:3000/api/pedido',{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((res)=>{
			console.log(res)
			if(res.error==undefined){
				setPedido(res.order)
				return true
			}
			setMessagesp(res.menssage)
		})
	}

	const cargarComentario = ()=>{
		fetch('http://localhost:3000/api/comentario',{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((res)=>{
			console.log(res)
			if(res.error==undefined){
				setComentario(res.comment)
				return true
			}
			setMessagesc(res.menssage)
		})
	}


	const handleSubmit = (e)=>{
		e.preventDefault()

		let nombreUsuario = {
			username: e.target[0].value
		}

		fetch(`http://localhost:3000/api/usuario/${id}`,{
			method:'PUT',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			},
			body:JSON.stringify(nombreUsuario)
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			if(json.error==undefined){
				Swal.fire({
				    icon: 'success',
				    title: 'Notificación',
				    text: json.menssage,
				    showConfirmButton: false,
				    timer: 3000, // milisegundos
				});				
			}else{
				throw new Error(res.menssage)
			}

		}).catch((err)=>{
			alert("se genero un error")
		})

		//console.log(e.target[0].value)


	}

	const eliminarPedido = (e)=>{
		e.preventDefault()
		//console.log(e.target[0].value)
		let pedido_id = e.target[0].value		
		fetch(`http://localhost:3000/api/pedido/${pedido_id}`,{
			method:'DELETE',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			cargarPedido()
		})

	}


	const eliminarComentario = (e)=>{
		e.preventDefault()
		//console.log(e.target[0].value)
		let comentario_id = e.target[0].value		
		fetch(`http://localhost:3000/api/comentario/${comentario_id}`,{
			method:'DELETE',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			cargarComentario()
		})

	}

	const bajaTotal = (e) =>{
		e.preventDefault()
		if(sessionStorage.getItem('usuario')){

			fetch(`http://localhost:3000/api/usuario/${id}`,{
				method:'DELETE',
				headers:{				
					"Content-Type": "application/json",
					"Authorization":token
				}
			}).then(res=>res.json())
			.then((json)=>{
				console.log(json)
				if(json.error==undefined){
					Swal.fire({
					    icon: 'error',
					    title: 'Notificación',
					    text: json.menssage + ", Ud se ha dado de Baja",
					    showConfirmButton: false,
					    timer: 2000, // milisegundos
					});
					setTimeout(function(){
						navigate("/registro")
					},4000)		
				}else{
					throw new Error(res.menssage)
				}
			}).catch((err)=>{
				alert("Hubo un error")
			})

			
		}

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
		<section className="container flex-grow-1 my-2">        	
			<h1>Datos personales</h1>
			<hr/>
			<div className="row">
				<div className="col-md-4">
					<img src="/images/foto.png" alt="foto" width="100%" />
					<p className="text-center">{usuario.username}</p>					
					<p>Editar usuario</p>
					<hr/>
					<form onSubmit={handleSubmit} className="text-center">
						<div className="pb-2">
							<input 
								type="text" 
								className="form-control form-control-sm" 
								name="username" 
								id="" 
								placeholder="usuario" 
								/>	
						</div>						
						<input 
							type="submit" 
							className="btn btn-success btn-sm" 
							name="" 
							value="actualizar" />
					</form>					
					<hr/>
					<form onSubmit={bajaTotal} className="text-center">						
						<input 
							type="submit" 
							className="btn btn-danger btn-sm" 
							name="" 
							value="Darde de Baja" />
					</form>
				</div>
				<section className="col-md-8">
					<h3>Pedidos</h3>					
					<hr />
					<table className="table">
					  <thead>
					    <tr>					      
					      <th scope="col">Pedido</th>
					      <th scope="col">Precio</th>
					      <th scope="col">Cantidad</th>
					      <th>acciones</th>
					    </tr>
					  </thead>
					  <tbody>
					  	{pedido.length==0 ? (
					  		<td  colspan="4"><h4 className="text-center bg-danger text-white">{messagesp}</h4></td>
					  		) : (
							pedido.map((p)=>(
								<tr>							      
							      <td>{p.codigo_producto.nombre}</td>
							      <td>{p.codigo_producto.precio}</td>
							      <td>{p.cantidad}</td>
							      <td>							      
							      	<Link to={`/actualizar-pedido/${p._id}`} className="btn btn-warning btn-sm mx-2" >Actualizar</Link>
							      	<form className="d-inline" onSubmit={eliminarPedido}>
							      		<input type="hidden" name="codigo_producto" value={p._id} />
							      		<input type="submit" className="btn btn-danger btn-sm" value="eliminar" />
							      	</form>
							      </td>							      
							    </tr>					    
								))
					  		)}					    
					  </tbody>
					</table>
					<h3>Tus comentarios</h3>
					<hr />
					<ul class="list-group">
					  {comentario.length==0 ? (
							<li><h4 className="text-center bg-danger text-white">{messagesc}</h4></li>
					  	) : (comentario.map((c)=>(
					  			<li class="list-group-item d-flex justify-content-between">
					  				<span>{c.comentario}</span>
					  				<span>
					  					<Link to={`/actualizar-comentario/${c._id}`} className="mx-2 text-dark">editar</Link>					  					
							      	</span>
					  			</li>
					  		))
							
					  	)}				  					  
						
					</ul>
				</section>
			</div>
		</section>		
		<Footer />
		</>
	)
}