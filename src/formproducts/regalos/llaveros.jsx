import React, { useState, useRef, useEffect } from 'react';

import llaveroBaseImg from "../../assets/productos/llaveros.jpg";
import muestra1 from "../../assets/productos/llaveros.jpg";
import muestra2 from "../../assets/productos/llaveros.jpg";
import muestra3 from "../../assets/productos/llaveros.jpg";
import muestra4 from "../../assets/productos/llaveros.jpg";

const OPCIONES_LLAVEROS = {
  'Materiales': {
    'PVC': 'Flexible y duradero (+S/0.50)',
    'Acrílico': 'Rígido y premium (+S/1.00)',
    'Madera': 'Elegante y ecológico (+S/1.20)',
    'Metal': 'Resistente y profesional (+S/1.50)'
  },
  'Formas': {
    'Redondo': 'Clásico 3cm diámetro',
    'Rectangular': '5x3cm estándar',
    'Personalizada': 'Forma especial (+S/2.00)',
    'Corazón': 'Romántico 4cm'
  },
  'Terminaciones': {
    'Estándar': 'Bordes pulidos',
    'Premium': 'Bordes biselados (+S/0.30)',
    'Con relieve': 'Textura 3D (+S/0.80)'
  },
  'Colores': ['Blanco', 'Negro', 'Plateado', 'Dorado', 'Rojo', 'Azul', 'Personalizado']
};

