import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const BolsasPersonalizadas = () => {
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
    tamaño: null,
    tipoAsa: null,
    diseño: {
      logo: null,
      texto: '',
      dosLados: false
    }
  });

  // Funciones mejoradas para manejar números
  const getMaterialById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const material = producto.materiales?.find(m => m.id === id) || {};
    return {
      ...material,
      precio_extra: parseFloat(material.precio_extra) || 0
    };
  };

  const getTipoAsaById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const tipoAsa = producto.tipos_asas?.find(a => a.id === id) || {};
    return {
      ...tipoAsa,
      precio_extra: parseFloat(tipoAsa.precio_extra) || 0
    };
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/1');
        if (!response.ok) throw new Error('Error al cargar el producto');

        const data = await response.json();

        // Función para construir URLs completas
        const buildImageUrl = (path) => {
          if (!path) return '';
          // Si ya es una URL completa (http o https)
          if (/^https?:\/\//.test(path)) return path;
          // Si comienza con /storage (ruta de Laravel)
          if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
          // Para cualquier otro caso
          return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
        };

        // Procesar todas las imágenes
        const procesarImagenes = (imagenes) => {
          if (!imagenes || !Array.isArray(imagenes)) return [];
          return imagenes.map(img => ({
            ...img,
            url: buildImageUrl(img.url)
          }));
        };

        // Construir el objeto producto completo
        const productoData = {
          ...data,
          precio_base: parseFloat(data.precio_base) || 0,
          cantidad_minima: parseInt(data.cantidad_minima) || 50,
          imagen_principal: buildImageUrl(data.imagen_principal),
          imagenes_muestra: procesarImagenes(data.imagenes_muestra)
        };

        // Actualizar todos los estados de una vez
        setProducto(productoData);
        setCantidad(parseInt(data.cantidad_minima) || 50);
        setImagenPrincipal(buildImageUrl(data.imagen_principal) || '');

        setConfiguracion({
          material: data.materiales?.[0]?.id || null,
          color: data.colores?.[0]?.id || null,
          tamaño: data.tamanos?.[0]?.id || null,
          tipoAsa: data.tipos_asas?.[0]?.id || null,
          diseño: {
            logo: null,
            texto: '',
            dosLados: false
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
    const precioBase = parseFloat(producto.precio_base) || 0;
    const material = getMaterialById(configuracion.material);
    const tipoAsa = getTipoAsaById(configuracion.tipoAsa);
    return precioBase + material.precio_extra + tipoAsa.precio_extra;
  };

  const calcularDescuento = () => {
    if (!producto) return { porcentaje: 0, valor: 0 };
    if (cantidad >= 500) return { porcentaje: 15, valor: cantidad * calcularPrecioUnitario() * 0.15 };
    if (cantidad >= 300) return { porcentaje: 10, valor: cantidad * calcularPrecioUnitario() * 0.10 };
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
    const tipoAsa = getTipoAsaById(configuracion.tipoAsa);

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: cantidad,
      minimo: parseInt(producto.cantidad_minima) || 50,
      precioUnitario: precioUnitario,
      precioTotal: precioUnitario * cantidad - descuento.valor,
      personalizacion: {
        material: material,
        color: producto.colores?.find(c => c.id === configuracion.color) || { nombre: '' },
        tamaño: producto.tamanos?.find(t => t.id === configuracion.tamaño) || { nombre: '' },
        tipoAsa: tipoAsa,
        diseño: {
          texto: configuracion.diseño.texto,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          dosLados: configuracion.diseño.dosLados
        }
      },
      extras: [
        ...(material.precio_extra > 0 ? [{
          concepto: `Material ${material.nombre}`,
          precio: material.precio_extra
        }] : []),
        ...(tipoAsa.precio_extra > 0 ? [{
          concepto: `Asa ${tipoAsa.nombre}`,
          precio: tipoAsa.precio_extra
        }] : []),
        ...(configuracion.diseño.dosLados ? [{
          concepto: 'Impresión en ambos lados',
          precio: 0
        }] : [])
      ],
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
                  alt="Bolsa personalizada"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tu bolsa</h2>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de asa</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipoAsa || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, tipoAsa: parseInt(e.target.value) })}
                    >
                      {producto.tipos_asas?.map(asa => (
                        <option key={asa.id} value={asa.id}>{asa.nombre}</option>
                      ))}
                    </select>
                    {configuracion.tipoAsa && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTipoAsaById(configuracion.tipoAsa).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG</p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Texto personalizado</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Tu marca o mensaje"
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
                        id="dosLados"
                        checked={configuracion.diseño.dosLados}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            dosLados: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="dosLados" className="ml-2 text-sm text-gray-700">
                        Imprimir en ambos lados
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
                <p>• Bolsas personalizadas de alta calidad</p>
                <p>• Múltiples materiales y tamaños disponibles</p>
                <p>• Ideal para promociones y regalos corporativos</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Cantidad mínima: {producto.cantidad_minima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado ahora es GRATIS!</p>
              </div>

              {producto.imagenes_muestra?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ver otras muestras:</h3>
                  <div className="flex space-x-3 overflow-x-auto py-2 px-4">
                    {producto.imagenes_muestra.map((imagen) => {
                      console.log('Imagen URL:', imagen.url); // Verifica la URL en consola
                      return (
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
                      );
                    })}
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
                      onClick={() => setCantidad(Math.max(producto.cantidad_minima, cantidad - 10))}
                      disabled={cantidad <= producto.cantidad_minima}
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

                <div className="border-t pt-3">
                  <div className="flex justify-between py-1">
                    <span>Bolsa {getMaterialById(configuracion.material).nombre || ''}:</span>
                    <span>S/{parseFloat(producto.precio_base).toFixed(2)} c/u</span>
                  </div>

                  {getMaterialById(configuracion.material).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>+S/{getMaterialById(configuracion.material).precio_extra.toFixed(2)} c/u</span>
                    </div>
                  )}

                  {getTipoAsaById(configuracion.tipoAsa).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por asas:</span>
                      <span>+S/{getTipoAsaById(configuracion.tipoAsa).precio_extra.toFixed(2)} c/u</span>
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
                disabled={!configuracion.material || !configuracion.tipoAsa || !configuracion.tamaño || !configuracion.color}
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

export default BolsasPersonalizadas;