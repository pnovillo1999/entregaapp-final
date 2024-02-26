import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Header = ({handleLogout, login})=>{
	const navigate = useNavigate();
	const usuario = sessionStorage.getItem('usuario')
	const user_id = sessionStorage.getItem('id')
	console.log(login)
	return(
		<>
		<section>
	        <nav className="navbar navbar-expand-lg bg-info-subtle">
	          <div className="container">
	            <Link className="navbar-brand" to="/">TecnologyApp</Link>
	            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	              <span className="navbar-toggler-icon"></span>
	            </button>
	            <div className="collapse navbar-collapse" id="navbarSupportedContent">
	            {login=="usuario" ? 
	              <ul className="navbar-nav ms-auto">
	                <li className="nav-item">
	                  <Link className="nav-link" aria-current="page" to="/productos">Productos</Link>
	                </li>	  
	                <li className="nav-item">
	                  <Link className="nav-link active" aria-current="page" to={'/usuario/'+ user_id}>{usuario}</Link>
	                </li>	               	                	                
	                <li className="nav-item">
	                  <button type="submit" className="nav-link" onClick={handleLogout}>Salir</button>
	                </li>	                
	              </ul>
	            : login=="admin" ? (
	            	<ul className="navbar-nav ms-auto">
		                <li className="nav-item">
		                  <Link className="nav-link" aria-current="page" to="/productos">Productos</Link>
		                </li>	                	                	                		                
						<li className="nav-item">
	                  		<Link className="nav-link active" to="/panel">{usuario}</Link>
	                	</li>	               	                	                
		                <li className="nav-item">
		                  <button type="submit" className="nav-link" onClick={handleLogout}>Salir</button>
		                </li>	                
	              	</ul>	            	
	            	) :
	            	<ul className="navbar-nav ms-auto">
		                <li className="nav-item">
		                  <Link className="nav-link" aria-current="page" to="/productos">Productos</Link>
		                </li>	                
		                <li className="nav-item">
		                  <Link className="nav-link" to="/login" >Login</Link>	                  
		                </li>
		                <li className="nav-item">
		                  <Link className="nav-link" to="/registro">Registro</Link>
		                </li>      	                
	              </ul>}	            
	            </div> 
	          </div>
	        </nav>
      	 </section>

		</>
	)
}