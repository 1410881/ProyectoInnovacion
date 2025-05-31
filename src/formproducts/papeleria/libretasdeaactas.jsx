import React, { useState, useRef } from 'react';
import libretaEjemploImg from "../../assets/productos/libroactas.jpg";
import muestra1 from "../../assets/productos/libroactas.jpg";
import muestra2 from "../../assets/productos/libroactas.jpg";
import muestra3 from "../../assets/productos/libroactas.jpg";

const TIPOS_TAPA = {
  'Tapa blanda': 'Cartulina gruesa 250gsm',
  'Tapa dura': 'Cartón forrado (+S/15.00)',
  'Cuero sintético': 'Elegante y duradero (+S/25.00)',
  'Plástico rígido': 'Resistente al agua (+S/20.00)'
};

const TIPOS_HOJAS = {
  '80': '80 hojas rayadas (estándar)',
  '100': '100 hojas rayadas (+S/10.00)',
  '120': '120 hojas cuadriculadas (+S/15.00)',
  '200': '200 hojas lisas (+S/25.00)'
};

const TIPOS_ENCUADERNACION = {
  'Espiral metálico': 'Estándar (360° giro)',
  'Espiral plástico': 'Más resistente (+S/5.00)',
  'Empastado': 'Profesional (+S/20.00)',
  'Pegado': 'Diseño minimalista (+S/8.00)'
};

const LibretasActas = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra
  const imagenesMuestra = [
    { id: 1, src: libretaEjemploImg, alt: "Libreta de actas estándar" },
    { id: 2, src: muestra1, alt: "Libreta de tapa dura" },
    { id: 3, src: muestra2, alt: "Libreta empastada" },
    { id: 4, src: muestra3, alt: "Libreta oficial" }
  ];

  const producto = {
    nombre: 'Libretas de Actas',
    imagen: libretaEjemploImg,
    descripcion: 'Libretas profesionales para actas oficiales y reuniones',
    precioBase: 35.00,
    cantidadMinima: 1,
    tiempoProduccion: '7-10 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    tipoTapa: 'Tapa blanda',
    hojas: '80',
    encuadernacion: 'Espiral metálico',
    color: 'Negro',
    diseño: {
      logo: null,
      textoPortada: '',
      textoLomo: '',
      numeracionPaginas: true,
      membrete: false
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
    
    // Extras por tapa
    if (configuracion.tipoTapa === 'Tapa dura') precio += 15;
    else if (configuracion.tipoTapa === 'Cuero sintético') precio += 25;
    else if (configuracion.tipoTapa === 'Plástico rígido') precio += 20;
    
    // Extras por hojas
    if (configuracion.hojas === '100') precio += 10;
    else if (configuracion.hojas === '120') precio += 15;
    else if (configuracion.hojas === '200') precio += 25;
    
    // Extras por encuadernación
    if (configuracion.encuadernacion === 'Espiral plástico') precio += 5;
    else if (configuracion.encuadernacion === 'Empastado') precio += 20;
    else if (configuracion.encuadernacion === 'Pegado') precio += 8;
    
    // Descuentos por volumen
    if (cantidad >= 5) precio *= 0.9;
    if (cantidad >= 10) precio *= 0.85;
    
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
                  alt="Libreta de actas de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tu libreta</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de tapa</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipoTapa}
                      onChange={(e) => setConfiguracion({...configuracion, tipoTapa: e.target.value})}
                    >
                      {Object.keys(TIPOS_TAPA).map(tapa => (
                        <option key={tapa} value={tapa}>{tapa}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_TAPA[configuracion.tipoTapa]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de hojas</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.hojas}
                      onChange={(e) => setConfiguracion({...configuracion, hojas: e.target.value})}
                    >
                      {Object.keys(TIPOS_HOJAS).map(hojas => (
                        <option key={hojas} value={hojas}>{hojas}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_HOJAS[configuracion.hojas]}</p>
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
                      {Object.keys(TIPOS_ENCUADERNACION).map(enc => (
                        <option key={enc} value={enc}>{enc}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_ENCUADERNACION[configuracion.encuadernacion]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {['Negro', 'Azul marino', 'Burgundy', 'Verde oscuro', 'Gris'].map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo institucional</label>
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (Mín. 300dpi)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto portada</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: ACTAS OFICIALES - MUNICIPALIDAD DE LIMA"
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
                      <label className="block text-sm text-gray-700 mb-1">Texto lomo</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: ACTAS 2024"
                        value={configuracion.diseño.textoLomo}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoLomo: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="numeracion"
                          checked={configuracion.diseño.numeracionPaginas}
                          onChange={(e) => setConfiguracion({
                            ...configuracion,
                            diseño: {
                              ...configuracion.diseño,
                              numeracionPaginas: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="numeracion" className="ml-2 text-sm text-gray-700">
                          Numeración de páginas
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="membrete"
                          checked={configuracion.diseño.membrete}
                          onChange={(e) => setConfiguracion({
                            ...configuracion,
                            diseño: {
                              ...configuracion.diseño,
                              membrete: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="membrete" className="ml-2 text-sm text-gray-700">
                          Membrete institucional
                        </label>
                      </div>
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
                <p>• Libretas profesionales para actas oficiales</p>
                <p>• Ideal para juntas directivas, municipalidades y empresas</p>
                <p>• Múltiples opciones de encuadernaci��n y materiales</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidad</p>
                <p className="text-green-600 font-medium">• Personalización completa incluida</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ver otros modelos:</h3>
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
                        className={`w-24 h-24 object-cover rounded transition-all duration-200 ${imagenPrincipal === imagen.src ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'}`}
                      />
                      {imagenPrincipal === imagen.src && (
                        <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded flex items-center justify-center">
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
                  <span className="text-gray-700">Cantidad (libretas):</span>
                  <div className="flex items-center">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(producto.cantidadMinima, cantidad - 1))}
                      disabled={cantidad <= producto.cantidadMinima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad}</span>
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Libreta básica:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.tipoTapa !== 'Tapa blanda' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tapa:</span>
                      <span>
                        {configuracion.tipoTapa === 'Tapa dura' ? `+S/15.00` :
                         configuracion.tipoTapa === 'Cuero sintético' ? `+S/25.00` :
                         `+S/20.00`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.hojas !== '80' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por hojas:</span>
                      <span>
                        {configuracion.hojas === '100' ? `+S/10.00` :
                         configuracion.hojas === '120' ? `+S/15.00` :
                         `+S/25.00`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.encuadernacion !== 'Espiral metálico' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por encuadernación:</span>
                      <span>
                        {configuracion.encuadernacion === 'Espiral plástico' ? `+S/5.00` :
                         configuracion.encuadernacion === 'Empastado' ? `+S/20.00` :
                         `+S/8.00`}
                      </span>
                    </div>
                  )}
                  
                  {cantidad >= 5 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 10 ? '15%' : '10%'}
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
                  alert(`¡Pedido agregado!\n${cantidad} libreta(s) de actas\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-blue-800 to-blue-900 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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

export default LibretasActas;