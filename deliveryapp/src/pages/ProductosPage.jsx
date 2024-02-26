import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const ProductosPage = ()=>{
	const [islogin, setIsLogin] = useState('')
	const [productos, setProductos] = useState([])		

	const navigate = useNavigate()

	useEffect(()=>{	
		if(sessionStorage.getItem('usuario')){
			let token = sessionStorage.getItem('token')

			fetch("http://localhost:3000/api/producto",{
				headers:{				
					"Content-Type": "application/json",
					"Authorization":token				
				}
			}).then(res=>res.json())
			.then((json)=>{
				console.log(json)
				if(json.mensaje){
					navigate("/registro")
					return false
				}
				setProductos(json.productos)

			})

			setIsLogin(sessionStorage.getItem('rol'))	
		}else{
			navigate("/registro")
		}	

	},[])

	const handleLogout = async()=>{	
		if(sessionStorage.getItem('usuario')){
			sessionStorage.clear()
			setIsLogin("null")
			navigate("/")
		}
	}

	return(
		<>	
		<Header handleLogout={handleLogout} login={islogin} />		           
        <section className="container flex-grow-1">        	
        	<h1 className="text-center my-3">Nuestros Productos</h1>
        	<hr />
        	<div className="row">
        	{productos.map((pro)=>(
				<div className="col-12 col-md-6 col-lg-3 col-xl-3 mt-2">
        			<div className="card text-center h-100 bg-light-subtle p-1">
        				<img src="../images/producto.jpg" alt="prod" className="card.img-top img-custom"/>
        				<h5 className="card-title text-center mt-2">
        					{pro.nombre}
        				</h5>
        				<p className="card-text text-center">
        					{pro.precio}
        				</p>        				
        				<Link to={'/producto/' + pro._id} className="btn btn-primary text-center">Ver</Link>        				
        			</div>
        		</div>
        	))}        		
        	</div>
        </section>
        <Footer />
		</>
	)
}