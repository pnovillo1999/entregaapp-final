import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export const VerUsuarioPage = ()=>{		

	const [islogin, setIsLogin] = useState('')

	const [usuario, setUsuario] = useState('')
	const [pedido, setPedido] = useState([])
	const [messagesp, setMessagesp] = useState([])
	const [comentario, setComentario] = useState([])
	const [messagesc, setMessagesc] = useState([])
	const { id } = useParams()
	const navigate = useNavigate()

	const token = sessionStorage.getItem('token')

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			//console.log(islogin)
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
				//console.log(usuario)				
			})

			setIsLogin(sessionStorage.getItem('rol'))	
			cargarPedido()
			cargarComentario()
		}else{
			setIsLogin(null)							
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
			let add = []
			if(res.error==undefined){
				//console.log(res.order)
				res.order.forEach(function(p){
					//console.log(p.codigo_usuario._id==id)
					if(p.codigo_usuario._id==id){
						//setPedido(p)						
						add.push(p)
						//console.log([p]...)
					}
				})
				//console.log(add)
				setPedido(add)					
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
			setMessagesp(res.menssage)
		})
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
		<section className="container flex-grow-1 my-2">        	
			<h1>Datos personales</h1>
			<hr/>
			<div className="row">
				<div className="col-md-4">
					<img src="/images/foto.png" alt="foto" width="100%" />
					<p className="text-center">{usuario.username}</p>										
					<p className="text-center">{usuario.email}</p>										
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
							    </tr>					    
								))
					  		)}					    
					  </tbody>
					</table>
					<h3>Tus comentarios</h3>
					<hr />
					<ul class="list-group">
					  {comentario.length==0 ? (
							<li><h4 className="text-center bg-danger text-white">{messagesp}</h4></li>
					  	) : (comentario.map((c)=>(
					  			<li class="list-group-item d-flex justify-content-between">
					  				<span>{c.comentario}</span>					  				
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