import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const BackdropsPersonalizados = () => {
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
    ancho: "",
    alto: ""
  });
  const [errores, setErrores] = useState({
    medidas: ""
  });

  const [configuracion, setConfiguracion] = useState({
    material: null,
    tamaño: null,
    sistemaMontaje: null,
    diseño: {
      logo: null,
      textoPrincipal: "",
      patron: null,
      iluminacion: false
    }
  });

  const buildImageUrl = (path) => {
    if (!path) return '';
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
    return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/6');
        if (!response.ok) throw new Error('Error al cargar el producto');

        const data = await response.json();

        const productoData = {
          ...data,
          precio_base: parseFloat(data.precio_base) || 0,
          cantidad_minima: parseInt(data.cantidad_minima) || 1,
          imagen_principal: buildImageUrl(data.imagen_principal),
          imagenes_muestra: data.imagenes_muestra?.map(img => ({
            ...img,
            url: buildImageUrl(img.url)
          })) || [],
          medidas_minimas: data.medidas_minimas || { ancho: 1, alto: 1 },
          medidas_maximas: data.medidas_maximas || { ancho: 8, alto: 4 }
        };

        setProducto(productoData);
        setCantidad(productoData.cantidad_minima);
        setImagenPrincipal(productoData.imagen_principal || '');

        setConfiguracion({
          material: data.materiales?.[0]?.id || null,
          tamaño: data.tamanos?.[0]?.id || null,
          sistemaMontaje: data.sistemas_montaje?.[0]?.id || null,
          diseño: {
            logo: null,
            textoPrincipal: "",
            patron: data.patrones_backdrop?.[0]?.id || null,
            iluminacion: false
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

  useEffect(() => {
    const nuevosErrores = { medidas: "" };
    
    if (configuracion.tamaño && producto?.tamanos?.find(t => t.id === configuracion.tamaño)?.nombre === "Personalizado") {
      const ancho = parseFloat(medidasPersonalizadas.ancho);
      const alto = parseFloat(medidasPersonalizadas.alto);
      
      if (!ancho || !alto) {
        nuevosErrores.medidas = "Ingrese ambas medidas";
      } else if (ancho < producto.medidas_minimas.ancho || alto < producto.medidas_minimas.alto) {
        nuevosErrores.medidas = `Mínimo ${producto.medidas_minimas.ancho}x${producto.medidas_minimas.alto}m`;
      } else if (ancho > producto.medidas_maximas.ancho || alto > producto.medidas_maximas.alto) {
        nuevosErrores.medidas = `Máximo ${producto.medidas_maximas.ancho}x${producto.medidas_maximas.alto}m`;
      }
    }
    
    setErrores(nuevosErrores);
  }, [medidasPersonalizadas, configuracion.tamaño, producto]);

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

  const getSistemaMontajeById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const sistema = producto.sistemas_montaje?.find(s => s.id === id) || {};
    return {
      ...sistema,
      precio_extra: parseFloat(sistema.precio_extra) || 0
    };
  };

  const getPatronById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const patron = producto.patrones_backdrop?.find(p => p.id === id) || {};
    return {
      ...patron,
      precio_extra: parseFloat(patron.precio_extra) || 0
    };
  };

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
    
    let precio = producto.precio_base;
    
    const material = getMaterialById(configuracion.material);
    precio += material.precio_extra;
    
    const tamano = getTamanoById(configuracion.tamaño);
    precio += tamano.precio_extra;
    
    const sistemaMontaje = getSistemaMontajeById(configuracion.sistemaMontaje);
    precio += sistemaMontaje.precio_extra;
    
    const patron = getPatronById(configuracion.diseño.patron);
    precio += patron.precio_extra;
    
    if (configuracion.diseño.iluminacion) {
      precio += 200.00;
    }
    
    return precio;
  };

  const calcularPrecioTotal = () => {
    return (calcularPrecioUnitario() * cantidad).toFixed(2);
  };

  const puedeAgregarAlCarrito = () => {
    return configuracion.material && 
           configuracion.tamaño && 
           configuracion.sistemaMontaje && 
           configuracion.diseño.patron &&
           !errores.medidas;
  };

  const handleAddToCart = () => {
    if (!producto || !puedeAgregarAlCarrito()) return;

    const material = getMaterialById(configuracion.material);
    const tamano = getTamanoById(configuracion.tamaño);
    const sistemaMontaje = getSistemaMontajeById(configuracion.sistemaMontaje);
    const patron = getPatronById(configuracion.diseño.patron);
    const precioUnitario = calcularPrecioUnitario();

    // Verificar si es tamaño personalizado
    const esPersonalizado = producto.tamanos?.find(t => t.id === configuracion.tamaño)?.nombre === "Personalizado";

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: cantidad,
      minimo: producto.cantidad_minima,
      precioUnitario: precioUnitario,
      precioTotal: parseFloat(calcularPrecioTotal()),
      personalizacion: {
        material: material,
        tamaño: {
          ...tamano,
          // Incluir medidas personalizadas si corresponde
          ...(esPersonalizado && { 
            medidasPersonalizadas: {
              ancho: medidasPersonalizadas.ancho,
              alto: medidasPersonalizadas.alto
            }
          })
        },
        sistemaMontaje: sistemaMontaje,
        diseño: {
          texto: configuracion.diseño.textoPrincipal,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          patron: patron,
          iluminacion: configuracion.diseño.iluminacion ? "Sí" : "No"
        }
      },
      extras: [
        ...(material.precio_extra > 0 ? [{
          concepto: `Material ${material.nombre}`,
          precio: material.precio_extra
        }] : []),
        ...(tamano.precio_extra > 0 ? [{
          concepto: `Tamaño ${tamano.nombre}`,
          precio: tamano.precio_extra
        }] : []),
        ...(sistemaMontaje.precio_extra > 0 ? [{
          concepto: `Montaje ${sistemaMontaje.nombre}`,
          precio: sistemaMontaje.precio_extra
        }] : []),
        ...(patron.precio_extra > 0 ? [{
          concepto: `Patrón ${patron.nombre}`,
          precio: patron.precio_extra
        }] : []),
        ...(configuracion.diseño.iluminacion ? [{
          concepto: 'Diseño para iluminación trasera',
          precio: 200.00
        }] : [])
      ]
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
                  alt="Backdrop personalizado"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tu backdrop</h2>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tamaño || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, tamaño: parseInt(e.target.value) })}
                    >
                      {producto.tamanos?.map(tam => (
                        <option key={tam.id} value={tam.id}>{tam.nombre}</option>
                      ))}
                    </select>
                    {configuracion.tamaño && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTamanoById(configuracion.tamaño).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                {configuracion.tamaño && producto.tamanos?.find(t => t.id === configuracion.tamaño)?.nombre === "Personalizado" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ancho (metros)</label>
                        <input
                          type="number"
                          step="0.1"
                          min={producto.medidas_minimas.ancho}
                          max={producto.medidas_maximas.ancho}
                          className="w-full p-2 border rounded"
                          placeholder={`Mín. ${producto.medidas_minimas.ancho}m`}
                          value={medidasPersonalizadas.ancho}
                          onChange={(e) => setMedidasPersonalizadas({
                            ...medidasPersonalizadas,
                            ancho: e.target.value
                          })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Alto (metros)</label>
                        <input
                          type="number"
                          step="0.1"
                          min={producto.medidas_minimas.alto}
                          max={producto.medidas_maximas.alto}
                          className="w-full p-2 border rounded"
                          placeholder={`Mín. ${producto.medidas_minimas.alto}m`}
                          value={medidasPersonalizadas.alto}
                          onChange={(e) => setMedidasPersonalizadas({
                            ...medidasPersonalizadas,
                            alto: e.target.value
                          })}
                        />
                      </div>
                    </div>
                    {errores.medidas && (
                      <p className="text-red-500 text-sm">{errores.medidas}</p>
                    )}
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sistema de montaje</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={configuracion.sistemaMontaje || ''}
                    onChange={(e) => setConfiguracion({ ...configuracion, sistemaMontaje: parseInt(e.target.value) })}
                  >
                    {producto.sistemas_montaje?.map(sistema => (
                      <option key={sistema.id} value={sistema.id}>{sistema.nombre}</option>
                    ))}
                  </select>
                  {configuracion.sistemaMontaje && (
                    <p className="text-xs text-gray-500 mt-1">
                      {getSistemaMontajeById(configuracion.sistemaMontaje).descripcion}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir diseño (300dpi mínimo)</label>
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
                          <span className="text-sm text-green-600">✓ Diseño cargado</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="w-full py-2 px-4 border border-dashed border-gray-300 rounded hover:bg-gray-50 transition text-sm"
                        >
                          + Seleccionar archivo
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Resolución mínima: 150dpi para tamaño completo</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto principal</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Nombre del evento o marca"
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
                      <label className="block text-sm text-gray-700 mb-1">Patrón de fondo</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={configuracion.diseño.patron || ''}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            patron: parseInt(e.target.value)
                          }
                        })}
                      >
                        {producto.patrones_backdrop?.map(patron => (
                          <option key={patron.id} value={patron.id}>{patron.nombre}</option>
                        ))}
                      </select>
                      {configuracion.diseño.patron && (
                        <p className="text-xs text-gray-500 mt-1">
                          {getPatronById(configuracion.diseño.patron).descripcion}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="iluminacion"
                        checked={configuracion.diseño.iluminacion}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            iluminacion: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="iluminacion" className="ml-2 text-sm text-gray-700">
                        Incluir diseño para iluminación trasera (+S/200.00)
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
                <p>• Fondos profesionales para fotografía y eventos</p>
                <p>• Materiales premium resistentes</p>
                <p>• Ideal para bodas, eventos corporativos y sesiones fotográficas</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Cantidad mínima: {producto.cantidad_minima} unidad</p>
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
                          onError={(e) => {
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
                    <span>Backdrop base:</span>
                    <span>S/{producto.precio_base.toFixed(2)}</span>
                  </div>

                  {configuracion.material && getMaterialById(configuracion.material).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Material {getMaterialById(configuracion.material).nombre}:</span>
                      <span>+S/{getMaterialById(configuracion.material).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.tamaño && getTamanoById(configuracion.tamaño).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Tamaño {getTamanoById(configuracion.tamaño).nombre}:</span>
                      <span>+S/{getTamanoById(configuracion.tamaño).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.sistemaMontaje && getSistemaMontajeById(configuracion.sistemaMontaje).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Montaje {getSistemaMontajeById(configuracion.sistemaMontaje).nombre}:</span>
                      <span>+S/{getSistemaMontajeById(configuracion.sistemaMontaje).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.diseño.patron && getPatronById(configuracion.diseño.patron).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Patrón {getPatronById(configuracion.diseño.patron).nombre}:</span>
                      <span>+S/{getPatronById(configuracion.diseño.patron).precio_extra.toFixed(2)}</span>
                    </div>
                  )}

                  {configuracion.diseño.iluminacion && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Diseño para iluminación:</span>
                      <span>+S/200.00</span>
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
                className={`w-full py-3 rounded-lg font-bold hover:shadow-lg transition-all ${
                  puedeAgregarAlCarrito() 
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                disabled={!puedeAgregarAlCarrito()}
              >
                {puedeAgregarAlCarrito() ? "Agregar al Carrito" : "Complete los datos requeridos"}
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

export default BackdropsPersonalizados;