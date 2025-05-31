import React, { useState, useRef, useEffect } from 'react';
import flyerBaseImg from "../../assets/productos/flyers.jpg";
import muestra1 from "../../assets/productos/flyers.jpg";
import muestra2 from "../../assets/productos/flyers.jpg";
import muestra3 from "../../assets/productos/flyers.jpg";
import muestra4 from "../../assets/productos/flyers.jpg";

const OPCIONES_FLYERS = {
  'Tamaños': {
    'A5 (148x210mm)': 'Tamaño estándar',
    'A6 (105x148mm)': 'Mediano (-S/0.10 c/u)',
    'DL (99x210mm)': 'Flyer tríptico',
    'Personalizado': 'Medidas especiales (+S/0.30 c/u)'
  },
  'Papeles': {
    'Couché 150g': 'Estándar brillante',
    'Couché 250g': 'Premium grueso (+S/0.20 c/u)',
    'Mate 150g': 'Sin brillo profesional',
    'Reciclado 120g': 'Ecológico (+S/0.15 c/u)',
    'Vinilo adhesivo': 'Para pegatinas (+S/0.50 c/u)'
  },
  'Terminaciones': {
    'Estándar': 'Corte recto',
    'Troquelado': 'Forma especial (+S/0.40 c/u)',
    'Punta redonda': 'Esquinas redondeadas (+S/0.15 c/u)',
    'Foil stamping': 'Acabado metálico (+S/0.60 c/u)'
  },
  'Colores': ['Full Color', '1 Color', '2 Colores', '4 Colores Pantone'],
  'Acabados': {
    'Brillo': 'Barniz UV selectivo (+S/0.25 c/u)',
    'Mate': 'Barniz mate selectivo (+S/0.30 c/u)',
    'Relieve': 'Termograbado (+S/0.45 c/u)',
    'Ninguno': 'Sin acabado especial'
  }
};

