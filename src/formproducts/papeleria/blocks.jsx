import React, { useState, useRef } from 'react';
import blockEjemploImg from "../../assets/productos/blocks.jpg";
import muestra1 from "../../assets/productos/blocks.jpg";
import muestra2 from "../../assets/productos/blocks.jpg";
import muestra3 from "../../assets/productos/blocks.jpg";

const TIPOS_PAPEL = {
  'Bond 75g': 'Estándar para escritura',
  'Bond 90g': 'Mayor resistencia (+S/3.00)',
  'Autoadhesivo': 'Con pegado removible (+S/8.00)',
  'Ecológico': 'Papel reciclado 80g (+S/4.00)'
};

const TIPOS_BLOCKS = {
  'Notas': 'Formato estándar (9x12cm)',
  'Mensajes': 'Con línea divisoria (+S/2.00)',
  'Oficina': 'Con membrete prediseñado (+S/5.00)',
  'Profesional': 'Con logo corporativo (+S/7.00)'
};

const HOJAS_POR_BLOCK = {
  '50': '50 hojas (estándar)',
  '100': '100 hojas (+S/6.00)',
  '200': '200 hojas (+S/10.00)'
};

const BlocksPersonalizados = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra
  const imagenesMuestra = [
    { id: 1, src: blockEjemploImg, alt: "Block estándar" },
    { id: 2, src: muestra1, alt: "Block de mensajes" },
    { id: 3, src: muestra2, alt: "Block de notas" },
    { id: 4, src: muestra3, alt: "Block profesional" }
  ];

  const producto = {
    nombre: 'Blocks Personalizados',
    imagen: blockEjemploImg,
    descripcion: 'Blocks para notas, mensajes y registro profesional',
    precioBase: 12.00,
    cantidadMinima: 5,
    tiempoProduccion: '3-5 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    tipo: 'Notas',
    hojas: '50',
    papel: 'Bond 75g',
    color: 'Blanco',
    diseño: {
      logo: null,
      textoSuperior: '',
      textoInferior: '',
      lineado: false,
      perforado: true
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
    
    // Extras por tipo de block
    if (configuracion.tipo === 'Mensajes') precio += 2 * cantidad;
    else if (configuracion.tipo === 'Oficina') precio += 5 * cantidad;
    else if (configuracion.tipo === 'Profesional') precio += 7 * cantidad;
    
    // Extras por papel
    if (configuracion.papel === 'Bond 90g') precio += 3 * cantidad;
    else if (configuracion.papel === 'Autoadhesivo') precio += 8 * cantidad;
    else if (configuracion.papel === 'Ecológico') precio += 4 * cantidad;
    
    // Extras por hojas
    if (configuracion.hojas === '100') precio += 6 * cantidad;
    else if (configuracion.hojas === '200') precio += 10 * cantidad;
    
    // Descuentos por volumen
    if (cantidad >= 20) precio *= 0.9;
    if (cantidad >= 50) precio *= 0.85;
    
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
                  alt="Block personalizado de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus blocks</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de block</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipo}
                      onChange={(e) => setConfiguracion({...configuracion, tipo: e.target.value})}
                    >
                      {Object.keys(TIPOS_BLOCKS).map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_BLOCKS[configuracion.tipo]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hojas por block</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.hojas}
                      onChange={(e) => setConfiguracion({...configuracion, hojas: e.target.value})}
                    >
                      {Object.keys(HOJAS_POR_BLOCK).map(hojas => (
                        <option key={hojas} value={hojas}>{hojas}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{HOJAS_POR_BLOCK[configuracion.hojas]}</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {['Blanco', 'Amarillo', 'Azul claro', 'Rosa', 'Verde claro'].map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado</h3>
                  
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (Mín. 300dpi)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto superior</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: NOTAS INTERNAS - ÁREA DE CONTABILIDAD"
                        value={configuracion.diseño.textoSuperior}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoSuperior: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto inferior</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Fecha: ______ Hora: ______"
                        value={configuracion.diseño.textoInferior}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoInferior: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="lineado"
                          checked={configuracion.diseño.lineado}
                          onChange={(e) => setConfiguracion({
                            ...configuracion,
                            diseño: {
                              ...configuracion.diseño,
                              lineado: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="lineado" className="ml-2 text-sm text-gray-700">
                          Papel lineado
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="perforado"
                          checked={configuracion.diseño.perforado}
                          onChange={(e) => setConfiguracion({
                            ...configuracion,
                            diseño: {
                              ...configuracion.diseño,
                              perforado: e.target.checked
                            }
                          })}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor="perforado" className="ml-2 text-sm text-gray-700">
                          Hoja perforada
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
                <p>• Blocks para notas y mensajes profesionales</p>
                <p>• Ideal para oficinas, recepciones y equipos de trabajo</p>
                <p>• Variedad de papeles y formatos disponibles</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} units</p>
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
                  <span className="text-gray-700">Cantidad (blocks):</span>
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
                    <span>Block básico:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {configuracion.tipo !== 'Notas' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tipo:</span>
                      <span>
                        {configuracion.tipo === 'Mensajes' ? `+S/2.00` :
                         configuracion.tipo === 'Oficina' ? `+S/5.00` :
                         `+S/7.00`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.papel !== 'Bond 75g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Bond 90g' ? `+S/3.00` :
                         configuracion.papel === 'Autoadhesivo' ? `+S/8.00` :
                         `+S/4.00`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.hojas !== '50' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por hojas:</span>
                      <span>
                        {configuracion.hojas === '100' ? `+S/6.00` : `+S/10.00`}
                      </span>
                    </div>
                  )}
                  
                  {cantidad >= 20 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 50 ? '15%' : '10%'}
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
                  alert(`¡Pedido agregado!\n${cantidad} blocks ${configuracion.tipo}\nTotal: S/${calcularPrecioTotal()}`);
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

export default BlocksPersonalizados;