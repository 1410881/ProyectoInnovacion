import React, { useState, useRef, useEffect } from 'react';
import posterBaseImg from "../../assets/productos/posters.jpg";
import muestra1 from "../../assets/productos/posters.jpg";
import muestra2 from "../../assets/productos/posters.jpg";
import muestra3 from "../../assets/productos/posters.jpg";
import muestra4 from "../../assets/productos/posters.jpg";

const OPCIONES_POSTERS = {
  'Tamaños': {
    'A3 (297x420mm)': 'Tamaño estándar',
    'A2 (420x594mm)': 'Mediano (+S/5.00)',
    'A1 (594x841mm)': 'Grande (+S/10.00)',
    'A0 (841x1189mm)': 'Extra grande (+S/15.00)',
    'Personalizado': 'Medidas especiales (+S/8.00)'
  },
  'Papeles': {
    'Couché 150g': 'Brillante estándar',
    'Couché 250g': 'Premium grueso (+S/3.00)',
    'Mate 200g': 'Sin brillo profesional (+S/2.00)',
    'Lienzo': 'Textura canvas (+S/12.00)',
    'Vinilo': 'Resistente al agua (+S/8.00)'
  },
  'Terminaciones': {
    'Estándar': 'Corte recto',
    'Bordes blancos': 'Margen para enmarcar (+S/2.00)',
    'Ojillos metálicos': 'Para colgar (+S/5.00)',
    'Bastidor': 'Montado en marco (+S/25.00)'
  },
  'Acabados': {
    'Brillo UV': 'Protección brillante (+S/4.00)',
    'Mate': 'Protección anti-reflejo (+S/5.00)',
    'Laminado': 'Resistente (+S/7.00)',
    'Ninguno': 'Sin acabado especial'
  }
};

