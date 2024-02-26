import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export const UsuariosPage = ()=>{	
	const [islogin, setIsLogin] = useState('')
	let user_id = sessionStorage.getItem('id')
	let token = sessionStorage.getItem('token')

	const navigate = useNavigate()
	const [ listaUsuario, setListaUsuario] = useState([])

	useEffect(()=>{
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			//console.log(islogin)
			fetchDataUsuarios()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const fetchDataUsuarios = ()=>{
		fetch(`http://localhost:3000/api/usuario`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			setListaUsuario(json.usuarios)						
			console.log(listaUsuario)
		})
	}

	

	const eliminarUsuario = (e)=>{
		e.preventDefault()

		let usuario_id = e.target[0].value
		console.log(usuario_id)
		fetch(`http://localhost:3000/api/usuario/${usuario_id}`,{
			method:'DELETE',
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
				console.log(json)
				fetchDataUsuarios()
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
			<h1 className="text-center">Panel de usuarios</h1>
			<hr />
			<ul className="list-group">
			{listaUsuario.map((u)=>(
				<li class="list-group-item d-flex justify-content-between">
				  	<span>{u.username}</span>
				  	<span>
					  	<Link to={`/ver-usuario/${u._id}`} className="text-decoration-none text-dark mx-2" >Ver</Link>
					  	<form className="d-inline" onSubmit={eliminarUsuario}>
					  		<input type="hidden" name="user_id" value={u._id} />
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