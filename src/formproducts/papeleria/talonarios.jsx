import React, { useState, useRef } from 'react';
import talonarioEjemploImg from "../../assets/productos/talonarios.jpg";
import muestra1 from "../../assets/productos/talonarios.jpg";
import muestra2 from "../../assets/productos/talonarios.jpg";
import muestra3 from "../../assets/productos/talonarios.jpg";

const HOJAS_POR_TALONARIO = {
  '50': '50 hojas (estándar)',
  '100': '100 hojas (+S/12.00)',
  '200': '200 hojas (+S/20.00)'
};

const TIPOS_PAPEL = {
  'Bond 75g': 'Papel estándar para escritura',
  'Bond 90g': 'Mayor resistencia (+S/5.00)',
  'Autocopiativo': 'Para talonarios de facturas (+S/15.00)',
  'Ecológico': 'Papel reciclado 80g (+S/8.00)'
};

const TIPOS_TALONARIO = {
  'Facturas': 'Numeración correlativa y carbonillo',
  'Recibos': 'Con copia para archivo',
  'Notas de pedido': 'Diseño personalizable',
  'Tickets': 'Para ventas rapidas(Restaurantes)'
};

const TalonariosPersonalizados = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra
  const imagenesMuestra = [
    { id: 1, src: talonarioEjemploImg, alt: "Talonario estándar" },
    { id: 2, src: muestra1, alt: "Talonario de facturas" },
    { id: 3, src: muestra2, alt: "Talonario de recibos" },
    { id: 4, src: muestra3, alt: "Talonario de notas" }
  ];

  const producto = {
    nombre: 'Talonarios Personalizados',
    imagen: talonarioEjemploImg,
    descripcion: 'Talonarios profesionales para tu negocio',
    precioBase: 45.00,
    cantidadMinima: 1,
    tiempoProduccion: '5-7 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    tipo: 'Facturas',
    hojas: '50',
    papel: 'Bond 75g',
    color: 'Blanco',
    diseño: {
      logo: null,
      textoHeader: '',
      textoFooter: '',
      numeracion: true
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
    
    // Extras por hojas
    if (configuracion.hojas === '100') precio += 12;
    else if (configuracion.hojas === '200') precio += 20;
    
    // Extras por papel
    if (configuracion.papel === 'Bond 90g') precio += 5;
    else if (configuracion.papel === 'Autocopiativo') precio += 15;
    else if (configuracion.papel === 'Ecológico') precio += 8;
    
    // Descuentos por volumen
    if (cantidad >= 10) precio *= 0.9;
    if (cantidad >= 20) precio *= 0.85;
    
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
                  alt="Talonario personalizado de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus talonarios</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de talonario</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipo}
                      onChange={(e) => setConfiguracion({...configuracion, tipo: e.target.value})}
                    >
                      {Object.keys(TIPOS_TALONARIO).map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_TALONARIO[configuracion.tipo]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hojas por talonario</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.hojas}
                      onChange={(e) => setConfiguracion({...configuracion, hojas: e.target.value})}
                    >
                      {Object.keys(HOJAS_POR_TALONARIO).map(hojas => (
                        <option key={hojas} value={hojas}>{hojas}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{HOJAS_POR_TALONARIO[configuracion.hojas]}</p>
                  </div>
                </div>
                
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color del papel</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {['Blanco', 'Azul claro', 'Verde claro', 'Rosa claro', 'Amarillo'].map(color => (
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, PDF</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto cabecera</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Nombre de empresa, RUC, dirección"
                        value={configuracion.diseño.textoHeader}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoHeader: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto pie de página</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Gracias por su preferencia, términos y condiciones"
                        value={configuracion.diseño.textoFooter}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoFooter: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="numeracion"
                        checked={configuracion.diseño.numeracion}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            numeracion: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="numeracion" className="ml-2 text-sm text-gray-700">
                        Numeración correlativa
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
                <p>• Talonarios profesionales para tu negocio</p>
                <p>• Múltiples formatos: facturas, recibos, vales</p>
                <p>• Papeles de diferente gramaje y colores</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} talonario</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado incluido!</p>
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
                  <span className="text-gray-700">Cantidad (talonarios):</span>
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
                    <span>Talonario {configuracion.tipo}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.hojas !== '50' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por hojas:</span>
                      <span>
                        {configuracion.hojas === '100' ? `+S/12.00` : `+S/20.00`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.papel !== 'Bond 75g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Bond 90g' ? `+S/5.00` :
                         configuracion.papel === 'Autocopiativo' ? `+S/15.00` :
                         `+S/8.00`}
                      </span>
                    </div>
                  )}
                  
                  {cantidad >= 10 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 20 ? '15%' : '10%'}
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
                  alert(`¡Pedido agregado!\n${cantidad} talonarios ${configuracion.tipo}\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
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

export default TalonariosPersonalizados;