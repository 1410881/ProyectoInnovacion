import React, { useState, useRef } from 'react';
import formularioEjemploImg from "../../assets/productos/formularioscontinuos.jpg";
import muestra1 from "../../assets/productos/formularioscontinuos.jpg";
import muestra2 from "../../assets/productos/formularioscontinuos.jpg";
import muestra3 from "../../assets/productos/formularioscontinuos.jpg";

const TIPOS_FORMULARIO = {
  'Facturas': 'Con encabezado preimpreso y numeración',
  'Recibos': 'Diseño para comprobantes de pago',
  'Cotizaciones': 'Formato profesional con logo',
  'Personalizado': 'Totalmente adaptable a tus necesidades'
};

const TIPOS_PAPEL = {
  'Bond 75g': 'Estándar para impresión láser',
  'Carbonless 2 partes': 'Autocopiativo (+S/15.00)',
  'Carbonless 3 partes': 'Para triplicado (+S/25.00)',
  'Seguridad': 'Con fondo de seguridad (+S/20.00)'
};

const TAMANOS = {
  'Medio oficio': '21.6 x 33 cm (estándar)',
  'Oficio': '21.6 x 35.6 cm (+S/5.00)',
  'A4': '21 x 29.7 cm (+S/8.00)',
  'Personalizado': 'Cotizar precio'
};

const FormulariosContinuos = () => {
  const fileInputRef = useRef(null);
  
  // Imágenes de muestra
  const imagenesMuestra = [
    { id: 1, src: formularioEjemploImg, alt: "Formulario continuo estándar" },
    { id: 2, src: muestra1, alt: "Formulario de facturas" },
    { id: 3, src: muestra2, alt: "Formulario tamaño A4" },
    { id: 4, src: muestra3, alt: "Formulario autocopiativo" }
  ];

  const producto = {
    nombre: 'Formularios Continuos',
    imagen: formularioEjemploImg,
    descripcion: 'Formularios para impresoras de matriz de puntos y láser',
    precioBase: 80.00,
    cantidadMinima: 1000,
    tiempoProduccion: '10-15 días hábiles'
  };

  const [cantidad, setCantidad] = useState(producto.cantidadMinima);
  const [imagenPrincipal, setImagenPrincipal] = useState(producto.imagen);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    tipo: 'Facturas',
    tamano: 'Medio oficio',
    papel: 'Bond 75g',
    margenes: 'Estándar',
    diseño: {
      logo: null,
      encabezado: '',
      camposPersonalizados: '',
      numeracionAutomatica: true
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
    let precio = producto.precioBase * (cantidad / 1000); // Precio base por millar
    
    // Extras por tipo de papel
    if (configuracion.papel === 'Carbonless 2 partes') precio += 15 * (cantidad / 1000);
    else if (configuracion.papel === 'Carbonless 3 partes') precio += 25 * (cantidad / 1000);
    else if (configuracion.papel === 'Seguridad') precio += 20 * (cantidad / 1000);
    
    // Extras por tamaño
    if (configuracion.tamano === 'Oficio') precio += 5 * (cantidad / 1000);
    else if (configuracion.tamano === 'A4') precio += 8 * (cantidad / 1000);
    
    // Descuentos por volumen
    if (cantidad >= 5000) precio *= 0.85;
    else if (cantidad >= 3000) precio *= 0.9;
    
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
                  alt="Formulario continuo de ejemplo" 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Configura tus formularios</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de formulario</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipo}
                      onChange={(e) => setConfiguracion({...configuracion, tipo: e.target.value})}
                    >
                      {Object.keys(TIPOS_FORMULARIO).map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TIPOS_FORMULARIO[configuracion.tipo]}</p>
                  </div>
                  
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
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamano}
                      onChange={(e) => setConfiguracion({...configuracion, tamano: e.target.value})}
                    >
                      {Object.keys(TAMANOS).map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">{TAMANOS[configuracion.tamano]}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Margenes</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.margenes}
                      onChange={(e) => setConfiguracion({...configuracion, margenes: e.target.value})}
                    >
                      {['Estándar', 'Angostos', 'Para perforación', 'Personalizados'].map(marg => (
                        <option key={marg} value={marg}>{marg}</option>
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: EPS, AI (Vectorial preferido)</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Encabezado</label>
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        placeholder="Ej: FACTURA ELECTRÓNICA\nRUC: 20123456789"
                        value={configuracion.diseño.encabezado}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            encabezado: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Campos personalizados</label>
                      <textarea
                        className="w-full p-2 border rounded h-20"
                        placeholder="Ej: Código|Descripción|Cantidad|P.Unit|Importe\n________________________________________"
                        value={configuracion.diseño.camposPersonalizados}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            camposPersonalizados: e.target.value
                          }
                        })}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="numeracion"
                        checked={configuracion.diseño.numeracionAutomatica}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            numeracionAutomatica: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="numeracion" className="ml-2 text-sm text-gray-700">
                        Numeración automática correlativa
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
                <p>• Formularios continuos para impresoras matriciales</p>
                <p>• Ideal para facturas, recibos y documentos contables</p>
                <p>• Opciones autocopiativas (carbonless) y de seguridad</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} hojas</p>
                <p className="text-green-600 font-medium">• Diseño profesional incluido</p>
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
                  <span className="text-gray-700">Cantidad (hojas):</span>
                  <div className="flex items-center">
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(producto.cantidadMinima, cantidad - 100))}
                      disabled={cantidad <= producto.cantidadMinima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad}</span>
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 100)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Formulario básico:</span>
                    <span>S/{producto.precioBase.toFixed(2)} por millar</span>
                  </div>
                  
                  {configuracion.papel !== 'Bond 75g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Carbonless 2 partes' ? `+S/15.00 por millar` :
                         configuracion.papel === 'Carbonless 3 partes' ? `+S/25.00 por millar` :
                         `+S/20.00 por millar`}
                      </span>
                    </div>
                  )}
                  
                  {configuracion.tamano !== 'Medio oficio' && configuracion.tamano !== 'Personalizado' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tamaño:</span>
                      <span>
                        {configuracion.tamano === 'Oficio' ? `+S/5.00 por millar` : `+S/8.00 por millar`}
                      </span>
                    </div>
                  )}
                  
                  {cantidad >= 3000 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {cantidad >= 5000 ? '15%' : '10%'}
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
                  alert(`¡Pedido agregado!\n${cantidad} hojas de formularios ${configuracion.tipo}\nTotal: S/${calcularPrecioTotal()}`);
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

export default FormulariosContinuos;