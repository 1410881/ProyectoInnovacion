import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const BurbujasEmbalaje = () => {
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(0);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [configuracion, setConfiguracion] = useState({
    tipo: null,
    ancho: null,
    longitud: null,
    color: null,
    diseño: {
      logo: null,
      texto: '',
      impresionLateral: false
    }
  });

  // Función para construir URLs de imágenes
  const buildImageUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
    return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
  };

  // Obtener datos del producto desde la API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/3'); // ID 3 para burbujas
        if (!response.ok) throw new Error('Error al cargar el producto');
        
        const data = await response.json();
        
        // Procesar imágenes
        const procesarImagenes = (imagenes) => {
          if (!imagenes || !Array.isArray(imagenes)) return [];
          return imagenes.map(img => ({
            ...img,
            url: buildImageUrl(img.url)
          }));
        };

        const productoData = {
          ...data,
          precio_base: parseFloat(data.precio_base) || 0,
          cantidad_minima: parseInt(data.cantidad_minima) || 10,
          imagen_principal: buildImageUrl(data.imagen_principal),
          imagenes_muestra: procesarImagenes(data.imagenes_muestra)
        };

        setProducto(productoData);
        setCantidad(parseInt(data.cantidad_minima) || 10);
        setImagenPrincipal(buildImageUrl(data.imagen_principal) || '');

        // Configuración inicial con los primeros valores disponibles
        setConfiguracion({
          tipo: data.tipos_burbujas?.[0]?.id || null,
          ancho: data.anchos_rollos?.[0]?.id || null,
          longitud: data.longitudes_rollos?.[0]?.id || null,
          color: data.colores?.[0]?.id || null,
          diseño: {
            logo: null,
            texto: '',
            impresionLateral: false
          }
        });

      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, []);

  // Funciones para obtener detalles de las opciones
  const getTipoBurbujaById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const tipo = producto.tipos_burbujas?.find(t => t.id === id) || {};
    return {
      ...tipo,
      precio_extra: parseFloat(tipo.precio_extra) || 0
    };
  };

  const getAnchoRolloById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const ancho = producto.anchos_rollos?.find(a => a.id === id) || {};
    return {
      ...ancho,
      precio_extra: parseFloat(ancho.precio_extra) || 0
    };
  };

  const getLongitudRolloById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const longitud = producto.longitudes_rollos?.find(l => l.id === id) || {};
    return {
      ...longitud,
      precio_extra: parseFloat(longitud.precio_extra) || 0
    };
  };

  const getColorById = (id) => {
    if (!producto || !id) return { nombre: '', precio_extra: 0 };
    const color = producto.colores?.find(c => c.id === id) || {};
    return {
      ...color,
      precio_extra: parseFloat(color.precio_extra) || 0
    };
  };

  // Funciones para manejo de imágenes
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setConfiguracion(prev => ({
          ...prev,
          diseño: {
            ...prev.diseño,
            logo: event.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setConfiguracion(prev => ({
      ...prev,
      diseño: {
        ...prev.diseño,
        logo: null
      }
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const cambiarImagenPrincipal = (nuevaImagen) => {
    if (nuevaImagen === imagenPrincipal) return;
    setIsChangingImage(true);
    setTimeout(() => {
      setImagenPrincipal(nuevaImagen);
      setIsChangingImage(false);
    }, 300);
  };

  // Cálculos de precios
  const calcularPrecioUnitario = () => {
    if (!producto) return 0;
    
    const precioBase = parseFloat(producto.precio_base) || 0;
    const tipo = getTipoBurbujaById(configuracion.tipo);
    const ancho = getAnchoRolloById(configuracion.ancho);
    const color = getColorById(configuracion.color);
    
    return precioBase + tipo.precio_extra + ancho.precio_extra + color.precio_extra;
  };

  const calcularDescuento = () => {
    if (!producto) return { porcentaje: 0, valor: 0 };
    if (cantidad >= 100) return { porcentaje: 15, valor: cantidad * calcularPrecioUnitario() * 0.15 };
    if (cantidad >= 50) return { porcentaje: 10, valor: cantidad * calcularPrecioUnitario() * 0.10 };
    return { porcentaje: 0, valor: 0 };
  };

  const calcularPrecioTotal = () => {
    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const longitud = getLongitudRolloById(configuracion.longitud);
    
    let total = (precioUnitario * cantidad - descuento.valor) + longitud.precio_extra;
    
    if (configuracion.diseño.impresionLateral) {
      total += cantidad * 0.15;
    }
    
    return total.toFixed(2);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!producto) return;

    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const tipo = getTipoBurbujaById(configuracion.tipo);
    const ancho = getAnchoRolloById(configuracion.ancho);
    const longitud = getLongitudRolloById(configuracion.longitud);
    const color = getColorById(configuracion.color);

    const extras = [];
    
    if (tipo.precio_extra > 0) {
      extras.push({
        concepto: `Tipo ${tipo.nombre}`,
        precio: tipo.precio_extra,
        porUnidad: 'm²'
      });
    }
    
    if (ancho.precio_extra > 0) {
      extras.push({
        concepto: `Ancho ${ancho.nombre}`,
        precio: ancho.precio_extra,
        porUnidad: 'm'
      });
    }
    
    if (color.precio_extra > 0) {
      extras.push({
        concepto: `Color ${color.nombre}`,
        precio: color.precio_extra,
        porUnidad: 'm²'
      });
    }
    
    if (longitud.precio_extra > 0) {
      extras.push({
        concepto: `Longitud ${longitud.nombre}`,
        precio: longitud.precio_extra,
        fijo: true
      });
    }
    
    if (configuracion.diseño.impresionLateral) {
      extras.push({
        concepto: 'Impresión lateral',
        precio: 0.15,
        porUnidad: 'm'
      });
    }

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: cantidad,
      minimo: producto.cantidad_minima,
      unidad: producto.unidad_medida || 'm²',
      precioUnitario: precioUnitario,
      precioTotal: parseFloat(calcularPrecioTotal()),
      personalizacion: {
        tipo: tipo,
        ancho: ancho,
        longitud: longitud,
        color: color,
        diseño: {
          texto: configuracion.diseño.texto,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          impresionLateral: configuracion.diseño.impresionLateral
        }
      },
      extras: extras,
      descuento: descuento
    };

    addToCart(cartItem);
    navigate('/carrito');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!producto) return <div className="min-h-screen flex items-center justify-center">Producto no encontrado</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8 pt-32">
          <h1 className="text-3xl font-bold text-gray-800">{producto.nombre}</h1>
          <p className="text-gray-600 mt-2">{producto.descripcion}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda - Imagen y personalización */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`transition-opacity duration-300 ${isChangingImage ? 'opacity-0' : 'opacity-100'}`}>
                <img
                  src={imagenPrincipal}
                  alt="Burbujas de embalaje"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus burbujas</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de burbuja</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipo || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, tipo: parseInt(e.target.value) })}
                    >
                      {producto.tipos_burbujas?.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                    {configuracion.tipo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTipoBurbujaById(configuracion.tipo).descripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancho del rollo</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.ancho || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, ancho: parseInt(e.target.value) })}
                    >
                      {producto.anchos_rollos?.map(ancho => (
                        <option key={ancho.id} value={ancho.id}>{ancho.nombre}</option>
                      ))}
                    </select>
                    {configuracion.ancho && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getAnchoRolloById(configuracion.ancho).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitud del rollo</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.longitud || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, longitud: parseInt(e.target.value) })}
                    >
                      {producto.longitudes_rollos?.map(longitud => (
                        <option key={longitud.id} value={longitud.id}>{longitud.nombre}</option>
                      ))}
                    </select>
                    {configuracion.longitud && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getLongitudRolloById(configuracion.longitud).descripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.color || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, color: parseInt(e.target.value) })}
                    >
                      {producto.colores?.map(color => (
                        <option key={color.id} value={color.id}>{color.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Personalización avanzada</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo (solo para color personalizado)</label>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                        disabled={getColorById(configuracion.color)?.nombre !== 'Personalizado'}
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
                            getColorById(configuracion.color)?.nombre !== 'Personalizado' 
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                              : 'border-gray-300'
                          }`}
                          disabled={getColorById(configuracion.color)?.nombre !== 'Personalizado'}
                        >
                          {getColorById(configuracion.color)?.nombre !== 'Personalizado' 
                            ? 'Disponible solo para color personalizado' 
                            : '+ Seleccionar imagen'}
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG (300dpi mínimo)</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto impreso</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 'Frágil', 'Manejar con cuidado'"
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
                        id="impresionLateral"
                        checked={configuracion.diseño.impresionLateral}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            impresionLateral: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="impresionLateral" className="ml-2 text-sm text-gray-700">
                        Impresión en borde lateral (+S/0.15/m)
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
                <p>• Burbujas de embalaje de alta calidad</p>
                <p>• Protección contra golpes y rasguños</p>
                <p>• Ideal para envíos frágiles y almacenamiento</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Cantidad mínima: {producto.cantidad_minima} {producto.unidad_medida || 'm²'}</p>
                <p className="text-green-600 font-medium">• Personalización disponible</p>
              </div>

              {producto.imagenes_muestra?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ver otras muestras:</h3>
                  <div className="flex space-x-3 overflow-x-auto py-2 px-4">
                    {producto.imagenes_muestra.map((imagen) => (
                      <div
                        key={imagen.id}
                        className="flex-shrink-0 relative cursor-pointer"
                        onClick={() => cambiarImagenPrincipal(imagen.url)}
                      >
                        <img
                          src={imagen.url}
                          alt={imagen.alt_text || "Muestra de producto"}
                          className={`w-24 h-24 object-cover rounded transition-all duration-200 ${imagenPrincipal === imagen.url ? 'ring-2 ring-green-500 scale-105' : 'hover:scale-105'}`}
                          onError={(e) => {
                            console.error('Error al cargar imagen:', imagen.url);
                            e.target.src = 'https://via.placeholder.com/96?text=Imagen+no+disponible';
                          }}
                        />
                        {imagenPrincipal === imagen.url && (
                          <div className="absolute inset-0  bg-opacity-20 rounded flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white p-6 rounded-lg shadow-md mt-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tu Pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cantidad ({producto.unidad_medida || 'm²'}):</span>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(producto.cantidad_minima, cantidad - 5))}
                      disabled={cantidad <= producto.cantidad_minima}
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
                    <span>Burbuja {getTipoBurbujaById(configuracion.tipo).nombre || ''}:</span>
                    <span>S/{producto.precio_base.toFixed(2)} por {producto.unidad_medida || 'm²'}</span>
                  </div>

                  {getTipoBurbujaById(configuracion.tipo).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tipo:</span>
                      <span>+S/{getTipoBurbujaById(configuracion.tipo).precio_extra.toFixed(2)} por {producto.unidad_medida || 'm²'}</span>
                    </div>
                  )}

                  {getAnchoRolloById(configuracion.ancho).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por ancho:</span>
                      <span>+S/{getAnchoRolloById(configuracion.ancho).precio_extra.toFixed(2)} por m</span>
                    </div>
                  )}

                  {getColorById(configuracion.color).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por color:</span>
                      <span>+S/{getColorById(configuracion.color).precio_extra.toFixed(2)} por {producto.unidad_medida || 'm²'}</span>
                    </div>
                  )}

                  {getLongitudRolloById(configuracion.longitud).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por longitud:</span>
                      <span>+S/{getLongitudRolloById(configuracion.longitud).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.diseño.impresionLateral && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Impresión lateral:</span>
                      <span>+S/0.15 por m</span>
                    </div>
                  )}

                  {calcularDescuento().porcentaje > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por volumen:</span>
                      <span>{calcularDescuento().porcentaje}%</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between font-bold border-t pt-3 text-lg">
                  <span>Total:</span>
                  <span>S/{calcularPrecioTotal()}</span>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!configuracion.tipo || !configuracion.ancho || !configuracion.longitud || !configuracion.color}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Agregar al Carrito
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                Tiempo de producción: {producto.tiempo_produccion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurbujasEmbalaje;