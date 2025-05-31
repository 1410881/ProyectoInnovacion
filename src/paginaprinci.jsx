import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

// Importar imágenes
import imgSlide1 from "./assets/carrusel/impresiondigital.jpg";
import imgSlide2 from "./assets/carrusel/offset.jpg";
import imgSlide3 from "./assets/carrusel/gran-formato.jpg";

function PaginaPrincipal() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    setImagesLoaded(true);
  }, []);

  const slides = [
    {
      id: 1,
      title: "Impresión Digital",
      description: "Alta calidad para tiradas cortas y medianas",
      image: imgSlide1,
      indicatorLabel: "Digital"  
    },
    {
      id: 2,
      title: "Impresión Offset",
      description: "Perfecto para grandes tiradas con máxima calidad",
      image: imgSlide2,
      indicatorLabel: "Offset"   
    },
    {
      id: 3,
      title: "Gran Formato",
      description: "Carteles, banners y vallas publicitarias",
      image: imgSlide3,
      indicatorLabel: "Formato" 
    }
  ];

  const productosDestacados = [
    { 
      id: 1, 
      nombre: "Tarjetas de Presentación", 
      precio: 120,
      categoria: "Impresión",
      imagen: imgSlide1
    },
    { 
      id: 2, 
      nombre: "Flyers Publicitarios", 
      precio: 80,
      categoria: "Impresión",
      imagen: imgSlide1
    },
    { 
      id: 3, 
      nombre: "Talonarios Personalizados", 
      precio: 45,
      categoria: "Papelería",
      imagen: imgSlide1
    },
    { 
      id: 4, 
      nombre: "Tazas Personalizadas", 
      precio: 55,
      categoria: "Regalos",
      imagen: imgSlide1
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  if (!imagesLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p>Cargando imágenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <div className="pt-16">
        <div className="relative w-screen h-[39.5rem] overflow-hidden bg-gray-200 -mx-3">
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="w-screen flex-shrink-0 relative h-full">
                <img 
                  src={slide.image} 
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23666' font-family='system-ui, sans-serif' font-size='24' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0  bg-opacity-30 flex items-center justify-center z-10">
                  <div className="text-center text-white max-w-2xl px-4">
                    <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                    <p className="text-xl">{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition z-20 w-10 h-10 flex items-center justify-center"
            style={{ borderRadius: '50%' }}  
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-1 rounded-full shadow-md transition z-20 w-10 h-10 flex items-center justify-center"
            style={{ borderRadius: '50%' }}  
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-20">
            {slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                style={{ borderRadius: '50%' }} 
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${currentSlide === index ? 'bg-white text-gray-900' : 'bg-white/50 text-white'}`}
              >
                {slide.indicatorLabel}
                
              </button>
            ))}
          </div>
        </div>

  
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-center mb-8">Productos Más Comprados</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productosDestacados.map((producto) => (
              <div 
                key={producto.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img 
                  src={producto.imagen} 
                  alt={producto.nombre}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect fill='%23ddd' width='800' height='600'/%3E%3Ctext fill='%23666' font-family='system-ui, sans-serif' font-size='24' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="p-4">
                  <span className="text-sm text-gray-500">{producto.categoria}</span>
                  <h3 className="text-lg font-semibold mt-1">{producto.nombre}</h3>
                  <p className="text-green-600 font-bold mt-2">${producto.precio}</p>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default PaginaPrincipal;