import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { InicioPage } from './pages/InicioPage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { PerfilPage } from './pages/PerfilPage';
import { ProductosPage } from './pages/ProductosPage';
import { ProductoPage } from './pages/ProductoPage';
import { ActualizarPedidoPage } from './pages/ActualizarPedidoPage';
import { ActualizarComentarioPage } from './pages/ActualizarComentarioPage';
import { PanelPage } from './pages/PanelPage';
import { UsuariosPage } from './pages/panel/UsuariosPage';
import { ProductoPanelPage } from './pages/panel/ProductoPanelPage';
import { PedidoPage } from './pages/panel/PedidoPage';
import { ComentarioPage } from './pages/panel/ComentarioPage';
import { NuevoProductoPage } from './pages/panel/NuevoProductoPage';
import { EditarProductoPage } from './pages/panel/EditarProductoPage';
import { EditarPedidoPage } from './pages/panel/EditarPedidoPage';
import { VerUsuarioPage } from './pages/panel/VerUsuarioPage';


function App() {  

  return (
    <Router>
      <Routes>       
        <Route path="/" element={<InicioPage />} />                                
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/usuario/:id" element={<PerfilPage />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/producto/:id" element={<ProductoPage />} />
        <Route path="/actualizar-pedido/:id" element={<ActualizarPedidoPage />} />
        <Route path="/actualizar-comentario/:id" element={<ActualizarComentarioPage />} />
        <Route path="/panel" element={<PanelPage />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/producto-panel" element={<ProductoPanelPage />} />
        <Route path="/pedidos" element={<PedidoPage />} />
        <Route path="/comentarios" element={<ComentarioPage />} />
        <Route path="/nuevo-producto" element={<NuevoProductoPage />} />
        <Route path="/editar-producto/:id" element={<EditarProductoPage />} />
        <Route path="/editar-pedido/:id" element={<EditarPedidoPage />} />        
        <Route path="/ver-usuario/:id" element={<VerUsuarioPage />} />
        

      </Routes>
     </Router>
  )
}

export default App
