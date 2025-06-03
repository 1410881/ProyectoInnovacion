import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../js/UserContext";
import logo from "../assets/logo.PNG";

import tarjetasImg from "../assets/productos/tarjetas.jpg";
import flyersImg from "../assets/productos/flyers.jpg";
import postersImg from "../assets/productos/posters.jpg";
import talonariosImg from "../assets/productos/talonarios.jpg";
import libroactasImg from "../assets/productos/libroactas.jpg";
import blocksImg from "../assets/productos/blocks.jpg";
import tazasImg from "../assets/productos/tazas.jpg";
import llaverosImg from "../assets/productos/llaveros.jpg";
import cajasImg from "../assets/productos/cajas.jpg";
import bolsasImg from "../assets/productos/bolsas.jpg";
import etiquetasImg from "../assets/productos/etiquetas.jpg";
import cintasImg from "../assets/productos/cintas.jpg";
import burbujasImg from "../assets/productos/burbujas.jpg";
import libretasImg from "../assets/productos/libretas.jpg";
import formularioscontinuosImg from "../assets/productos/formularioscontinuos.jpg";
import invitacionesImg from "../assets/productos/invitaciones.jpg";
import bannersImg from "../assets/productos/banners.jpg";
import backdropsImg from "../assets/productos/backdrops.jpg";
import archivadores from "../assets/productos/archivadores.jpg"


function Navbar() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_role");
    localStorage.removeItem("cart");
    setUser(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const categories = [
    {
      name: "Impresión",
      items: [
        { name: "Tarjetas", img: tarjetasImg },
        { name: "Flyers", img: flyersImg },
        { name: "Posters", img: postersImg }
      ]
    },
    {
      name: "Papelería",
      items: [
        { name: "Talonarios", img: talonariosImg },
        { name: "Libretas de actas", img: libroactasImg },
        { name: "Blocks", img: blocksImg },
        { name: "Formularios continuos", img: formularioscontinuosImg }
      ]
    },
    {
      name: "Regalos",
      items: [
        { name: "Tazas", img: tazasImg },
        { name: "Llaveros", img: llaverosImg }
      ]
    },
    {
      name: "Embalaje",
      items: [
        { name: "Cajas", img: cajasImg },
        { name: "Bolsas", img: bolsasImg },
        { name: "Etiquetas", img: etiquetasImg },
        { name: "Cintas", img: cintasImg },
        { name: "Burbujas", img: burbujasImg }
      ]
    },
    {
      name: "Oficina",
      items: [
        { name: "Libretas", img: libretasImg },
        { name: "Archivadores", img: archivadores }
      ]
    },
    {
      name: "Eventos",
      items: [
        { name: "Invitaciones", img: invitacionesImg },
        { name: "Banners", img: bannersImg },
        { name: "Backdrops", img: backdropsImg }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center border-b border-black">
        <Link to="/">
          <img src={logo} alt="Logo Imprenta" className="h-12" />
        </Link>

        <div className="flex space-x-8 items-center">
          {/* Usuario logueado: igual diseño que "Acceder" */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <>
                <Link to="/personal" className="text-gray-700 hover:text-blue-600 transition">
                  <div className="flex flex-col items-center bg-white rounded-lg px-3 py-1" style={{ minWidth: 60 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-medium text-purple-700">{user.name}</span>
                  </div>
                </Link>
                {/* Botón de cerrar sesión visible */}
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition">
                <div className="flex flex-col items-center bg-white rounded-lg px-3 py-1" style={{ minWidth: 60 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs font-medium text-purple-700">Acceder</span>
                </div>
              </Link>
            )}
            {/* Dropdown solo si está logueado */}
            {dropdownOpen && user && (
              <div className="absolute right-0 mt-2 w-36 !bg-white border border-indigo-400 rounded shadow-lg z-50" style={{ backgroundColor: "#fff" }}>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-purple-700 font-semibold"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          <Link to="/carrito" className="text-gray-700 hover:text-blue-600 transition">
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-xs font-medium">Carrito</span>
            </div>
          </Link>
        </div>
      </div>

      <div className="bg-gray-100 w-full border-t border-b border-black">
        <div className="flex relative">
          {categories.map((category, index) => (
            <div key={index} className="group flex-1 relative">
              <button className="w-full px-4 py-3 text-gray-800 hover:bg-gray-200 transition-colors duration-200 font-medium text-center border-r border-black last:border-r-0 cursor-pointer">
                {category.name}
              </button>

              <div className={`
                absolute top-full bg-white border border-black shadow-lg 
                hidden group-hover:flex flex-nowrap py-2 z-50
                ${index >= categories.length - 2 ? 'right-0' : 'left-0'}
                ${index <= 1 ? 'left-0' : ''}
              `}>
                <div className="flex px-2 space-x-2">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={`/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex flex-col items-center p-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-20 h-20 object-contain mb-2"
                      />
                      <span className="text-sm font-medium text-gray-800 px-4 text-center">{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;