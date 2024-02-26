import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export const PedidoPage = ()=>{		

	const [islogin, setIsLogin] = useState('')
	const [listaPedido, setListaPedido] = useState([])

	const token = sessionStorage.getItem('token')

	const navigate = useNavigate()

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
			fetchDataPedidos()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const fetchDataPedidos = ()=>{
		fetch(`http://localhost:3000/api/pedido`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			//console.log(json)
			setListaPedido(json.order)						
			console.log(listaPedido)
		})
	}

	const eliminarPedido = (e)=>{
		e.preventDefault()

		let producto_id = e.target[0].value
		
		fetch(`http://localhost:3000/api/pedido/${producto_id}`,{
			method:'DELETE',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
				console.log(json)
				fetchDataPedidos()
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
		<section className="container flex-grow-1">		
			<h1 className="text-center">Panel de Pedidos</h1>
			<hr />			
			<ul className="list-group">
				{listaPedido.map((p)=>(
					<li class="list-group-item d-flex justify-content-between">
					  	<span>{p.codigo_producto.nombre}</span>
					  	<span>{p.codigo_usuario.username}</span>					  	
					  	<span>{p.cantidad}</span>					  	
					  	<span>
						  	<Link to={`/editar-pedido/${p._id}`} className="text-decoration-none mx-2 btn btn-warning">Editar</Link>
						  	<form className="d-inline" onSubmit={eliminarPedido}>
						  		<input type="hidden" name="user_id" value={p._id} />
						  		<input type="submit" value="Eliminar" className="btn btn-danger" />
						  	</form>
					  	</span>
				  	</li>			  
				))}			  
			</ul>
		</section>
		<Footer />
		</>
	)
}