const LlaverosPersonalizados = () => {
  const fileInputRef = useRef(null);
  const [cantidad, setCantidad] = useState(50);
  const [imagenPrincipal, setImagenPrincipal] = useState(llaveroBaseImg);
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [colorPersonalizado, setColorPersonalizado] = useState('#FFFFFF');
  const [mostrarSelectorColor, setMostrarSelectorColor] = useState(false);
  const [errorColor, setErrorColor] = useState('');
  const [mostrarDetallesForma, setMostrarDetallesForma] = useState(false);
  const [troqueladoIncluido, setTroqueladoIncluido] = useState(false);

  const [configuracion, setConfiguracion] = useState({
    material: 'PVC',
    forma: 'Redondo',
    terminacion: 'Estándar',
    color: 'Blanco',
    diseño: {
      logo: null,
      texto: '',
      dobleCara: false,
      opcionesEspeciales: []
    }
  });

  // Imágenes de muestra para el carrusel
  const imagenesMuestra = [
    { id: 1, src: llaveroBaseImg, alt: "Llavero estándar" },
    { id: 2, src: muestra1, alt: "Llavero corporativo" },
    { id: 3, src: muestra2, alt: "Llavero promocional" },
    { id: 4, src: muestra3, alt: "Llavero de madera" },
    { id: 5, src: muestra4, alt: "Llavero metálico" }
  ];

  // Configuración del producto
  const producto = {
    nombre: 'Llaveros Personalizados',
    imagen: llaveroBaseImg,
    descripcion: 'Llaveros de alta calidad para promociones, regalos corporativos o merchandising',
    precioBase: 2.50,
    cantidadMinima: 50,
    tiempoProduccion: '3-5 días hábiles',
    descuentosVolumen: {
      100: 0.10,
      300: 0.15,
      500: 0.20,
      1000: 0.25
    },
    opcionesEspeciales: {
      'Impresión full color': 0.50,
      'Grabado láser': 1.00,
      'Barniz UV selectivo': 0.30,
      'Troquelado especial': 1.50
    }
  };

  // Efectos para manejar cambios
  useEffect(() => {
    setMostrarSelectorColor(configuracion.color === 'Personalizado');
    if (configuracion.color !== 'Personalizado') {
      setErrorColor('');
    }
  }, [configuracion.color]);

  useEffect(() => {
    if (configuracion.forma === 'Personalizada') {
      setTroqueladoIncluido(true);
      setConfiguracion(prev => ({
        ...prev,
        diseño: {
          ...prev.diseño,
          opcionesEspeciales: prev.diseño.opcionesEspeciales.filter(
            opcion => opcion !== 'Troquelado especial'
          )
        }
      }));
    } else {
      setTroqueladoIncluido(false);
    }
  }, [configuracion.forma]);

  // Manejo de carga de imágenes
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

  // Animación para cambio de imagen
  const cambiarImagenPrincipal = (nuevaImagen) => {
    if (nuevaImagen === imagenPrincipal) return;
    
    setIsChangingImage(true);
    setTimeout(() => {
      setImagenPrincipal(nuevaImagen);
      setIsChangingImage(false);
    }, 300);
  };

  // Manejo de color personalizado
  const handleColorChange = (e) => {
    const value = e.target.value;
    setColorPersonalizado(value);
    
    if (!/^#[0-9A-F]{6}$/i.test(value)) {
      setErrorColor('Ingresa un código hexadecimal válido (ej: #FF5733)');
    } else {
      setErrorColor('');
    }
  };

  // Manejo de opciones especiales
  const toggleOpcionEspecial = (opcion) => {
    if (troqueladoIncluido && opcion === 'Troquelado especial') return;
    
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
    
    // Costos por material
    if (configuracion.material === 'Acrílico') precio += cantidad * 1.00;
    else if (configuracion.material === 'Madera') precio += cantidad * 1.20;
    else if (configuracion.material === 'Metal') precio += cantidad * 1.50;
    else if (configuracion.material === 'PVC') precio += cantidad * 0.50;
    
    // Costos por forma
    if (configuracion.forma === 'Personalizada') precio += cantidad * 2.00;
    
    // Costos por terminación
    if (configuracion.terminacion === 'Premium') precio += cantidad * 0.30;
    else if (configuracion.terminacion === 'Con relieve') precio += cantidad * 0.80;
    
    // Costos por opciones especiales (excluyendo troquelado si ya está incluido)
    configuracion.diseño.opcionesEspeciales.forEach(opcion => {
      if (!(troqueladoIncluido && opcion === 'Troquelado especial')) {
        precio += cantidad * producto.opcionesEspeciales[opcion];
      }
    });
    
    // Costo por doble cara
    if (configuracion.diseño.dobleCara) precio += cantidad * 0.40;
    
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
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus llaveros</h2>
              
              <div className="space-y-4">
                {/* Selectores de opciones básicas */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Materiales */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.material}
                      onChange={(e) => setConfiguracion({...configuracion, material: e.target.value})}
                    >
                      {Object.keys(OPCIONES_LLAVEROS.Materiales).map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_LLAVEROS.Materiales[configuracion.material]}
                    </p>
                  </div>
                  
                  {/* Formas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Forma</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.forma}
                      onChange={(e) => setConfiguracion({...configuracion, forma: e.target.value})}
                    >
                      {Object.keys(OPCIONES_LLAVEROS.Formas).map(forma => (
                        <option key={forma} value={forma}>{forma}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_LLAVEROS.Formas[configuracion.forma]}
                    </p>
                    {configuracion.forma === 'Personalizada' && (
                        <div className="mt-1">
                            <div className="group relative inline-block">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Forma especial
                                <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </span>
                            <div className="hidden group-hover:block absolute z-10 w-64 p-2 mt-1 -ml-48 text-xs bg-white border border-gray-200 rounded shadow-lg">
                                <p>✓ El llavero tomará la forma exacta de tu diseño</p>
                                <p>✓ Requiere archivo vectorial (AI/EPS) para mejor precisión</p>
                                <p>✓ Incluye troquelado especial para contornos complejos</p>
                            </div>
                            </div>
                        </div>
                        )}
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
                      {Object.keys(OPCIONES_LLAVEROS.Terminaciones).map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {OPCIONES_LLAVEROS.Terminaciones[configuracion.terminacion]}
                    </p>
                  </div>
                  
                  {/* Colores */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color}
                      onChange={(e) => setConfiguracion({...configuracion, color: e.target.value})}
                    >
                      {OPCIONES_LLAVEROS.Colores.map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </select>
                    
                    {mostrarSelectorColor && (
                      <div className="mt-2">
                        <label className="block text-xs text-gray-700 mb-1">Elige tu color:</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colorPersonalizado}
                            onChange={handleColorChange}
                            className="h-8 w-8 cursor-pointer rounded border border-gray-300"
                          />
                          <input
                            type="text"
                            value={colorPersonalizado}
                            onChange={handleColorChange}
                            pattern="^#[0-9A-F]{6}$"
                            maxLength="7"
                            className="flex-1 p-1 border rounded text-xs"
                            placeholder="#FFFFFF"
                          />
                        </div>
                        {errorColor && (
                          <p className="text-xs text-red-500 mt-1">{errorColor}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">Ejemplos: #FF0000 (rojo), #00FF00 (verde), #0000FF (azul)</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Personalización avanzada */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado</h3>
                  
                  <div className="space-y-3">
                    {/* Subir logo/imagen */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo o diseño</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*,.ai,.eps,.pdf"
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
                        Formatos: JPG, PNG (300dpi mínimo), PDF, AI/EPS (para formas personalizadas)
                      </p>
                      {configuracion.forma === 'Personalizada' && (
                        <p className="text-xs text-blue-600 mt-1">
                          Para forma personalizada, recomendamos archivos vectoriales (AI/EPS)
                        </p>
                      )}
                    </div>
                    
                    {/* Texto personalizado */}
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto personalizado</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Nombre de empresa, slogan, etc."
                        value={configuracion.diseño.texto}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            texto: e.target.value
                          }
                        })}
                        maxLength="30"
                      />
                      <p className="text-xs text-gray-500 mt-1">Máximo 30 caracteres</p>
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
                          Impresión a doble cara (+S/0.40 c/u)
                        </label>
                      </div>
                      
                      {/* Opciones especiales */}
                      <h4 className="text-xs font-medium text-gray-700 mt-3 mb-1">Técnicas especiales:</h4>
                      {Object.keys(producto.opcionesEspeciales).map(opcion => (
                        <div key={opcion} className="flex items-center">
                          <input
                            type="checkbox"
                            id={opcion.replace(/\s+/g, '-')}
                            checked={configuracion.diseño.opcionesEspeciales.includes(opcion)}
                            onChange={() => toggleOpcionEspecial(opcion)}
                            disabled={troqueladoIncluido && opcion === 'Troquelado especial'}
                            className={`h-4 w-4 text-blue-600 rounded ${
                              troqueladoIncluido && opcion === 'Troquelado especial' ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          />
                          <label 
                            htmlFor={opcion.replace(/\s+/g, '-')} 
                            className={`ml-2 text-sm ${
                              troqueladoIncluido && opcion === 'Troquelado especial' ? 
                                'text-gray-400 line-through' : 'text-gray-700'
                            }`}
                          >
                            {opcion} {opcion === 'Troquelado especial' && troqueladoIncluido ? 
                              '(incluido)' : `(+S/${producto.opcionesEspeciales[opcion].toFixed(2)} c/u)`}
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
                <p>• Llaveros personalizados de alta calidad</p>
                <p>• Múltiples materiales: PVC, acrílico, madera y metal</p>
                <p>• Ideal para regalos corporativos, promociones y eventos</p>
                <p>• Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>• Cantidad mínima: {producto.cantidadMinima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño básico incluido sin costo adicional!</p>
                <p className="text-xs text-gray-500 mt-2">* Los precios varían según material, cantidad y técnicas especiales seleccionadas</p>
              </div>

              {/* Carrusel de muestras */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de llaveros:</h3>
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
                      onClick={() => setCantidad(Math.max(producto.cantidadMinima, cantidad - 10))}
                      disabled={cantidad <= producto.cantidadMinima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad}</span>
                    <button 
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 10)}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Detalles de precios */}
                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Llavero {configuracion.material}:</span>
                    <span>S/{producto.precioBase.toFixed(2)} c/u</span>
                  </div>
                  
                  {/* Costos adicionales por material */}
                  {configuracion.material !== 'PVC' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>
                        {configuracion.material === 'Acrílico' ? '+S/1.00 c/u' :
                         configuracion.material === 'Madera' ? '+S/1.20 c/u' : '+S/1.50 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por forma personalizada */}
                  {configuracion.forma === 'Personalizada' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Forma personalizada:</span>
                      <span>+S/2.00 c/u</span>
                    </div>
                  )}
                  
                  {/* Costos por terminación */}
                  {configuracion.terminacion !== 'Estándar' && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Terminación {configuracion.terminacion}:</span>
                      <span>
                        {configuracion.terminacion === 'Premium' ? '+S/0.30 c/u' : '+S/0.80 c/u'}
                      </span>
                    </div>
                  )}
                  
                  {/* Costos por opciones especiales */}
                  {configuracion.diseño.opcionesEspeciales.map(opcion => (
                    <div key={opcion} className="flex justify-between text-sm text-gray-600">
                      <span>{opcion}:</span>
                      <span>+S/{producto.opcionesEspeciales[opcion].toFixed(2)} c/u</span>
                    </div>
                  ))}
                  
                  {/* Costo por doble cara */}
                  {configuracion.diseño.dobleCara && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Impresión doble cara:</span>
                      <span>+S/0.40 c/u</span>
                    </div>
                  )}
                  
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
                  if (configuracion.color === 'Personalizado' && errorColor) {
                    alert('Por favor corrige el código de color');
                    return;
                  }
                  
                  if (configuracion.forma === 'Personalizada' && !configuracion.diseño.logo) {
                    alert('Para forma personalizada debes subir un diseño');
                    return;
                  }
                  
                  alert(`¡Pedido agregado al carrito!\n\nDetalles:\n- ${cantidad} llaveros ${configuracion.material}\n- Forma: ${configuracion.forma}\n- Color: ${configuracion.color === 'Personalizado' ? colorPersonalizado : configuracion.color}\n\nTotal: S/${calcularPrecioTotal()}`);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Agregar al Carrito
              </button>
              
              <div className="mt-3 text-center text-sm text-gray-500 space-y-1">
                <p>Tiempo de producción: {producto.tiempoProduccion}</p>
                <p>Envíos a todo el Perú - Consultar costos</p>
                <p className="text-xs mt-2">* Precios sujetos a verificación de diseño</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LlaverosPersonalizados;