import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'

export const ComentarioPage = ()=>{	
	const [islogin, setIsLogin] = useState('')
	const [listaComentario, setListaComentario] = useState([])
	const token = sessionStorage.getItem('token')

	const navigate = useNavigate()

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
			fetchDataComentarios()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const fetchDataComentarios = ()=>{
		fetch(`http://localhost:3000/api/comentario`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)
			setListaComentario(json.comment)
			//console.log(listaUsuario)
		})
	}

	const eliminarComentario = (e)=>{
		e.preventDefault()

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
				fetchDataComentarios()
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
		<section className="flex-grow-1">		
			<h1 className="text-center">Panel de Comentario</h1>
			<hr />
			<div className="container table-responsive">			
			<table className="table">
				<thead>
				<tr>
					<th>Titulo</th>
					<th>Comentario</th>
					<th>Usuario</th>
					<th>Acciones</th>
				</tr>
				</thead>
				<tbody>
				{listaComentario.map((c)=>(
					<tr>
					  	<td>{c.titulo}</td>					  	
					  	<td>{c.comentario}</td>			
					  	<td>{c.codigo_usuario.username}</td>					  			  	
					  	<td>						  	
						  	<form className="d-inline" onSubmit={eliminarComentario}>
						  		<input type="hidden" name="user_id" value={c._id} />
						  		<input type="submit" value="Eliminar" className="btn btn-danger" />
						  	</form>
					  	</td>
				  	</tr>			  
				))}		
				</tbody>	  
			</table>
			</div>
		</section>
		<Footer />
		</>
	)
}