const PostersPersonalizados = () => {
  const fileInputRef = useRef(null);
  const [cantidad, setCantidad] = useState(10);
  const [imagenPrincipal, setImagenPrincipal] = useState(posterBaseImg);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [medidaPersonalizada, setMedidaPersonalizada] = useState({ ancho: '', alto: '' });
  const [mostrarCamposPersonalizados, setMostrarCamposPersonalizados] = useState(false);
  const [mostrarDetallesAcabado, setMostrarDetallesAcabado] = useState(false);

  const [configuracion, setConfiguracion] = useState({
    tamaño: 'A3 (297x420mm)',
    papel: 'Couché 150g',
    terminacion: 'Estándar',
    acabado: 'Ninguno',
    diseño: {
      archivo: null,
      texto: '',
      opcionesEspeciales: []
    }
  });

  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: posterBaseImg, alt: "Poster estándar" },
    { id: 2, src: muestra1, alt: "Poster promocional" },
    { id: 3, src: muestra2, alt: "Poster artístico" },
    { id: 4, src: muestra3, alt: "Poster en lienzo" },
    { id: 5, src: muestra4, alt: "Poster corporativo" }
  ];

  // Configuración del producto
  const producto = {
    nombre: 'Posters Personalizados',
    imagen: posterBaseImg,
    descripcion: 'Posters de alta calidad para decoración, eventos y publicidad',
    precioBase: 12.00,
    cantidadMinima: 10,
    tiempoProduccion: '5-7 días hábiles',
    descuentosVolumen: {
      25: 0.10,
      50: 0.15,
      100: 0.20,
      200: 0.25
    },
    opcionesEspeciales: {
      'Diseño premium': 30.00,
      'Retoque fotográfico': 20.00,
      'Prueba física': 15.00,
      'Entrega express 48h': 40.00
    }
  };

  // Efectos para manejar cambios
  useEffect(() => {
    setMostrarCamposPersonalizados(configuracion.tamaño === 'Personalizado');
    if (configuracion.tamaño !== 'Personalizado') {
      setMedidaPersonalizada({ ancho: '', alto: '' });
    }
  }, [configuracion.tamaño]);

  // Manejo de carga de archivos
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type.match('image.*') || file.name.match(/\.(ai|eps|pdf)$/i)) ){
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfiguracion({
          ...configuracion,
          diseño: {
            ...configuracion.diseño,
            archivo: event.target.result
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    setConfiguracion({
      ...configuracion,
      diseño: {
        ...configuracion.diseño,
        archivo: null
      }
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Animación para cambio de imagen
  const cambiarImagenPrincipal = (nuevaImagen) => {
    if (nuevaImagen === imagenPrincipal) return;
    
    setIsChangingImage(true);
    setTimeout(() => {
      setImagenPrincipal(nuevaImagen);
      setIsChangingImage(false);
    }, 300);
  };

  // Manejo de medidas personalizadas
  const handleMedidaChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setMedidaPersonalizada(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manejo de opciones especiales
  const toggleOpcionEspecial = (opcion) => {
    setConfiguracion(prev => {
      const nuevasOpciones = prev.diseño.opcionesEspeciales.includes(opcion)
        ? prev.diseño.opcionesEspeciales.filter(o => o !== opcion)
        : [...prev.diseño.opcionesEspeciales, opcion];
      
      return {
        ...prev,
        diseño: {
          ...prev.diseño,
          opcionesEspeciales: nuevasOpciones
        }
      };
    });
  };

  // Cálculo de precio total
  const calcularPrecioTotal = () => {
    let precio = producto.precioBase * cantidad;
    
    // Costos por tamaño
    if (configuracion.tamaño === 'A2 (420x594mm)') precio += cantidad * 5.00;
    else if (configuracion.tamaño === 'A1 (594x841mm)') precio += cantidad * 10.00;
    else if (configuracion.tamaño === 'A0 (841x1189mm)') precio += cantidad * 15.00;
    else if (configuracion.tamaño === 'Personalizado') precio += cantidad * 8.00;
    
    // Costos por papel
    if (configuracion.papel === 'Couché 250g') precio += cantidad * 3.00;
    else if (configuracion.papel === 'Mate 200g') precio += cantidad * 2.00;
    else if (configuracion.papel === 'Lienzo') precio += cantidad * 12.00;
    else if (configuracion.papel === 'Vinilo') precio += cantidad * 8.00;
    
    // Costos por terminación
    if (configuracion.terminacion === 'Bordes blancos') precio += cantidad * 2.00;
    else if (configuracion.terminacion === 'Ojillos metálicos') precio += cantidad * 5.00;
    else if (configuracion.terminacion === 'Bastidor') precio += cantidad * 25.00;
    
    // Costos por acabado
    if (configuracion.acabado === 'Brillo UV') precio += cantidad * 4.00;
    else if (configuracion.acabado === 'Mate') precio += cantidad * 5.00;
    else if (configuracion.acabado === 'Laminado') precio += cantidad * 7.00;
    
    // Costos por opciones especiales (precios fijos)
    configuracion.diseño.opcionesEspeciales.forEach(opcion => {
      precio += producto.opcionesEspeciales[opcion];
    });
    
    // Aplicar descuentos por volumen
    const cantidadesDescuento = Object.keys(producto.descuentosVolumen).map(Number).sort((a,b) => b-a);
    for (const cantidadDesc of cantidadesDescuento) {
      if (cantidad >= cantidadDesc) {
        precio *= (1 - producto.descuentosVolumen[cantidadDesc]);
        break;
      }
    }
    
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
            {/* Imagen principal del producto */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`transition-opacity duration-300 ${isChangingImage ? 'opacity-0' : 'opacity-100'}`}>
                <img 
                  src={imagenPrincipal} 
                  alt={producto.nombre} 
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Sección de personalización */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus posters</h2>
              
              <div className="space-y-4">
                {/* Selectores de opciones básicas */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Tamaños */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño}
                      onChange={(e) => setConfiguracion({...configuracion, tamaño: e.target.value})}
                    >
                      {Object.keys(OPCIONES_POSTERS.Tamaños).map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_POSTERS.Tamaños[configuracion.tamaño]}
                    </p>
                    
                    {mostrarCamposPersonalizados && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-700 mb-1">Ancho (mm)</label>
                          <input
                            type="text"
                            name="ancho"
                            value={medidaPersonalizada.ancho}
                            onChange={handleMedidaChange}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Ej: 500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-700 mb-1">Alto (mm)</label>
                          <input
                            type="text"
                            name="alto"
                            value={medidaPersonalizada.alto}
                            onChange={handleMedidaChange}
                            className="w-full p-1 border rounded text-sm"
                            placeholder="Ej: 700"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Papeles */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Papel</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.papel}
                      onChange={(e) => setConfiguracion({...configuracion, papel: e.target.value})}
                    >
                      {Object.keys(OPCIONES_POSTERS.Papeles).map(papel => (
                        <option key={papel} value={papel}>{papel}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_POSTERS.Papeles[configuracion.papel]}
                    </p>
                  </div>
                </div>
                
                {/* Selectores adicionales */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Terminaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Terminación</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.terminacion}
                      onChange={(e) => setConfiguracion({...configuracion, terminacion: e.target.value})}
                    >
                      {Object.keys(OPCIONES_POSTERS.Terminaciones).map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_POSTERS.Terminaciones[configuracion.terminacion]}
                    </p>
                  </div>
                  
                  {/* Acabados */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acabado</label>
                    <div className="flex items-center gap-2">
                      <select
                        className="flex-1 p-2 border rounded"
                        value={configuracion.acabado}
                        onChange={(e) => setConfiguracion({...configuracion, acabado: e.target.value})}
                      >
                        {Object.keys(OPCIONES_POSTERS.Acabados).map(acabado => (
                          <option key={acabado} value={acabado}>{acabado}</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        onClick={() => setMostrarDetallesAcabado(!mostrarDetallesAcabado)}
                        className="p-2 text-gray-500 hover:text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_POSTERS.Acabados[configuracion.acabado]}
                    </p>
                  </div>
                </div>
                
                {mostrarDetallesAcabado && (
                  <div className="p-3 bg-gray-50 rounded text-xs text-gray-700">
                    <p className="font-medium mb-1">Detalles de acabados:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Brillo UV:</strong> Protección contra rayaduras y brillo intenso</li>
                      <li><strong>Mate:</strong> Elimina reflejos, ideal para cuadros</li>
                      <li><strong>Laminado:</strong> Protección extra contra humedad y desgaste</li>
                      <li><strong>Ninguno:</strong> Acabado natural del papel</li>
                    </ul>
                  </div>
                )}
                
                {/* Personalización avanzada */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño y archivos</h3>
                  
                  <div className="space-y-3">
                    {/* Subir archivo */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir diseño</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/*,.ai,.eps,.pdf,.psd"
                        className="hidden"
                      />
                      {configuracion.diseño.archivo ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={removeFile}
                            className="py-2 px-4 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                          >
                            Quitar archivo
                          </button>
                          <span className="text-sm text-green-600">✓ Archivo cargado</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="w-full py-2 px-4 border border-dashed border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                        >
                          + Seleccionar archivo
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos: JPG, PNG (300dpi), PDF, AI, EPS, PSD
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Importante: Incluir márgenes de seguridad (5mm por lado) y marcas de corte
                      </p>
                    </div>
                    
                    {/* Texto personalizado */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Instrucciones especiales</label>
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 'Ajustar colores', 'Centrar el logo', etc."
                        value={configuracion.diseño.texto}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            texto: e.target.value
                          }
                        })}
                        rows="2"
                        maxLength="200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Máximo 200 caracteres</p>
                    </div>
                    
                    {/* Opciones especiales */}
                   {/* Opciones especiales - Versión simplificada */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Descripción y resumen del pedido */}
          <div className="lg:w-1/2">
            {/* Descripción del producto */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
              <div className="text-gray-600 space-y-2">
                <p>• Posters de alta calidad para diversos usos</p>
                <p>• Múltiples tamaños y tipos de papel premium</p>
                <p>• Ideal para decoración, eventos y publicidad</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Sangrado y marcas de corte incluidos!</p>
                <p className="text-xs text-gray-500 mt-2">* Los precios varían según papel, tamaño y opciones seleccionadas</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de posters:</h3>
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
                        className={`w-24 h-24 object-cover rounded transition-all duration-200 ${
                          imagenPrincipal === imagen.src ? 'ring-2 ring-green-500 scale-105' : 'hover:scale-105'
                        }`}
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Pedido</h2>
              
              <div className="space-y-3 mb-4">
                {/* Selector de cantidad */}
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
                
                {/* Detalles de precios */}
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Poster {configuracion.papel}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {/* Costos adicionales por tamaño */}
                  {configuracion.tamaño !== 'A3 (297x420mm)' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tamaño:</span>
                      <span>
                        {configuracion.tamaño === 'A2 (420x594mm)' ? '+S/5.00 c/u' :
                         configuracion.tamaño === 'A1 (594x841mm)' ? '+S/10.00 c/u' :
                         configuracion.tamaño === 'A0 (841x1189mm)' ? '+S/15.00 c/u' : '+S/8.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por papel */}
                  {configuracion.papel !== 'Couché 150g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Couché 250g' ? '+S/3.00 c/u' :
                         configuracion.papel === 'Mate 200g' ? '+S/2.00 c/u' :
                         configuracion.papel === 'Lienzo' ? '+S/12.00 c/u' : '+S/8.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por terminación */}
                  {configuracion.terminacion !== 'Estándar' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Terminación {configuracion.terminacion}:</span>
                      <span>
                        {configuracion.terminacion === 'Bordes blancos' ? '+S/2.00 c/u' :
                         configuracion.terminacion === 'Ojillos metálicos' ? '+S/5.00 c/u' : '+S/25.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por acabado */}
                  {configuracion.acabado !== 'Ninguno' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Acabado {configuracion.acabado}:</span>
                      <span>
                        {configuracion.acabado === 'Brillo UV' ? '+S/4.00 c/u' :
                         configuracion.acabado === 'Mate' ? '+S/5.00 c/u' : '+S/7.00 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por opciones especiales */}
                  {configuracion.diseño.opcionesEspeciales.map(opcion => (
                    <div key={opcion} className="flex justify-between text-sm text-gray-600">
                      <span>{opcion}:</span>
                      <span>+S/{producto.opcionesEspeciales[opcion].toFixed(2)}</span>
                    </div>
                  ))}
                  
                  {/* Descuentos por volumen */}
                  {Object.keys(producto.descuentosVolumen).some(q => cantidad >= q) && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>
                        {(() => {
                          const cantidades = Object.keys(producto.descuentosVolumen).map(Number).sort((a,b) => b-a);
                          for (const q of cantidades) {
                            if (cantidad >= q) {
                              return `${producto.descuentosVolumen[q] * 100}%`;
                            }
                          }
                        })()}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Total */}
                <div className="flex justify-between font-bold border-t pt-3 text-lg">
                  <span>Total:</span>
                  <span>S/{calcularPrecioTotal()}</span>
                </div>
              </div>
              
              {/* Botón de acción */}
              <button
                onClick={() => {
                  if (configuracion.tamaño === 'Personalizado' && (!medidaPersonalizada.ancho || !medidaPersonalizada.alto)) {
                    alert('Por favor ingresa las medidas personalizadas');
                    return;
                  }
                  
                  if (!configuracion.diseño.archivo && !configuracion.diseño.opcionesEspeciales.includes('Diseño premium')) {
                    alert('Debes subir un diseño o seleccionar el servicio de diseño premium');
                    return;
                  }
                  
                  alert(`¡Pedido agregado al carrito!\n\nDetalles:\n- ${cantidad} posters ${configuracion.papel}\n- Tamaño: ${configuracion.tamaño}${configuracion.tamaño === 'Personalizado' ? ` (${medidaPersonalizada.ancho}x${medidaPersonalizada.alto}mm)` : ''}\n- Terminación: ${configuracion.terminacion}\n\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Agregar al Carrito
              </button>
              
              <div className="mt-3 text-center text-sm text-gray-500 space-y-1">
                <p>Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>Envíos a todo el Perú - Consultar costos</p>
                <p className="text-xs mt-2">* Precios sujetos a verificación de archivos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostersPersonalizados;