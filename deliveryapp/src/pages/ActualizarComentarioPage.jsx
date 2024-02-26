import { useState, useEffect } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useParams, useNavigate, Link} from 'react-router-dom'
import Swal from 'sweetalert2';

let iniciarComentario = {
	titulo:'',
	comentario:''
}


export const ActualizarComentarioPage  =()=>{
	const [islogin, setIsLogin] = useState('')
	const [comentario, setComentario] = useState (iniciarComentario)
	const [updateComent, setUpdateComent] = useState (iniciarComentario)
	const {id} = useParams()
	const navigate = useNavigate()

	let token = sessionStorage.getItem('token')
	let id_user = sessionStorage.getItem('id')	

	const fetchData=()=>{		
		fetch(`http://localhost:3000/api/comentario/${id}`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			//console.log(json.commentId)						
			if(json.error==undefined){								
				let jsonComentario = json.commentId[0]
				//console.log(jsonComentario)
				setComentario(jsonComentario)
			}						
			//console.log(comentario.titulo)
		}).catch((err)=>{
			alert("fallo en la carga de datos")
			navigate("/")
		})

	}

	const handleChange = (e) =>{

		setUpdateComent({
			...updateComent,
			[e.target.name]: e.target.value
		})

	}

	const handleSubmit = (e) => {
		e.preventDefault()		
		//console.log(updateComent)
		updateData(updateComent);
		handleReset()	
	}

	const updateData = (data)=>{
		fetch(`http://localhost:3000/api/comentario/${id}`,{
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
					navigate(`/usuario/${id_user}`)
				},4000)
			}else{
				throw new Error(res.menssage)
			}
		}).catch((err)=>{
			alert("hubo un error")
		})
	}

	const handleReset = ()=>{
		setComentario(iniciarComentario)		
	}	

	useEffect(()=>{
		if(sessionStorage.getItem('usuario')){
			fetchData()		
			setIsLogin(sessionStorage.getItem('rol'))	
		}		
		
	},[])


	const handleLogout = ()=>{
		if(sessionStorage.getItem('usuario')){
			sessionStorage.clear()
			navigate("/")
			setIsLogin(null)
		}

	}	
	return(		
		<>
			<Header handleLogout={handleLogout} login={islogin} />
			<section className="flex-grow-1">
				<h1 className="text-center my-sm-3 my-md-4">Editar Comentario</h1>
			<hr className="container" />				
			<div className="row w-50 mx-auto ">
				 <form onSubmit={handleSubmit} className="border border-2 pt-5 pb-2 px-5 rounded-3" id="login">				 						
					<div className="mb-3">
					  <label className="form-label">Titulo</label>
					  <input 
					   type="text" 
					   className="form-control" 
					   name="titulo"
					   placeholder={comentario.titulo}
					   onChange={handleChange}
					    required />
					</div>
					<div className="mb-3">
						<label className="form-label">Comentario</label>
						<textarea 
							className="form-control" 
							name="comentario" 
							cols="30"
							placeholder={comentario.comentario}
							onChange={handleChange}
							required ></textarea>
					</div>
					<div className="mb-3 text-center">	  
				  		<input type="submit" className="btn btn-success" id="btn" value="actualizar" />
					</div>	
				 </form>
			</div>
			</section>
			<Footer />
		</>
		)
}