import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export const ProductoPanelPage = ()=>{	
	const [islogin, setIsLogin] = useState('')
	const [listaProducto, setListaProducto] = useState([])

	const token = sessionStorage.getItem('token')

	const navigate = useNavigate()

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
			fetchDataProductos()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const fetchDataProductos = ()=>{
		fetch(`http://localhost:3000/api/producto`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			setListaProducto(json.productos)						
			//console.log(listaUsuario)
		})
	}

	const eliminarProducto = (e)=>{
		e.preventDefault()

		let producto_id = e.target[0].value
		
		fetch(`http://localhost:3000/api/producto/${producto_id}`,{
			method:'DELETE',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
				console.log(json)
				fetchDataProductos()
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
		<h1 className="text-center">Panel de productos</h1>
			<hr />
			<div className="text-end py-2">
				<Link to="/nuevo-producto" className="btn btn-primary">Nuevo Producto</Link>
			</div>
			<ul className="list-group">
			{listaProducto.map((p)=>(
				<li class="list-group-item d-flex justify-content-between">
				  	<span>{p.nombre}</span>
				  	<span>
					  	<Link to={`/editar-producto/${p._id}`} className="text-decoration-none mx-2 btn btn-warning">Editar</Link>
					  	<form className="d-inline" onSubmit={eliminarProducto}>
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