const FlyersPersonalizados = () => {
  const fileInputRef = useRef(null);
  const [cantidad, setCantidad] = useState(100);
  const [imagenPrincipal, setImagenPrincipal] = useState(flyerBaseImg);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [medidaPersonalizada, setMedidaPersonalizada] = useState({ ancho: '', alto: '' });
  const [mostrarCamposPersonalizados, setMostrarCamposPersonalizados] = useState(false);
  const [mostrarDetallesTerminacion, setMostrarDetallesTerminacion] = useState(false);

  const [configuracion, setConfiguracion] = useState({
    tamaño: 'A5 (148x210mm)',
    papel: 'Couché 150g',
    terminacion: 'Estándar',
    color: 'Full Color',
    acabado: 'Ninguno',
    diseño: {
      archivo: null,
      texto: '',
      dobleCara: false,
      opcionesEspeciales: []
    }
  });

  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: flyerBaseImg, alt: "Flyer estándar" },
    { id: 2, src: muestra1, alt: "Flyer promocional" },
    { id: 3, src: muestra2, alt: "Flyer corporativo" },
    { id: 4, src: muestra3, alt: "Flyer tríptico" },
    { id: 5, src: muestra4, alt: "Flyer en vinilo" }
  ];

  // Configuración del producto
  const producto = {
    nombre: 'Flyers Publicitarios',
    imagen: flyerBaseImg,
    descripcion: 'Flyers de alta calidad para promociones, eventos y publicidad',
    precioBase: 0.15,
    cantidadMinima: 100,
    tiempoProduccion: '3-5 días hábiles',
    descuentosVolumen: {
      500: 0.10,
      1000: 0.15,
      2000: 0.20,
      5000: 0.30
    },
    opcionesEspeciales: {
      'Diseño incluido': 20.00,
      'Prueba de color': 15.00,
      'Entrega express 24h': 50.00,
      'Corte láser': 30.00
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
    // Validar que sea número y positivo
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
    
    // Costos por papel
    if (configuracion.papel === 'Couché 250g') precio += cantidad * 0.20;
    else if (configuracion.papel === 'Reciclado 120g') precio += cantidad * 0.15;
    else if (configuracion.papel === 'Vinilo adhesivo') precio += cantidad * 0.50;
    
    // Costos por tamaño
    if (configuracion.tamaño === 'A6 (105x148mm)') precio -= cantidad * 0.10;
    else if (configuracion.tamaño === 'Personalizado') precio += cantidad * 0.30;
    
    // Costos por terminación
    if (configuracion.terminacion === 'Troquelado') precio += cantidad * 0.40;
    else if (configuracion.terminacion === 'Punta redonda') precio += cantidad * 0.15;
    else if (configuracion.terminacion === 'Foil stamping') precio += cantidad * 0.60;
    
    // Costos por color
    if (configuracion.color === '1 Color') precio -= cantidad * 0.05;
    else if (configuracion.color === '2 Colores') precio += cantidad * 0.00;
    else if (configuracion.color === '4 Colores Pantone') precio += cantidad * 0.20;
    
    // Costos por acabado
    if (configuracion.acabado === 'Brillo') precio += cantidad * 0.25;
    else if (configuracion.acabado === 'Mate') precio += cantidad * 0.30;
    else if (configuracion.acabado === 'Relieve') precio += cantidad * 0.45;
    
    // Costos por opciones especiales (precios fijos, no por unidad)
    configuracion.diseño.opcionesEspeciales.forEach(opcion => {
      precio += producto.opcionesEspeciales[opcion];
    });
    
    // Costo por doble cara
    if (configuracion.diseño.dobleCara) precio += cantidad * 0.25;
    
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus flyers</h2>
              
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
                      {Object.keys(OPCIONES_FLYERS.Tamaños).map(tam => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_FLYERS.Tamaños[configuracion.tamaño]}
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
                            placeholder="Ej: 148"
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
                            placeholder="Ej: 210"
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
                      {Object.keys(OPCIONES_FLYERS.Papeles).map(papel => (
                        <option key={papel} value={papel}>{papel}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_FLYERS.Papeles[configuracion.papel]}
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
                      {Object.keys(OPCIONES_FLYERS.Terminaciones).map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_FLYERS.Terminaciones[configuracion.terminacion]}
                    </p>
                  </div>
                  
                  {/* Colores */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Impresión</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {OPCIONES_FLYERS.Colores.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                  </div>
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
                      {Object.keys(OPCIONES_FLYERS.Acabados).map(acabado => (
                        <option key={acabado} value={acabado}>{acabado}</option>
                      ))}
                    </select>
                    <button 
                      type="button"
                      onClick={() => setMostrarDetallesTerminacion(!mostrarDetallesTerminacion)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {OPCIONES_FLYERS.Acabados[configuracion.acabado]}
                  </p>
                  
                  {mostrarDetallesTerminacion && (
                    <div className="mt-2 p-3 bg-gray-50 rounded text-xs text-gray-700">
                      <p className="font-medium mb-1">Detalles de acabados:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>Brillo:</strong> Barniz UV en áreas seleccionadas</li>
                        <li><strong>Mate:</strong> Barniz mate para un look elegante</li>
                        <li><strong>Relieve:</strong> Textura perceptible al tacto</li>
                        <li><strong>Ninguno:</strong> Acabado estándar sin tratamiento</li>
                      </ul>
                    </div>
                  )}
                </div>
                
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
                        Importante: Incluir márgenes de seguridad (3mm por lado)
                      </p>
                    </div>
                    
                    {/* Texto personalizado */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Instrucciones especiales</label>
                      <textarea
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 'Destacar el logo', 'Usar fondo azul', etc."
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
                    
                    {/* Opciones de impresión */}
                    <div className="space-y-2">
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
                          Impresión a doble cara (+S/0.25 c/u)
                        </label>
                      </div>
                      
                      {/* Opciones especiales */}
                      <h4 className="text-xs font-medium text-gray-700 mt-3 mb-1">Servicios adicionales:</h4>
                      {Object.keys(producto.opcionesEspeciales).map(opcion => (
                        <div key={opcion} className="flex items-center">
                          <input
                            type="checkbox"
                            id={opcion.replace(/\s+/g, '-')}
                            checked={configuracion.diseño.opcionesEspeciales.includes(opcion)}
                            onChange={() => toggleOpcionEspecial(opcion)}
                            className="h-4 w-4 text-blue-600 rounded"
                          />
                          <label 
                            htmlFor={opcion.replace(/\s+/g, '-')} 
                            className="ml-2 text-sm text-gray-700"
                          >
                            {opcion} (+S/{producto.opcionesEspeciales[opcion].toFixed(2)})
                          </label>
                        </div>
                      ))}
                    </div>
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
                <p>• Flyers publicitarios de alta calidad</p>
                <p>• Múltiples tamaños y tipos de papel</p>
                <p>• Ideal para promociones, eventos y publicidad</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Sangrado incluido sin costo adicional!</p>
                <p className="text-xs text-gray-500 mt-2">* Los precios varían según papel, tamaño y opciones seleccionadas</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de flyers:</h3>
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
                
                {/* Detalles de precios */}
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Flyer {configuracion.papel}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {/* Costos adicionales por papel */}
                  {configuracion.papel !== 'Couché 150g' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por papel:</span>
                      <span>
                        {configuracion.papel === 'Couché 250g' ? '+S/0.20 c/u' :
                         configuracion.papel === 'Reciclado 120g' ? '+S/0.15 c/u' : '+S/0.50 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por tamaño */}
                  {configuracion.tamaño !== 'A5 (148x210mm)' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Variación por tamaño:</span>
                      <span>
                        {configuracion.tamaño === 'A6 (105x148mm)' ? '-S/0.10 c/u' : '+S/0.30 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por terminación */}
                  {configuracion.terminacion !== 'Estándar' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Terminación {configuracion.terminacion}:</span>
                      <span>
                        {configuracion.terminacion === 'Troquelado' ? '+S/0.40 c/u' :
                         configuracion.terminacion === 'Punta redonda' ? '+S/0.15 c/u' : '+S/0.60 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por color */}
                  {configuracion.color !== 'Full Color' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Impresión {configuracion.color}:</span>
                      <span>
                        {configuracion.color === '1 Color' ? '-S/0.05 c/u' :
                         configuracion.color === '4 Colores Pantone' ? '+S/0.20 c/u' : 'Sin recargo'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por acabado */}
                  {configuracion.acabado !== 'Ninguno' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Acabado {configuracion.acabado}:</span>
                      <span>
                        {configuracion.acabado === 'Brillo' ? '+S/0.25 c/u' :
                         configuracion.acabado === 'Mate' ? '+S/0.30 c/u' : '+S/0.45 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costo por doble cara */}
                  {configuracion.diseño.dobleCara && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Impresión doble cara:</span>
                      <span>+S/0.25 c/u</span>
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
                  
                  if (!configuracion.diseño.archivo && !configuracion.diseño.opcionesEspeciales.includes('Diseño incluido')) {
                    alert('Debes subir un diseño o seleccionar el servicio de diseño incluido');
                    return;
                  }
                  
                  alert(`¡Pedido agregado al carrito!\n\nDetalles:\n- ${cantidad} flyers ${configuracion.papel}\n- Tamaño: ${configuracion.tamaño}${configuracion.tamaño === 'Personalizado' ? ` (${medidaPersonalizada.ancho}x${medidaPersonalizada.alto}mm)` : ''}\n- Impresión: ${configuracion.color}\n\nTotal: S/${calcularPrecioTotal()}`);
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

export default FlyersPersonalizados;