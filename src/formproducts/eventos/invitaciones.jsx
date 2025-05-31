import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../js/CartContext';

const InvitacionesPersonalizadas = () => {
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
    tipo: null,
    tamaño: null,
    acabado: null,
    color: null,
    diseño: {
      logo: null,
      textoPrincipal: '',
      textoSecundario: '',
      sobrePersonalizado: false
    }
  });

  // Funciones para obtener datos por ID
  const getMaterialById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const material = producto.materiales?.find(m => m.id === id) || {};
    return {
      ...material,
      precio_extra: parseFloat(material.precio_extra) || 0
    };
  };

  const getTipoById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const tipo = producto.tipos_invitacion?.find(t => t.id === id) || {};
    return {
      ...tipo,
      precio_extra: parseFloat(tipo.precio_extra) || 0
    };
  };

  const getAcabadoById = (id) => {
    if (!producto || !id) return { nombre: '', descripcion: '', precio_extra: 0 };
    const acabado = producto.acabados_invitacion?.find(a => a.id === id) || {};
    return {
      ...acabado,
      precio_extra: parseFloat(acabado.precio_extra) || 0
    };
  };

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/productos-personalizados/8'); // ID para invitaciones
        if (!response.ok) throw new Error('Error al cargar el producto');

        const data = await response.json();

        // Función para construir URLs completas
        const buildImageUrl = (path) => {
          if (!path) return '';
          if (/^https?:\/\//.test(path)) return path;
          if (path.startsWith('/storage')) return `http://127.0.0.1:8000${path}`;
          return `http://127.0.0.1:8000/storage/${path.replace(/^\/?storage\/?/, '')}`;
        };

        // Procesar imágenes
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

        // Actualizar estados
        setProducto(productoData);
        setCantidad(parseInt(data.cantidad_minima) || 50);
        setImagenPrincipal(buildImageUrl(data.imagen_principal) || '');

        setConfiguracion({
          material: data.materiales?.[0]?.id || null,
          tipo: data.tipos_invitacion?.[0]?.id || null,
          tamaño: data.tamanos?.[0]?.id || null,
          acabado: data.acabados_invitacion?.[0]?.id || null,
          color: data.colores?.[0]?.id || null,
          diseño: {
            logo: null,
            textoPrincipal: '',
            textoSecundario: '',
            sobrePersonalizado: false
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
    const tipo = getTipoById(configuracion.tipo);
    const acabado = getAcabadoById(configuracion.acabado);

    return precioBase + material.precio_extra + tipo.precio_extra + acabado.precio_extra;
  };

  const calcularDescuento = () => {
    if (!producto) return { porcentaje: 0, valor: 0 };
    if (cantidad >= 200) return { porcentaje: 15, valor: cantidad * calcularPrecioUnitario() * 0.15 };
    if (cantidad >= 100) return { porcentaje: 10, valor: cantidad * calcularPrecioUnitario() * 0.10 };
    return { porcentaje: 0, valor: 0 };
  };

  const calcularPrecioTotal = () => {
    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    let total = precioUnitario * cantidad - descuento.valor;

    // Costo adicional por sobre personalizado
    if (configuracion.diseño.sobrePersonalizado) {
      total += cantidad * 0.70;
    }

    return parseFloat(
      (calcularPrecioUnitario() * cantidad - calcularDescuento().valor).toFixed(2)
    );
  };

  const handleAddToCart = () => {
    if (!producto) return;

    const precioUnitario = calcularPrecioUnitario();
    const descuento = calcularDescuento();
    const material = getMaterialById(configuracion.material);
    const tipo = getTipoById(configuracion.tipo);
    const acabado = getAcabadoById(configuracion.acabado);
    const tamaño = producto.tamanos?.find(t => t.id === configuracion.tamaño) || { nombre: '' };
    const color = producto.colores?.find(c => c.id === configuracion.color) || { nombre: '' };

    const cartItem = {
      id: `${producto.id}-${Date.now()}`,
      nombre: producto.nombre,
      imagen: producto.imagen_principal,
      cantidad: cantidad,
      minimo: parseInt(producto.cantidad_minima) || 50,
      precioUnitario: precioUnitario,
      precioTotal: parseFloat(calcularPrecioTotal()),
      personalizacion: {
        material: material,
        tipo: tipo,
        tamaño: tamaño,
        acabado: acabado,
        color: color,
        diseño: {
          textoPrincipal: configuracion.diseño.textoPrincipal,
          textoSecundario: configuracion.diseño.textoSecundario,
          logo: configuracion.diseño.logo ? "Logo personalizado" : null,
          sobrePersonalizado: configuracion.diseño.sobrePersonalizado
        }
      },
      extras: [
        ...(material.precio_extra > 0 ? [{
          concepto: `Material ${material.nombre}`,
          precio: material.precio_extra
        }] : []),
        ...(tipo.precio_extra > 0 ? [{
          concepto: `Tipo ${tipo.nombre}`,
          precio: tipo.precio_extra
        }] : []),
        ...(acabado.precio_extra > 0 ? [{
          concepto: `Acabado ${acabado.nombre}`,
          precio: acabado.precio_extra
        }] : []),
        ...(configuracion.diseño.sobrePersonalizado ? [{
          concepto: 'Sobre personalizado',
          precio: 0.70
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
                  alt="Invitación personalizada"
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personaliza tus invitaciones</h2>

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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.tipo || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, tipo: parseInt(e.target.value) })}
                    >
                      {producto.tipos_invitacion?.map(tipo => (
                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                      ))}
                    </select>
                    {configuracion.tipo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getTipoById(configuracion.tipo).descripcion}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Acabado</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={configuracion.acabado || ''}
                      onChange={(e) => setConfiguracion({ ...configuracion, acabado: parseInt(e.target.value) })}
                    >
                      {producto.acabados_invitacion?.map(acabado => (
                        <option key={acabado.id} value={acabado.id}>{acabado.nombre}</option>
                      ))}
                    </select>
                    {configuracion.acabado && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getAcabadoById(configuracion.acabado).descripcion}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color base</label>
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

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Diseño personalizado</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Subir logo/imagen</label>
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
                      <label className="block text-sm text-gray-700 mb-1">Texto principal</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: 'Nos casamos' o 'Invitación especial'"
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
                      <label className="block text-sm text-gray-700 mb-1">Texto secundario</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        placeholder="Ej: Fecha, hora y lugar"
                        value={configuracion.diseño.textoSecundario}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            textoSecundario: e.target.value
                          }
                        })}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sobrePersonalizado"
                        checked={configuracion.diseño.sobrePersonalizado}
                        onChange={(e) => setConfiguracion({
                          ...configuracion,
                          diseño: {
                            ...configuracion.diseño,
                            sobrePersonalizado: e.target.checked
                          }
                        })}
                        className="h-4 w-4 text-blue-600 rounded"
                      />
                      <label htmlFor="sobrePersonalizado" className="ml-2 text-sm text-gray-700">
                        Sobre personalizado (+S/0.70 c/u)
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
                <p>• Invitaciones elegantes para cualquier evento</p>
                <p>• Múltiples estilos y acabados premium</p>
                <p>• Ideal para bodas, cumpleaños y eventos corporativos</p>
                <p>• Tiempo de producción: {producto.tiempo_produccion}</p>
                <p>• Cantidad mínima: {producto.cantidad_minima} unidades</p>
                <p className="text-green-600 font-medium">• ¡Diseño personalizado incluido!</p>
              </div>

              {producto.imagenes_muestra?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ver diseños de ejemplo:</h3>
                  <div className="flex space-x-3 overflow-x-auto py-2 px-4">
                    {producto.imagenes_muestra.map((imagen) => (
                      <div
                        key={imagen.id}
                        className="flex-shrink-0 relative cursor-pointer"
                        onClick={() => cambiarImagenPrincipal(imagen.url)}
                      >
                        <img
                          src={imagen.url}
                          alt={imagen.alt_text || "Muestra de invitación"}
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
                    <span>Invitación {getMaterialById(configuracion.material).nombre || ''}:</span>
                    <span>S/{parseFloat(producto.precio_base).toFixed(2)} c/u</span>
                  </div>

                  {getMaterialById(configuracion.material).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por material:</span>
                      <span>+S/{getMaterialById(configuracion.material).precio_extra.toFixed(2)} c/u</span>
                    </div>
                  )}

                  {getTipoById(configuracion.tipo).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por tipo:</span>
                      <span>+S/{getTipoById(configuracion.tipo).precio_extra.toFixed(2)} c/u</span>
                    </div>
                  )}

                  {getAcabadoById(configuracion.acabado).precio_extra > 0 && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Extra por acabado:</span>
                      <span>+S/{getAcabadoById(configuracion.acabado).precio_extra.toFixed(2)} c/u</span>
                    </div>
                  )}

                  {configuracion.diseño.sobrePersonalizado && (
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Sobre personalizado:</span>
                      <span>+S/0.70 c/u</span>
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
                disabled={!configuracion.material || !configuracion.tipo || !configuracion.tamaño || !configuracion.acabado || !configuracion.color}
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

export default InvitacionesPersonalizadas;