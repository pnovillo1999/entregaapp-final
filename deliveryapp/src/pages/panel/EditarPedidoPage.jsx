import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Header } from '../../components/Header'
import { Footer } from '../../components/Footer'
import Swal from 'sweetalert2';


let iniciarPedido = {
	codigo_producto:'',
	codigo_usuario:'',
	cantidad:''
}

export const EditarPedidoPage = ()=>{		

	const [islogin, setIsLogin] = useState('')
	const [pedido, setPedido] = useState (iniciarPedido)
	const {id} = useParams()
	const navigate = useNavigate()	

	const token = sessionStorage.getItem('token')
	const user_id = sessionStorage.getItem('id')

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
			fetchData()
		}else{
			setIsLogin(null)							
		}						
	},[])	

	const fetchData=()=>{
		fetch(`http://localhost:3000/api/pedido/${id}`,{
			headers:{				
				"Content-Type": "application/json",
				"Authorization":token
			}
		}).then(res=>res.json())
		.then((json)=>{
			console.log(json)						
			if(json.error==undefined){								
				let jsonPedido = json.pedidoId				
				setPedido(jsonPedido)
			}						
			//console.log(pedido)
		}).catch((err)=>{
			alert("fallo en la carga de datos")
			navigate("/")
		})
	}	


	const handleSubmit = (e)=>{
		e.preventDefault()
		
		let updatePedido = {
			codigo_producto:e.target[0].value,
			codigo_usuario:e.target[1].value,
			//codigo_usuario:user_id,
			cantidad: e.target[2].value
		}

		updateData(updatePedido);
	}

	const updateData = (data)=>{
		console.log(data)
		fetch(`http://localhost:3000/api/pedido/${id}`,{
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
					navigate(`/pedidos`)
				},4000)
			}else{
				throw new Error(res.menssage)
			}
		}).catch((err)=>{
			alert("hubo un error")
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
			<h1 className="text-center my-sm-3 my-md-4">EDITAR PEDIDO</h1>
			<hr className="container" />				
			<div className="row w-50 mx-auto ">
				 <form onSubmit={handleSubmit} className="border border-2 pt-5 pb-2 px-5 rounded-3" id="login">				 						
					<div className="mb-3">
					  <input type="hidden" name="codigo_producto" value={pedido.codigo_producto._id} />
					  <input type="hidden" name="codigo_usuario" value={pedido.codigo_usuario._id} />
					  <label className="form-label">Cantidad</label>
					  <input 
					   type="number" 
					   className="form-control" 
					   name="cantidad" 					   					   
					   placeholder={pedido.cantidad} 
					   required />
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