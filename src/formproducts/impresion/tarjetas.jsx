import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import tarjetaEjemploImg from "../../assets/productos/tarjetas.jpg";
import muestra1 from "../../assets/productos/tarjetas.jpg";
import muestra2 from "../../assets/productos/tarjetas.jpg";
import muestra3 from "../../assets/productos/tarjetas.jpg";


const MATERIALES = {
  'Estándar': 'Cartulina 300gsm (Incluye terminado mate)',
  'Premium': 'Cartulina 400gsm (+S/0.30 c/u)',
  'Ecológico': 'Papel reciclado 280gsm (+S/0.10 c/u)',
  'Lujo': 'Cartulina con acabado perlado (+S/0.50 c/u)'
};

const TERMINADOS = {
  'Mate': 'Sin costo adicional',
  'Brillo': '+S/0.20 c/u',
  'Soft Touch': '+S/0.40 c/u',
  'Relieve': '+S/0.60 c/u (solo para áreas específicas)'
};

const TarjetasPresentacion = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: tarjetaEjemploImg, alt: "Tarjeta estándar" },
    { id: 2, src: muestra1, alt: "Tarjeta ejecutiva" },
    { id: 3, src: muestra2, alt: "Tarjeta premium" },
    { id: 4, src: muestra3, alt: "Tarjeta con diseño personalizado" }
  ];

  const producto = {
    nombre: 'Tarjetas de Presentación',
    imagen: tarjetaEjemploImg,
    descripcion: 'Tarjetas profesionales para tu negocio o marca personal',
    precioBase: 0.80,
    cantidadMinima: 100,
    tiempoProduccion: '3-5 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    material: 'Estándar',
    color: 'Blanco',
    tamaño: 'Estándar (8.5x5 cm)',
    terminado: 'Mate',
    diseño: {
      logo: null,
      texto: '',
      dobleCara: true
    }
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfiguracion({
          ...configuracion,
          diseño: {
            ...configuracion.diseño,
            logo: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setConfiguracion({
      ...configuracion,
      diseño: {
        ...configuracion.diseño,
        logo: null
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cambiarImagenPrincipal = (nuevaImagen) => {
    if (nuevaImagen === imagenPrincipal) return;
    
    setIsChangingImage(true);
    setTimeout(() => {
      setImagenPrincipal(nuevaImagen);
      setIsChangingImage(false);
    }, 300);
  };

  const calcularPrecioTotal = () => {
    let precio = producto.precioBase * cantidad;
    
    // Extras por material
    if (configuracion.material === 'Premium') precio += cantidad * 0.3;
    else if (configuracion.material === 'Ecológico') precio += cantidad * 0.1;
    else if (configuracion.material === 'Lujo') precio += cantidad * 0.5;
    
    // Extras por terminado
    if (configuracion.terminado === 'Brillo') precio += cantidad * 0.2;
    else if (configuracion.terminado === 'Soft Touch') precio += cantidad * 0.4;
    else if (configuracion.terminado === 'Relieve') precio += cantidad * 0.6;
    
    // Descuentos por volumen
    if (cantidad >= 500) precio *= 0.85;
    else if (cantidad >= 300) precio *= 0.9;
    
    return precio.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-8 pt-32">
          <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>
          <p className="text-gray-600 mt-2">{producto.descripcion}</p>
        </div>

        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda - Imagen y personalización */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`transition-opacity duration-300 ${isChangingImage ? 'opacity-0' : 'opacity-100'}`}>
                <img 
                  src={imagenPrincipal} 
                  alt="Tarjeta de presentación de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus tarjetas</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.material}
                      onChange={(e) => setConfiguracion({...configuracion, material: e.target.value})}
                    >
                      {Object.keys(MATERIALES).map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{MATERIALES[configuracion.material]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Terminado</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.terminado}
                      onChange={(e) => setConfiguracion({...configuracion, terminado: e.target.value})}
                    >
                      {Object.keys(TERMINADOS).map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TERMINADOS[configuracion.terminado]}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño}
                      onChange={(e) => setConfiguracion({...configuracion, tamaño: e.target.value})}
                    >
                      {['Estándar (8.5x5 cm)', 'Square (7x7 cm)', 'Mini (7x4 cm)', 'Vertical (5x8.5 cm)'].map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color base</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {['Blanco', 'Negro', 'Azul', 'Rojo', 'Beige', 'Personalizado'].map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado (GRATIS)</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      {configuracion.diseño.logo ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={removeImage}
                            className="py-2 px-4 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                          >
                            Quitar imagen
                          </button>
                          <span className="text-sm text-green-600">✓ Imagen cargada</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="w-full py-2 px-4 border border-dashed border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                        >
                          + Seleccionar imagen
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, PDF vectorial</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto personalizado</label>
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        placeholder="Ej: Nombre, cargo, teléfono, redes sociales..."
                        value={configuracion.diseño.texto}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            texto: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="dobleCara"
                        checked={configuracion.diseño.dobleCara}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            dobleCara: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="dobleCara" className="ml-2 text-sm text-gray-700">
                        Impresión a doble cara
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Descripción y resumen */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
              <div className="text-gray-600 space-y-2">
                <p>• Tarjetas profesionales de alta calidad</p>
                <p>• Múltiples materiales y acabados premium</p>
                <p>• Ideal para networking y presentación de marca</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado incluido!</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ver otros diseños:</h3>
                <div className="flex space-x-3 overflow-x-auto py-2 px-4">
                  {imagenesMuestra.map((imagen) => (
                    <div 
                      key={imagen.id} 
                      className="flex-shrink-0 relative cursor-pointer"
                      onClick={() => cambiarImagenPrincipal(imagen.src)}
                    >
                      <img
                        src={imagen.src}
                        alt={imagen.alt}
                        className={`w-24 h-24 object-cover rounded transition-all duration-200 ${imagenPrincipal === imagen.src ? 'ring-2 ring-green-500 scale-105' : 'hover:scale-105'}`}
                      />
                      {imagenPrincipal === imagen.src && (
                        <div className="absolute inset-0 bg-green-500 bg-opacity-20 rounded flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tu Pedido</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cantidad:</span>
                  <div className="flex items-center">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(producto.cantidadMinima, cantidad - 50))}
                      disabled={cantidad <= producto.cantidadMinima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad}</span>
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 50)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Tarjeta {configuracion.material}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.material !== 'Estándar' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>
                        {configuracion.material === 'Premium' ? `+S/0.30 c/u` :
                         configuracion.material === 'Ecológico' ? `+S/0.10 c/u` :
                         `+S/0.50 c/u`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.terminado !== 'Mate' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por terminado:</span>
                      <span>
                        {configuracion.terminado === 'Brillo' ? `+S/0.20 c/u` :
                         configuracion.terminado === 'Soft Touch' ? `+S/0.40 c/u` :
                         `+S/0.60 c/u`}
                      </span>
                    </div>
                  )}
                  
                  {cantidad >= 300 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 500 ? '15%' : '10%'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between font-bold border-t pt-3 text-lg">
                  <span>Total:</span>
                  <span>S/{calcularPrecioTotal()}</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  alert(`¡Pedido agregado!\n${cantidad} tarjetas ${configuracion.material}\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Agregar al Carrito
              </button>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                Tiempo de producción: {producto.tiempoProduccion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjetasPresentacion;