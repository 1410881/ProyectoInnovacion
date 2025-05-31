import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const BannersPersonalizados = () => {
  const fileInputRef = useRef(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [isChangingImage, setIsChangingImage] = useState(false);
  const [medidasPersonalizadas, setMedidasPersonalizadas] = useState({
    ancho: '',
    alto: ''
  });
  const [configuracion, setConfiguracion] = useState({
    material: null,
    tamaño: null,
    terminacion: null,
    diseño: {
      logo: null,
      textoPrincipal: '',
      contacto: '',
      qr: false
    }
  });

  // Obtener el ID del tamaño personalizado desde los datos del producto
  const idPersonalizado = producto?.tamanos?.find(t => t.nombre === 'Personalizado')?.id || null;

  // Funciones helper para obtener datos por ID
  const getMaterialById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const material = producto.materiales?.find(m => m.id === id) || {};
    return {
      ...material,
      precio_extra: parseFloat(material.precio_extra) || 0
    };
  };

  const getTamanoById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const tamano = producto.tamanos?.find(t => t.id === id) || {};
    return {
      ...tamano,
      precio_extra: parseFloat(tamano.precio_extra) || 0
    };
  };

  const getTerminacionById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const terminacion = producto.terminaciones_banner?.find(t => t.id === id) || {};
    return {
      ...terminacion,
      precio_extra: parseFloat(terminacion.precio_extra) || 0
    };
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/7');
        if (!response.ok) throw new Error('Error al cargar el producto');

        const data = await response.json();

        const buildImageUrl = (path) => {
          if (!path) return '';
          if (/^https?:\/\//.test(path)) return path;
          if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
          return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
        };

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
          cantidad_minima: parseInt(data.cantidad_minima) || 1,
          imagen_principal: buildImageUrl(data.imagen_principal),
          imagenes_muestra: procesarImagenes(data.imagenes_muestra)
        };

        setProducto(productoData);
        setCantidad(parseInt(data.cantidad_minima) || 1);
        setImagenPrincipal(buildImageUrl(data.imagen_principal) || '');

        // Configuración inicial con el ID real del tamaño personalizado
        const tamanoPersonalizado = productoData.tamanos?.find(t => t.nombre === 'Personalizado');
        
        setConfiguracion({
          material: data.materiales?.[0]?.id || null,
          tamaño: data.tamanos?.[0]?.id || null,
          terminacion: data.terminaciones_banner?.[0]?.id || null,
          diseño: {
            logo: null,
            textoPrincipal: '',
            contacto: '',
            qr: false
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

  const calcularPrecioUnitario = () => {
    if (!producto) return 0;
    
    let precio = parseFloat(producto.precio_base) || 0;
    const material = getMaterialById(configuracion.material);
    const tamano = getTamanoById(configuracion.tamaño);
    const terminacion = getTerminacionById(configuracion.terminacion);
    
    precio += material.precio_extra;
    
    if (tamano.nombre === 'Personalizado') {
      precio += 50.00; // Precio fijo para personalizado
    } else {
      precio += tamano.precio_extra;
    }
    
    precio += terminacion.precio_extra;
    
    if (configuracion.diseño.qr) {
      precio += 15.00;
    }
    
    return precio;
  };

  const calcularDescuento = () => {
    if (!producto) return { porcentaje: 0, valor: 0 };
    if (cantidad >= 5) return { porcentaje: 15, valor: cantidad * calcularPrecioUnitario() * 0.15 };
    if (cantidad >= 3) return { porcentaje: 10, valor: cantidad * calcularPrecioUnitario() * 0.10 };
    return { porcentaje: 0, valor: 0 };
  };

  const calcularPrecioTotal = () => {
    return (calcularPrecioUnitario() * cantidad - calcularDescuento().valor).toFixed(2);
  };

  const handleAddToCart = () => {
    if (!producto) return;

    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const material = getMaterialById(configuracion.material);
    const tamano = getTamanoById(configuracion.tamaño);
    const terminacion = getTerminacionById(configuracion.terminacion);

    const extras = [];

    if (material.precio_extra > 0) {
      extras.push({
        concepto: `Material ${material.nombre}`,
        precio: material.precio_extra,
        porUnidad: 'unidad'
      });
    }

    if (tamano.nombre === 'Personalizado') {
      extras.push({
        concepto: 'Tamaño personalizado',
        precio: 50.00,
        porUnidad: 'unidad'
      });
    } else if (tamano.precio_extra > 0) {
      extras.push({
        concepto: `Tamaño ${tamano.nombre}`,
        precio: tamano.precio_extra,
        porUnidad: 'unidad'
      });
    }

    if (terminacion.precio_extra > 0) {
      extras.push({
        concepto: `Terminación ${terminacion.nombre}`,
        precio: terminacion.precio_extra,
        porUnidad: 'unidad'
      });
    }

    if (configuracion.diseño.qr) {
      extras.push({
        concepto: 'Código QR',
        precio: 15.00,
        porUnidad: 'unidad'
      });
    }

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: cantidad,
      minimo: parseInt(producto.cantidad_minima) || 1,
      unidad: 'unidad',
      precioUnitario: precioUnitario,
      precioTotal: parseFloat(calcularPrecioTotal()),
      personalizacion: {
        material: material,
        tamaño: tamano.nombre === 'Personalizado' 
          ? `Personalizado (${medidasPersonalizadas.ancho}x${medidasPersonalizadas.alto}cm)`
          : tamano,
        terminacion: terminacion,
        diseño: {
          texto: configuracion.diseño.textoPrincipal,
          contacto: configuracion.diseño.contacto,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          qr: configuracion.diseño.qr ? 'Sí' : 'No'
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
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className={`transition-opacity duration-300 ${isChangingImage ? 'opacity-0' : 'opacity-100'}`}>
                <img
                  src={imagenPrincipal}
                  alt="Banner personalizado"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x300?text=Imagen+no+disponible';
                  }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tu banner</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.material || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, material: parseInt(e.target.value) })}
                    >
                      {producto.materiales?.map(mat => (
                        <option key={mat.id} value={mat.id}>
                          {mat.nombre} {mat.precio_extra > 0 ? `(+S/${mat.precio_extra})` : ''}
                        </option>
                      ))}
                    </select>
                    {configuracion.material && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getMaterialById(configuracion.material).descripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño || ''}
                      onChange={(e) => {
                        const nuevoValor = parseInt(e.target.value);
                        setConfiguracion({ 
                          ...configuracion, 
                          tamaño: nuevoValor
                        });
                        // Resetear medidas al cambiar de tamaño
                        if (getTamanoById(nuevoValor).nombre !== 'Personalizado') {
                          setMedidasPersonalizadas({ ancho: '', alto: '' });
                        }
                      }}
                    >
                      {producto.tamanos?.map(tam => (
                        <option key={tam.id} value={tam.id}>
                          {tam.nombre} {tam.precio_extra > 0 ? `(+S/${tam.precio_extra})` : ''}
                        </option>
                      ))}
                    </select>
                    {configuracion.tamaño && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTamanoById(configuracion.tamaño).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {configuracion.tamaño && getTamanoById(configuracion.tamaño).nombre === 'Personalizado' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (cm)</label>
                      <input
                        type="number"
                        min="10"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 150"
                        value={medidasPersonalizadas.ancho}
                        onChange={(e) => setMedidasPersonalizadas({
                          ...medidasPersonalizadas,
                          ancho: e.target.value
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alto (cm)</label>
                      <input
                        type="number"
                        min="10"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 200"
                        value={medidasPersonalizadas.alto}
                        onChange={(e) => setMedidasPersonalizadas({
                          ...medidasPersonalizadas,
                          alto: e.target.value
                        })}
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Terminación</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={configuracion.terminacion || ''}
                    onChange={(e) => setConfiguracion({ ...configuracion, terminacion: parseInt(e.target.value) })}
                  >
                    {producto.terminaciones_banner?.map(term => (
                      <option key={term.id} value={term.id}>
                        {term.nombre} {term.precio_extra > 0 ? `(+S/${term.precio_extra})` : ''}
                      </option>
                    ))}
                  </select>
                  {configuracion.terminacion && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getTerminacionById(configuracion.terminacion).descripcion}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo (300dpi mínimo)</label>
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
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto principal</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Título o mensaje principal"
                        value={configuracion.diseño.textoPrincipal}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoPrincipal: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Contacto o información</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Teléfono, web o detalles"
                        value={configuracion.diseño.contacto}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            contacto: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="incluirQR"
                        checked={configuracion.diseño.qr}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            qr: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="incluirQR" className="ml-2 text-sm text-gray-700">
                        Incluir código QR (+S/15.00)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-3">Descripción</h2>
              <div className="text-gray-600 space-y-2">
                <p>• Banners profesionales para eventos y publicidad</p>
                <p>• Materiales resistentes para interior/exterior</p>
                <p>• Ideal para stands, congresos y promociones</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Incluye diseño profesional</p>
                <p className="text-green-600 font-medium">• Impresión en alta resolución</p>
              </div>

              {producto.imagenes_muestra?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ejemplos de uso:</h3>
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

            <div className="bg-white p-6 rounded-lg shadow-md mt-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Tu Pedido</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Cantidad:</span>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(producto.cantidad_minima, cantidad - 1))}
                      disabled={cantidad <= producto.cantidad_minima}
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
                    <span>Banner {getMaterialById(configuracion.material).nombre || ''}:</span>
                    <span>S/{parseFloat(producto.precio_base).toFixed(2)}</span>
                  </div>

                  {getMaterialById(configuracion.material).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>+S/{getMaterialById(configuracion.material).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {getTamanoById(configuracion.tamaño).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tamaño:</span>
                      <span>+S/{getTamanoById(configuracion.tamaño).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {getTerminacionById(configuracion.terminacion).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por terminación:</span>
                      <span>+S/{getTerminacionById(configuracion.terminacion).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.diseño.qr && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Código QR:</span>
                      <span>+S/15.00</span>
                    </div>
                  )}

                  {calcularDescuento().porcentaje > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento por cantidad:</span>
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
                disabled={!configuracion.material || !configuracion.tamaño || !configuracion.terminacion || 
                  (getTamanoById(configuracion.tamaño).nombre === 'Personalizado' && (!medidasPersonalizadas.ancho || !medidasPersonalizadas.alto))}
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

export default BannersPersonalizados;