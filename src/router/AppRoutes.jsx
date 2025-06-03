import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import PaginaPrincipal from '../paginaprinci'

import Layout from '../component/Layout'
import Login from '../component/login'
import Register from '../component/register';
import Tarjetas from '../formproducts/impresion/tarjetas'
import CarritoCompras from '../component/carrito'
import Etiquetas from '../formproducts/embalaje/etiquetas'
import Bolsa from '../formproducts/embalaje/bolsa'
import Cintas from '../formproducts/embalaje/cintas'
import Cajas from '../formproducts/embalaje/cajas'
import BurbujasEmbalaje from '../formproducts/embalaje/burbujas'
import LibretasPersonalizadas from '../formproducts/oficina/libretas'
import ArchivadoresPersonalizados from '../formproducts/oficina/archivadores'
import InvitacionesPersonalizadas from '../formproducts/eventos/invitaciones'
import BannersPersonalizados from '../formproducts/eventos/banners'
import BackdropsPersonalizados from '../formproducts/eventos/backdrops'
import LlaverosPersonalizados from '../formproducts/regalos/llaveros'
import TazasPersonalizadas from '../formproducts/regalos/tazas'
import FlyersPersonalizados from '../formproducts/impresion/flyers'
import PostersPersonalizados from '../formproducts/impresion/poster'
import TalonariosPersonalizados from '../formproducts/papeleria/talonarios'
import LibretasActas from '../formproducts/papeleria/libretasdeaactas'
import BlocksPersonalizados from '../formproducts/papeleria/blocks'
import FormulariosContinuos from '../formproducts/papeleria/formularioscontinuos'

//USUARIOS --
import ComprasProcesos from '../component/userOptions/compras_en_procesos/procesos'
import ConsultasRecientes from '../component/userOptions/consultas_recientes/consultas'
import ComprasEstado from '../component/userOptions/compras_canceladas_en_espera/comprasEstado'
import HistorialCompra from '../component/userOptions/historial_de_compras/historial'
import TableroDatos from '../component/userOptions/tablero_de_datos/tablero'

//ADMINISTRADOR --
import PedidosRecientes from '../component/adminOptions/pedidos_recientes/pedidos'
import PedidosEstado from '../component/adminOptions/pedidos_aprobados_cancelados/pedidosEstado'
import HistorialClientes from '../component/adminOptions/historial_de_clientes/historial'
import DatosMes from '../component/adminOptions/dato_del_mes/dato'

export default function () {
  return (
    <Suspense fallback={<div>Loading</div>}>
        <Routes >
            <Route path='/' element={<Layout><PaginaPrincipal/></Layout>}/>  
            <Route path='/login' element={<Layout><Login/></Layout>}/>  
            <Route path='/register' element={<Layout><Register/></Layout>}/>  
            <Route path='/carrito' element={<Layout><CarritoCompras/></Layout>}/>  
            <Route path='/tarjetas' element={<Layout><Tarjetas/></Layout>}/>  
            <Route path='/etiquetas' element={<Layout><Etiquetas/></Layout>}/>  
            <Route path='/bolsas' element={<Layout><Bolsa/></Layout>}/>  
            <Route path='/cintas' element={<Layout><Cintas/></Layout>}/>  
            <Route path='/cajas' element={<Layout><Cajas/></Layout>}/>  
            <Route path='/burbujas' element={<Layout><BurbujasEmbalaje/></Layout>}/>  
            <Route path='/libretas' element={<Layout><LibretasPersonalizadas/></Layout>}/>  
            <Route path='/archivadores' element={<Layout><ArchivadoresPersonalizados/></Layout>}/>  
            <Route path='/invitaciones' element={<Layout><InvitacionesPersonalizadas/></Layout>}/>
            <Route path='/banners' element={<Layout><BannersPersonalizados/></Layout>}/>  
            <Route path='/backdrops' element={<Layout><BackdropsPersonalizados/></Layout>}/> 
            <Route path='/llaveros' element={<Layout><LlaverosPersonalizados/></Layout>}/> 
            <Route path='/tazas' element={<Layout><TazasPersonalizadas/></Layout>}/> 
            <Route path='/flyers' element={<Layout><FlyersPersonalizados/></Layout>}/>
            <Route path='/posters' element={<Layout><PostersPersonalizados/></Layout>}/>
            <Route path='/talonarios' element={<Layout><TalonariosPersonalizados/></Layout>}/>
            <Route path='/libretas-de-actas' element={<Layout><LibretasActas/></Layout>}/> 
            <Route path='/blocks' element={<Layout><BlocksPersonalizados/></Layout>}/>
            <Route path='/formularios-continuos' element={<Layout><FormulariosContinuos/></Layout>}/>

            {/* USUARIOS ---------------------------------------------------------------------------- */}
            <Route path='/procesos' element={<Layout tipo_layout={"usuario"}><ComprasProcesos/></Layout>}/>
            <Route path='/consultas' element={<Layout tipo_layout={"usuario"}><ConsultasRecientes/></Layout>}/>
            <Route path='/compras_estado' element={<Layout tipo_layout={"usuario"}><ComprasEstado/></Layout>}/>
            <Route path='/historial_compra' element={<Layout tipo_layout={"usuario"}><HistorialCompra/></Layout>}/>
            <Route path='/tablero_datos' element={<Layout tipo_layout={"usuario"}><TableroDatos/></Layout>}/>

            {/* ADMINISTRADOR ---------------------------------------------------------------------------- */}
            <Route path='/pedidos_recientes' element={<Layout tipo_layout={"admin"}><PedidosRecientes/></Layout>}/>
            <Route path='/pedidos_estado' element={<Layout tipo_layout={"admin"}><PedidosEstado/></Layout>}/>
            <Route path='/historial_cliente' element={<Layout tipo_layout={"admin"}><HistorialClientes/></Layout>}/>
            <Route path='/datos_mes' element={<Layout tipo_layout={"admin"}><DatosMes/></Layout>}/>

        </Routes>
    </Suspense>
  )
}
