import {useState, useEffect} from "react"
import {Link, useNavigate } from 'react-router-dom'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

export const InicioPage = ()=>{
	const [islogin, setIsLogin] = useState('')
	const navigate = useNavigate();	

	useEffect(function(){
		if(sessionStorage.getItem('usuario')){
			setIsLogin(sessionStorage.getItem('rol'))
			console.log(islogin)
		}else{
			setIsLogin(null)							
		}						
	},[])	

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
			<div className="position-relative">	
				<img src="images/envio.jpg" alt="" width="100%" class="img-fluid img-slide" />
				<section className="position-absolute position-custom">					
					<h1 className="h3">ACCESORIO & TECNOLOGIA</h1>
					<hr />
					<div className="d-flex justify-content-between p-2">					
						<h2>Solo Envios</h2>						
						<a href="/productos" className="btn btn-primary">Ver productos</a>												
					</div>					
				</section>					
			</div>	
			<section className="container">
				<h2>Quienos somos..</h2>
				<hr />
				<p>
					En TecnologyApp, nos enorgullece ser más que un proveedor de accesorios de tecnología; somos facilitadores de experiencias excepcionales. Desde nuestro inicio, nos hemos dedicado a elevar la interacción entre las personas y la tecnología, proporcionando accesorios innovadores que no solo complementan, sino que también mejoran cada momento.
				</p>
				<div className="d-flex justify-content-center">
					<hr/>
					<img src="/images/logo.jpg" alt="logo" width="100" />	
					<hr/>
				</div>				
			</section>		
		</section>			
		<Footer />
		</>
	)
}