import React, { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import libretaImg from "../../assets/productos/libretas.jpg";
import muestra1 from "../../assets/productos/libretas.jpg";
import muestra2 from "../../assets/productos/libretas.jpg";
import muestra3 from "../../assets/productos/libretas.jpg";

const TIPOS_PAPEL = {
  'Bond 75g': 'Estándar para uso diario',
  'Bond 90g': 'Mayor calidad (+S/1.50 por libreta)',
  'Reciclado': 'Ecológico 80g (+S/0.80 por libreta)',
  'Premium': 'Papel libro 100g (+S/2.50 por libreta)',
  'Cuadriculado': 'Para dibujo técnico (+S/1.20 por libreta)'
};

const TAMANOS = {
  'A5': '14.8 x 21 cm - Bolsillo',
  'A4': '21 x 29.7 cm - Estándar (+S/1.00 por libreta)',
  'A3': '29.7 x 42 cm - Grande (+S/2.50 por libreta)',
  'Personalizado': 'Medidas especiales (+S/3.00 por libreta)'
};

const ENCUADERNACION = {
  'Espiral': 'Giro completo 360°',
  'Pegada': 'Lomo cuadrado - Elegante (+S/1.80 por libreta)',
  'Grapada': 'Costura simple',
  'Cartone': 'Tapa dura profesional (+S/3.50 por libreta)'
};

const COLORES_PORTADA = {
  'Blanco': 'Clásico',
  'Negro': 'Profesional',
  'Azul corporativo': 'Para empresas (+S/0.50 por libreta)',
  'Personalizado': 'Diseño a medida (+S/2.00 por libreta)'
};

const LibretasPersonalizadas = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: libretaImg, alt: "Libreta estándar" },
    { id: 2, src: muestra1, alt: "Libreta ejecutiva" },
    { id: 3, src: muestra2, alt: "Libreta creativa" },
    { id: 4, src: muestra3, alt: "Libreta institucional" }
  ];

  const producto = {
    nombre: 'Libretas Personalizadas',
    imagen: libretaImg,
    descripcion: 'Libretas de alta calidad para oficina, educación y regalos corporativos',
    precioBase: 8.50,
    cantidadMinima: 20,
    tiempoProduccion: '5-7 días hábiles',
    hojas: ['80 páginas', '120 páginas (+S/1.20)', '200 páginas (+S/2.50)']
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    papel: 'Bond 75g',
    tamaño: 'A5',
    encuadernacion: 'Espiral',
    hojas: '80 páginas',
    colorPortada: 'Blanco',
    diseño: {
      logo: null,
      textoPortada: '',
      textoLomo: '',
      paginaInicial: false
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
    
    // Costos adicionales por papel
    if (configuracion.papel === 'Bond 90g') precio += cantidad * 1.5;
    else if (configuracion.papel === 'Reciclado') precio += cantidad * 0.8;
    else if (configuracion.papel === 'Premium') precio += cantidad * 2.5;
    else if (configuracion.papel === 'Cuadriculado') precio += cantidad * 1.2;
    
    // Costos adicionales por tamaño
    if (configuracion.tamaño === 'A4') precio += cantidad * 1.0;
    else if (configuracion.tamaño === 'A3') precio += cantidad * 2.5;
    else if (configuracion.tamaño === 'Personalizado') precio += cantidad * 3.0;
    
    // Costos adicionales por encuadernación
    if (configuracion.encuadernacion === 'Pegada') precio += cantidad * 1.8;
    else if (configuracion.encuadernacion === 'Cartone') precio += cantidad * 3.5;
    
    // Costos adicionales por hojas (CORRECCIÓN AQUÍ)
    if (configuracion.hojas.includes('120')) precio += cantidad * 1.2;
    else if (configuracion.hojas.includes('200')) precio += cantidad * 2.5;
    
    // Costos adicionales por color portada
    if (configuracion.colorPortada === 'Azul corporativo') precio += cantidad * 0.5;
    else if (configuracion.colorPortada === 'Personalizado') precio += cantidad * 2.0;
    
    // Costo adicional por página inicial personalizada
    if (configuracion.diseño.paginaInicial) precio += cantidad * 0.8;
    
    // Descuentos por volumen
    if (cantidad >= 100) precio *= 0.85;
    else if (cantidad >= 50) precio *= 0.90;
    
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
                  alt="Libreta personalizada de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización debajo de la imagen */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus libretas</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de papel</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.papel}
                      onChange={(e) => setConfiguracion({...configuracion, papel: e.target.value})}
                    >
                      {Object.keys(TIPOS_PAPEL).map(papel => (
                        <option key={papel} value={papel}>{papel}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_PAPEL[configuracion.papel]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño}
                      onChange={(e) => setConfiguracion({...configuracion, tamaño: e.target.value})}
                    >
                      {Object.keys(TAMANOS).map(tamaño => (
                        <option key={tamaño} value={tamaño}>{tamaño}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TAMANOS[configuracion.tamaño]}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Encuadernación</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.encuadernacion}
                      onChange={(e) => setConfiguracion({...configuracion, encuadernacion: e.target.value})}
                    >
                      {Object.keys(ENCUADERNACION).map(encuad => (
                        <option key={encuad} value={encuad}>{encuad}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{ENCUADERNACION[configuracion.encuadernacion]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">N° de páginas</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.hojas}
                      onChange={(e) => setConfiguracion({...configuracion, hojas: e.target.value})}
                    >
                      {producto.hojas.map(hojas => (
                        <option key={hojas} value={hojas}>{hojas}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color de portada</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={configuracion.colorPortada}
                    onChange={(e) => setConfiguracion({...configuracion, colorPortada: e.target.value})}
                  >
                    {Object.keys(COLORES_PORTADA).map(color => (
                      <option key={color} value={color}>{color}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">{COLORES_PORTADA[configuracion.colorPortada]}</p>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado (GRATIS)</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo (solo para portada personalizada)</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={configuracion.colorPortada !== 'Personalizado'}
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
                          className={`w-full py-2 px-4 border border-dashed rounded hover:bg-gray-50 transition text-sm ${
                            configuracion.colorPortada !== 'Personalizado' 
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                          disabled={configuracion.colorPortada !== 'Personalizado'}
                        >
                          {configuracion.colorPortada !== 'Personalizado' 
                            ? 'Disponible solo para portada personalizada' 
                            : '+ Seleccionar imagen'}
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, SVG (300dpi mínimo)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto en portada</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Nombre de la empresa"
                        value={configuracion.diseño.textoPortada}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoPortada: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto en lomo (solo encuadernación cartoné)</label>
                      <input
                        type="text"
                        className={`w-full p-2 border rounded ${
                          configuracion.encuadernacion !== 'Cartone' ? 'bg-gray-100' : ''
                        }`}
                        placeholder="Ej: Logotipo o nombre"
                        value={configuracion.diseño.textoLomo}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoLomo: e.target.value
                          }
                        })}
                        disabled={configuracion.encuadernacion !== 'Cartone'}
                      />
                      {configuracion.encuadernacion !== 'Cartone' && (
                        <p className="text-xs text-gray-500 mt-1">Disponible solo para encuadernación cartoné</p>
                      )}
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="paginaInicial"
                        checked={configuracion.diseño.paginaInicial}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            paginaInicial: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="paginaInicial" className="ml-2 text-sm text-gray-700">
                        Página inicial personalizada (+S/0.80 por libreta)
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
                <p>• Libretas profesionales de alta calidad</p>
                <p>• Múltiples opciones de papel y tamaños</p>
                <p>• Ideal para empresas, escuelas y regalos</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado ahora es GRATIS!</p>
              </div>

              {/* Carrusel de muestras debajo de la descripción */}
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
                    <span>Libreta {configuracion.papel}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.papel !== 'Bond 75g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Bond 90g' ? '+S/1.50 c/u' :
                         configuracion.papel === 'Reciclado' ? '+S/0.80 c/u' :
                         configuracion.papel === 'Premium' ? '+S/2.50 c/u' : '+S/1.20 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.tamaño !== 'A5' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tamaño:</span>
                      <span>
                        {configuracion.tamaño === 'A4' ? '+S/1.00 c/u' :
                         configuracion.tamaño === 'A3' ? '+S/2.50 c/u' : '+S/3.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.encuadernacion !== 'Espiral' && configuracion.encuadernacion !== 'Grapada' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por encuadernación:</span>
                      <span>
                        {configuracion.encuadernacion === 'Pegada' ? '+S/1.80 c/u' : '+S/3.50 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.hojas !== '80 páginas' && (
  <div className="flex justify-between text-sm text-gray-600">
    <span>Extra por páginas:</span>
    <span>
      {configuracion.hojas === '120 páginas (+S/1.20)' ? '+S/1.20 c/u' : '+S/2.50 c/u'}
    </span>
  </div>
)}
                  
                  {configuracion.colorPortada !== 'Blanco' && configuracion.colorPortada !== 'Negro' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por portada:</span>
                      <span>
                        {configuracion.colorPortada === 'Azul corporativo' ? '+S/0.50 c/u' : '+S/2.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.diseño.paginaInicial && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Página inicial personalizada:</span>
                      <span>+S/0.80 c/u</span>
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
                  alert(`¡Pedido agregado!\n${cantidad} libretas ${configuracion.papel}\nTotal: S/${calcularPrecioTotal()}`);
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

export default LibretasPersonalizadas;