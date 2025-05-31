import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import archivadorEjemploImg from "../../assets/productos/archivadores.jpg";
import muestra1 from "../../assets/productos/archivadores.jpg";
import muestra2 from "../../assets/productos/archivadores.jpg";
import muestra3 from "../../assets/productos/archivadores.jpg";

const MATERIALES = {
  'Cartón reforzado': 'Económico y resistente',
  'Polipropileno': 'Resistente al agua (+S/2.50)',
  'PVC rígido': 'Durabilidad premium (+S/4.00)',
  'Metal': 'Profesional de larga duración (+S/6.00)'
};

const TAMAÑOS = {
  'A4': 'Estándar (21x30cm)',
  'A5': 'Compacto (15x21cm) (+S/1.00)',
  'Letter': 'Formato americano (22x28cm) (+S/1.50)',
  'Folleto': 'Gran capacidad (30x40cm) (+S/3.00)'
};

const TIPOS_CIERRE = {
  'Anillas': 'Clásico (2 o 4 anillas)',
  'Gancho': 'Sistema de palanca (+S/1.50)',
  'Cremallera': 'Protección total (+S/3.00)',
  'Magnético': 'Cierre elegante (+S/2.50)'
};

const ArchivadoresPersonalizados = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: archivadorEjemploImg, alt: "Archivador estándar" },
    { id: 2, src: muestra1, alt: "Archivador ejecutivo" },
    { id: 3, src: muestra2, alt: "Archivador con cremallera" },
    { id: 4, src: muestra3, alt: "Archivador metálico" }
  ];

  const producto = {
    nombre: 'Archivadores Personalizados',
    imagen: archivadorEjemploImg,
    descripcion: 'Archivadores de alta calidad para organización profesional',
    precioBase: 12.50,
    cantidadMinima: 10,
    tiempoProduccion: '7-10 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    material: 'Cartón reforzado',
    tamaño: 'A4',
    cierre: 'Anillas',
    color: 'Negro',
    diseño: {
      logo: null,
      texto: '',
      interiorPersonalizado: false
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
    
    // Costos adicionales por material
    if (configuracion.material === 'Polipropileno') precio += cantidad * 2.5;
    else if (configuracion.material === 'PVC rígido') precio += cantidad * 4.0;
    else if (configuracion.material === 'Metal') precio += cantidad * 6.0;
    
    // Costos adicionales por tamaño
    if (configuracion.tamaño === 'A5') precio += cantidad * 1.0;
    else if (configuracion.tamaño === 'Letter') precio += cantidad * 1.5;
    else if (configuracion.tamaño === 'Folleto') precio += cantidad * 3.0;
    
    // Costos adicionales por cierre
    if (configuracion.cierre === 'Gancho') precio += cantidad * 1.5;
    else if (configuracion.cierre === 'Cremallera') precio += cantidad * 3.0;
    else if (configuracion.cierre === 'Magnético') precio += cantidad * 2.5;
    
    // Costo adicional por interior personalizado
    if (configuracion.diseño.interiorPersonalizado) precio += cantidad * 1.8;
    
    // Descuentos por volumen
    if (cantidad >= 50) precio *= 0.9;
    if (cantidad >= 100) precio *= 0.85;
    
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
          {/* Columna izquierda - Imagen */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`transition-opacity duration-300 ${isChangingImage ? 'opacity-0' : 'opacity-100'}`}>
                <img 
                  src={imagenPrincipal} 
                  alt="Archivador personalizado de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización debajo de la imagen */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tu archivador</h2>
              
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño}
                      onChange={(e) => setConfiguracion({...configuracion, tamaño: e.target.value})}
                    >
                      {Object.keys(TAMAÑOS).map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TAMAÑOS[configuracion.tamaño]}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de cierre</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.cierre}
                      onChange={(e) => setConfiguracion({...configuracion, cierre: e.target.value})}
                    >
                      {Object.keys(TIPOS_CIERRE).map(cierre => (
                        <option key={cierre} value={cierre}>{cierre}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_CIERRE[configuracion.cierre]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {['Negro', 'Blanco', 'Azul', 'Rojo', 'Verde', 'Gris'].map(color => (
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (300dpi mínimo)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto personalizado</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Nombre de la empresa"
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
                        id="interiorPersonalizado"
                        checked={configuracion.diseño.interiorPersonalizado}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            interiorPersonalizado: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="interiorPersonalizado" className="ml-2 text-sm text-gray-700">
                        Interior personalizado (+S/1.80 por unidad)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Descripción corta y resumen */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
              <div className="text-gray-600 space-y-2">
                <p>• Archivadores profesionales de alta durabilidad</p>
                <p>• Múltiples materiales y sistemas de cierre</p>
                <p>• Ideal para empresas, universidades y organizaciones</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado GRATIS!</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ver otras muestras:</h3>
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
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded flex items-center justify-center">
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
                      onClick={() => setCantidad(Math.max(producto.cantidadMinima, cantidad - 5))}
                      disabled={cantidad <= producto.cantidadMinima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad}</span>
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 5)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Archivador {configuracion.material}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.material !== 'Cartón reforzado' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>
                        {configuracion.material === 'Polipropileno' ? '+S/2.50 c/u' :
                         configuracion.material === 'PVC rígido' ? '+S/4.00 c/u' : '+S/6.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.tamaño !== 'A4' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tamaño:</span>
                      <span>
                        {configuracion.tamaño === 'A5' ? '+S/1.00 c/u' :
                         configuracion.tamaño === 'Letter' ? '+S/1.50 c/u' : '+S/3.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.cierre !== 'Anillas' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por cierre:</span>
                      <span>
                        {configuracion.cierre === 'Gancho' ? '+S/1.50 c/u' :
                         configuracion.cierre === 'Cremallera' ? '+S/3.00 c/u' : '+S/2.50 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.diseño.interiorPersonalizado && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Interior personalizado:</span>
                      <span>+S/1.80 c/u</span>
                    </div>
                  )}
                  
                  {cantidad >= 50 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 100 ? '15%' : '10%'}
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
                  alert(`¡Pedido agregado!\n${cantidad} archivadores ${configuracion.material}\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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

export default ArchivadoresPersonalizados;