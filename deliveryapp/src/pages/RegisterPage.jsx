import {useState, useEffect} from "react"
import {Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import Swal from 'sweetalert2';

const initialUser = {
	username:'',
	email:'',
	password:''	
}

export const RegisterPage = ()=>{
	const [islogin, setIsLogin] = useState('')
	const navigate = useNavigate();	

	const [user, setUser] = useState(initialUser)

	const handleChange = (e)=>{
		setUser({
			...user,
			[e.target.name]:e.target.value
		})
	}

	const handleSubmit = (e)=>{
		e.preventDefault();
		//console.log(user)
		/*if(!user.username || !user.email || !user.password){
			alert("Campo requerido!");
			return;
		}*/

		createData(user)
		handleReset()
	}

	const handleReset= (e)=>{
		setUser(initialUser);
	}

	const createData=(data)=>{
		console.log(JSON.stringify(data))
		fetch(`http://localhost:3000/api/usuario`,{
			method:'POST',	
			headers:{'Content-Type':'application/json'},		
			body:JSON.stringify(data)
		}).then(res=>res.json())
		.then((res)=>{
			console.log(res)
			if(res.error==false){
				throw new Error("datos incorrectos o campos vacios")				
				
			}else{
				if(res.credenciales.rol=="admin"){
					saveSession(res.credenciales.username, res.credenciales.rol, res.credenciales.id, res.credenciales.token)
					navigate("/panel")
				}else{
					saveSession(res.credenciales.username, res.credenciales.rol, res.credenciales.id, res.credenciales.token)
					navigate("/")
				}			
			}			
		}).catch((err)=>{
			Swal.fire({
				icon:'error',
				title: 'Notificación',
				text: err,
				showConfirmButton: false,
				timer: 2000, // milisegundos
			})
			//const jsonMessage = JSON.parse(err) 

			//console.log(jsonMessage)
		})
	}

	const saveSession = (sesionUsuario, sesionRol, sesionId, sesionToken)=>{
		sessionStorage.setItem('usuario',sesionUsuario)
		sessionStorage.setItem('rol',sesionRol)
		sessionStorage.setItem('id',sesionId)
		sessionStorage.setItem('token',sesionToken)
	}

	const handleLogout = async()=>{
		
		try{
			//await logout()			
			//console.log(auth)
			navigate("/")			
			setIsLogin(null)						

		}catch(error){
			console.log(error, "error")
		}
	}		


	return(
		<>
		<Header handleLogout={handleLogout} login={islogin} />	
		<section className="flex-grow-1">
			
			<h1 className="text-center my-sm-3 my-md-4">Registro</h1>
			<hr className="container" />				
			<div className="row w-50 mx-auto ">
				 <form onSubmit={handleSubmit} className="border border-2 pt-5 pb-2 px-5 rounded-3" id="login">
				 	<div className="mb-3">
					  <label className="form-label">Nombre de Usuario</label>
					  <input 
					  	type="text" 
					  	className="form-control" 
					  	name="username" 
					  	id="usuario" 
					  	onChange={handleChange}
					  	placeholder="Usuario" />
					</div>
					<div className="mb-3">
					  <label className="form-label">Email address</label>
					  <input 
					  	type="email" 
					  	className="form-control" 
					  	name="email" 
					  	id="email" 
					  	onChange={handleChange}
					  	placeholder="correo@ejemplo.com" />
					</div>
					<div className="mb-3">
					  <label className="form-label">Password</label>
					  <input 
					   type="password" 
					   className="form-control" 
					   name="password" 
					   id="password" 
					   onChange={handleChange}
					   placeholder="elija su contraseña" />
					</div>
					<div className="mb-3 text-center">	  
				  		<input type="submit" className="btn btn-success" id="btn" value="registro" />
					</div>	
				 </form>
			</div>
		</section>
		<Footer />
		</>
	)
}