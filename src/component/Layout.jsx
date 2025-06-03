import React, { useEffect, useState } from 'react'
import Navbar from './navBar'
import fouter from './fouter'
import Inicio from './inicio'





export default function Layout({children, tipo_layout}) {

    if ( !tipo_layout ) {
        const [showSplash, setShowSplash] = useState(true)

        useEffect(() => {
            setTimeout(() => {
                setShowSplash(false)
            }, 2000)
        },[])

        if (showSplash) {
            return (
                <Inicio/ >
            )
        }
    }

  return (
    <div className='bg-gray-100 relative'>
        <Navbar pagina={ !tipo_layout ? "inicio" : "usuario"} />
        <main className='w-full min-h-screen'>
                {children}
        </main>
       




    </div>
  )
}
