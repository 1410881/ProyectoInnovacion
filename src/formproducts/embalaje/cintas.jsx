import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const CintasPersonalizadas = () => {
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
    material: null,
    color: null,
    ancho: null,
    tipoBorde: null,
    presentacion: null,
    diseño: {
      logo: null,
      texto: '',
      codigoBarras: false,
      numeroCodigo: ''
    }
  });

  // Función para construir URLs de imágenes
  const buildImageUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
    return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
  };

  // Funciones para obtener datos por ID con valores por defecto
  const getDataById = (data, id) => {
    if (!producto || !id || !Array.isArray(data)) return { nombre: '', descripcion: '', precio_extra: 0 };
    const item = data.find(item => item.id === id) || {};
    return {
      ...item,
      precio_extra: parseFloat(item.precio_extra) || 0
    };
  };

  const getMaterialById = (id) => getDataById(producto?.materiales, id);
  const getColorById = (id) => getDataById(producto?.colores, id);
  const getAnchoById = (id) => getDataById(producto?.anchos_cinta, id);
  const getTipoBordeById = (id) => getDataById(producto?.tipos_borde_cinta, id);
  const getPresentacionById = (id) => getDataById(producto?.presentaciones_cinta, id);

  // Fetch producto desde API
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/4');
        if (!response.ok) throw new Error('Error al cargar el producto');

        const data = await response.json();

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
          cantidad_minima: parseInt(data.cantidad_minima) || 100,
          imagen_principal: buildImageUrl(data.imagen_principal),
          imagenes_muestra: procesarImagenes(data.imagenes_muestra)
        };

        setProducto(productoData);
        setCantidad(parseInt(data.cantidad_minima) || 100);
        setImagenPrincipal(buildImageUrl(data.imagen_principal) || '');

        setConfiguracion({
          material: data.materiales?.[0]?.id || null,
          color: data.colores?.[0]?.id || null,
          ancho: data.anchos_cinta?.[0]?.id || null,
          tipoBorde: data.tipos_borde_cinta?.[0]?.id || null,
          presentacion: data.presentaciones_cinta?.[0]?.id || null,
          diseño: {
            logo: null,
            texto: '',
            codigoBarras: false,
            numeroCodigo: ''
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

  // Funciones para manejar imágenes
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

  // Cálculos de precio y cantidad
  const calcularMetros = () => {
    const presentacion = getPresentacionById(configuracion.presentacion);
    if (presentacion.nombre === 'Por metro') return cantidad;
    if (presentacion.nombre === 'Rollo 50m') return cantidad * 50;
    if (presentacion.nombre === 'Rollo 100m') return cantidad * 100;
    return cantidad;
  };

  const calcularPrecioUnitario = () => {
    if (!producto) return 0;
    
    const precioBase = parseFloat(producto.precio_base) || 0;
    const material = getMaterialById(configuracion.material);
    const color = getColorById(configuracion.color);
    const ancho = getAnchoById(configuracion.ancho);
    const tipoBorde = getTipoBordeById(configuracion.tipoBorde);

    return precioBase + 
           material.precio_extra + 
           color.precio_extra + 
           ancho.precio_extra + 
           tipoBorde.precio_extra;
  };

  const calcularDescuento = () => {
    const metros = calcularMetros();
    if (metros >= 1000) return { porcentaje: 15, valor: metros * calcularPrecioUnitario() * 0.15 };
    if (metros >= 500) return { porcentaje: 10, valor: metros * calcularPrecioUnitario() * 0.10 };
    return { porcentaje: 0, valor: 0 };
  };

  const calcularPrecioTotal = () => {
    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const metros = calcularMetros();

    let total = precioUnitario * metros - descuento.valor;
    if (configuracion.diseño.codigoBarras) total += metros * 0.20;

    return total.toFixed(2);
  };

  // Agregar al carrito
  const handleAddToCart = () => {
    if (!producto) return;

    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const metros = calcularMetros();

    const material = getMaterialById(configuracion.material);
    const color = getColorById(configuracion.color);
    const ancho = getAnchoById(configuracion.ancho);
    const tipoBorde = getTipoBordeById(configuracion.tipoBorde);
    const presentacion = getPresentacionById(configuracion.presentacion);

    const extras = [
      ...(material.precio_extra > 0 ? [{
        concepto: `Material ${material.nombre}`,
        precio: material.precio_extra,
        porUnidad: 'metro'
      }] : []),
      ...(ancho.precio_extra > 0 ? [{
        concepto: `Ancho ${ancho.nombre}`,
        precio: ancho.precio_extra,
        porUnidad: 'metro'
      }] : []),
      ...(color.precio_extra > 0 ? [{
        concepto: `Color ${color.nombre}`,
        precio: color.precio_extra,
        porUnidad: 'metro'
      }] : []),
      ...(tipoBorde.precio_extra > 0 ? [{
        concepto: `Borde ${tipoBorde.nombre}`,
        precio: tipoBorde.precio_extra,
        porUnidad: 'metro'
      }] : []),
      ...(configuracion.diseño.codigoBarras ? [{
        concepto: 'Código de barras',
        precio: 0.20,
        porUnidad: 'metro'
      }] : [])
    ];

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: metros,
      minimo: producto.cantidad_minima,
      unidad: 'metro',
      precioUnitario: precioUnitario,
      precioTotal: parseFloat(calcularPrecioTotal()),
      personalizacion: {
        material,
        color,
        ancho,
        tipoBorde,
        presentacion,
        diseño: {
          texto: configuracion.diseño.texto,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          codigoBarras: configuracion.diseño.codigoBarras,
          numeroCodigo: configuracion.diseño.numeroCodigo
        }
      },
      extras,
      descuento
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
                  alt="Cinta personalizada"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus cintas</h2>

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
                        <option key={mat.id} value={mat.id}>{mat.nombre}</option>
                      ))}
                    </select>
                    {configuracion.material && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getMaterialById(configuracion.material).descripcion}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ancho</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.ancho || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, ancho: parseInt(e.target.value) })}
                    >
                      {producto.anchos_cinta?.map(ancho => (
                        <option key={ancho.id} value={ancho.id}>{ancho.nombre}</option>
                      ))}
                    </select>
                    {configuracion.ancho && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getAnchoById(configuracion.ancho).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de borde</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipoBorde || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, tipoBorde: parseInt(e.target.value) })}
                    >
                      {producto.tipos_borde_cinta?.map(borde => (
                        <option key={borde.id} value={borde.id}>{borde.nombre}</option>
                      ))}
                    </select>
                    {configuracion.tipoBorde && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTipoBordeById(configuracion.tipoBorde).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Presentación</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={configuracion.presentacion || ''}
                    onChange={(e) => setConfiguracion({ ...configuracion, presentacion: parseInt(e.target.value) })}
                  >
                    {producto.presentaciones_cinta?.map(presentacion => (
                      <option key={presentacion.id} value={presentacion.id}>{presentacion.nombre}</option>
                    ))}
                  </select>
                  {configuracion.presentacion && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getPresentacionById(configuracion.presentacion).descripcion}
                    </p>
                  )}
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, SVG (300dpi mínimo)</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto a incluir</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Nombre del producto/marca"
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
                        id="codigoBarras"
                        checked={configuracion.diseño.codigoBarras}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            codigoBarras: e.target.checked,
                            numeroCodigo: e.target.checked ? configuracion.diseño.numeroCodigo || '' : ''
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="codigoBarras" className="ml-2 text-sm text-gray-700">
                        Incluir código de barras (+S/0.20 por metro)
                      </label>
                    </div>

                    {configuracion.diseño.codigoBarras && (
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Número de código</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="123456789"
                          value={configuracion.diseño.numeroCodigo}
                          onChange={(e) => setConfiguracion({
                            ...configuracion,
                            diseño: {
                              ...configuracion.diseño,
                              numeroCodigo: e.target.value
                            }
                          })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Formatos: EAN-13, UPC-A, Code 128</p>
                      </div>
                    )}
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
                <p>• Cintas personalizadas de alta calidad</p>
                <p>• Múltiples materiales y colores disponibles</p>
                <p>• Ideal para decoración, empaque y regalos</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Cantidad mínima: {producto.cantidad_minima} metros</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado ahora es GRATIS!</p>
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
                          <div className="absolute inset-0 bg-opacity-20 rounded flex items-center justify-center">
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
                  <span className="text-gray-700">Cantidad:</span>
                  <div className="flex items-center">
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-l disabled:opacity-50"
                      onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                      disabled={calcularMetros() <= producto.cantidad_minima}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-white border-t border-b">{cantidad} {getPresentacionById(configuracion.presentacion).nombre === 'Por metro' ? 'metros' : 'rollos'}</span>
                    <button
                      className="px-3 py-1 bg-gray-200 rounded-r"
                      onClick={() => setCantidad(cantidad + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Total metros: {calcularMetros()}m
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Cinta {getMaterialById(configuracion.material).nombre || ''}:</span>
                    <span>S/{producto.precio_base.toFixed(2)} por metro</span>
                  </div>

                  {getMaterialById(configuracion.material).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>+S/{getMaterialById(configuracion.material).precio_extra.toFixed(2)} por metro</span>
                    </div>
                  )}

                  {getAnchoById(configuracion.ancho).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por ancho:</span>
                      <span>+S/{getAnchoById(configuracion.ancho).precio_extra.toFixed(2)} por metro</span>
                    </div>
                  )}

                  {getColorById(configuracion.color).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por color:</span>
                      <span>+S/{getColorById(configuracion.color).precio_extra.toFixed(2)} por metro</span>
                    </div>
                  )}

                  {getTipoBordeById(configuracion.tipoBorde).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por borde:</span>
                      <span>+S/{getTipoBordeById(configuracion.tipoBorde).precio_extra.toFixed(2)} por metro</span>
                    </div>
                  )}

                  {configuracion.diseño.codigoBarras && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Código de barras:</span>
                      <span>+S/0.20 por metro</span>
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
                disabled={!configuracion.material || !configuracion.color || !configuracion.ancho || !configuracion.tipoBorde || !configuracion.presentacion}
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

export default CintasPersonalizadas;