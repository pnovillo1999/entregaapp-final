import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const PanelPage = ()=>{
	const [islogin, setIsLogin] = useState('')
	const navigate = useNavigate();	

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem("rol"))
			console.log(islogin)
		}else{
			setIsLogin(null)							
		}						
	})	

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
			<section className="flex-grow-1">
				<div className="container my-3">
					<div className="row">
						<div className="col-md-3">
							<Link to="/usuarios" className="text-decoration-none">
								<div className="card bg-primary height_custom">							  
								  <div className="card-body text-white d-flex justify-content-center align-items-center">
								    <h5 className="card-title">Usuarios</h5>							    
								  </div>
								</div>
							</Link>
						</div>
						<div className="col-md-3">
							<Link to="/producto-panel" className="text-decoration-none">
								<div className="card bg-success height_custom">							  
								  <div className="card-body text-white d-flex justify-content-center align-items-center">
								    <h5 className="card-title">Productos</h5>							    
								  </div>
								</div>
							</Link>
						</div>
						<div className="col-md-3">
							<Link to="/pedidos" className="text-decoration-none">
								<div className="card bg-warning height_custom">							  
								  <div className="card-body d-flex justify-content-center align-items-center">
								    <h5 className="card-title">Pedido</h5>							    
								  </div>
								</div>
							</Link>
						</div>
						<div className="col-md-3">
							<Link to="/comentarios" className="text-decoration-none">
								<div className="card bg-dark height_custom">							  
								  <div className="card-body text-white d-flex justify-content-center align-items-center">
								    <h5 className="card-title">Comentario</h5>							    
								  </div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	)
}