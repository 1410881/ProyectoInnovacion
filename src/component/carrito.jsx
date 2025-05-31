import React from 'react';
import { useCart } from '../js/CartContext';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FeatureTag = ({ label, value, color }) => (
  <span className={`${color} px-3 py-1 rounded-full text-xs font-medium`}>
    {`${label}: ${value}`}
  </span>
);

const CustomizationItem = ({ iconColor, title, children }) => (
  <div className="bg-gray-50/50 border border-gray-200 rounded-lg p-3">
    <div className="flex items-center gap-2 mb-1">
      <span className={`w-2 h-2 ${iconColor} rounded-full`}></span>
      <p className="text-sm font-medium text-gray-700">{title}</p>
    </div>
    {children}
  </div>
);

const InfoItem = ({ icon: Icon, iconBg, iconColor, text }) => (
  <div className="flex items-start">
    <div className={`${iconBg} p-1 rounded-full mr-3 mt-0.5`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <p className="text-gray-600">{text}</p>
  </div>
);

const CarritoCompras = () => {
  const { cartItems, removeItem, updateQuantity, clearCart, cartCount } = useCart();

  // Configuración de etiquetas para características personalizadas
  const tagConfig = {
    material: { color: 'bg-blue-100 text-blue-800', label: 'Material' },
    tipo: { color: 'bg-purple-100 text-purple-800', label: 'Tipo' },
    color: { color: 'bg-green-100 text-green-800', label: 'Color' },
    tamaño: { color: 'bg-amber-100 text-amber-800', label: 'Tamaño' },
    medida: { color: 'bg-amber-100 text-amber-800', label: 'Medida' },
    ancho: { color: 'bg-indigo-100 text-indigo-800', label: 'Ancho' },
    acabado:{color: 'bg-indigo-100 text-indigo-800', label: 'Acabado' },
    tipoAsa: { color: 'bg-cyan-100 text-cyan-800', label: 'Asa' },
    longitud: { color: 'bg-pink-100 text-pink-800', label: 'Longitud' },
    tipoBorde: { color: 'bg-cyan-100 text-cyan-800', label: 'Borde' },
    presentacion: { color: 'bg-pink-100 text-pink-800', label: 'Presentación' },
    adhesivo: { color: 'bg-teal-100 text-teal-800', label: 'Adhesivo' },
    impresion: { color: 'bg-violet-100 text-violet-800', label: 'Impresión' },
    dosLados: { color: 'bg-violet-100 text-violet-800', label: 'Dos Lados' },
    montaje: { color: 'bg-purple-100 text-purple-800', label: 'Montaje' },
    patron: { color: 'bg-amber-100 text-amber-800', label: 'Patrón' },
    iluminacion: { color: 'bg-indigo-100 text-indigo-800', label: 'Iluminación' },
    medidasPersonalizadas: {
      color: 'bg-orange-100 text-orange-800',
      label: 'Medidas',
      format: (value) => `${value.ancho}x${value.alto}m`
    }
  };

  // Funciones de cálculo
  const calcularSubtotal = () => cartItems.reduce((total, item) => total + item.precioTotal, 0);
  const calcularIVA = () => calcularSubtotal() * 0.16;
  const calcularTotal = () => calcularSubtotal() + calcularIVA();

  // Renderizado de personalización con medidas personalizadas
  const renderPersonalizacion = (personalizacion) => {
    if (!personalizacion) return null;

    return (
      <div className="space-y-3">
        {/* Características principales */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(personalizacion).map(([key, value]) => {
            if (!value || key === 'diseño') return null;

            // Manejar medidas personalizadas dentro del tamaño
            if (key === 'tamaño' && value.medidasPersonalizadas) {
              const config = tagConfig.medidasPersonalizadas;
              return (
                <FeatureTag
                  key="medidasPersonalizadas"
                  label={config.label}
                  value={config.format(value.medidasPersonalizadas)}
                  color={config.color}
                />
              );
            }

            const config = tagConfig[key];
            if (!config) return null;

            const displayValue = typeof value === 'object' && value.nombre 
              ? value.nombre 
              : value;

            return (
              <FeatureTag
                key={key}
                label={config.label}
                value={displayValue}
                color={config.color}
              />
            );
          })}
        </div>

        {/* Diseño personalizado */}
        {personalizacion.diseño && (
          <div className="space-y-3">
            {personalizacion.diseño.texto && (
              <CustomizationItem iconColor="bg-blue-500" title="Texto personalizado">
                <div className="pl-4">
                  <p className="text-sm text-gray-600">"{personalizacion.diseño.texto}"</p>
                </div>
              </CustomizationItem>
            )}

            {personalizacion.diseño.logo && (
              <CustomizationItem iconColor="bg-blue-500" title="Logo personalizado">
                <p className="text-xs text-gray-500 pl-4 mt-1">Diseño subido correctamente</p>
              </CustomizationItem>
            )}

            {personalizacion.diseño.patron && (
              <CustomizationItem iconColor="bg-blue-500" title="Patrón de fondo">
                <div className="pl-4">
                  <p className="text-sm text-gray-600">{personalizacion.diseño.patron.nombre}</p>
                  {personalizacion.diseño.patron.descripcion && (
                    <p className="text-xs text-gray-500">{personalizacion.diseño.patron.descripcion}</p>
                  )}
                </div>
              </CustomizationItem>
            )}

            {personalizacion.diseño.iluminacion === "Sí" && (
              <CustomizationItem iconColor="bg-blue-500" title="Iluminación trasera">
                <p className="text-xs text-gray-500 pl-4 mt-1">Diseño preparado para iluminación trasera</p>
              </CustomizationItem>
            )}
          </div>
        )}
      </div>
    );
  };

  // Manejo de cantidad
  const handleQuantityChange = (item, newQuantity) => {
    const minQuantity = item.minimo || 1;
    if (newQuantity >= minQuantity) {
      updateQuantity(item.id, newQuantity);
    }
  };

  // Renderizado del carrito vacío
  const renderEmptyCart = () => (
    <div className="fixed inset-0 flex items-center justify-center -mt-16 z-10">
      <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-md w-full mx-4">
        <div className="text-gray-200 mb-6">
          <FiShoppingCart className="w-24 h-24 mx-auto" />
        </div>
        <h2 className="text-2xl font-medium text-gray-700 mb-3">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Descubre nuestros productos y encuentra algo especial para ti</p>
        <Link
          to="/productos"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center transform hover:-translate-y-0.5 cursor-pointer"
        >
          Explorar productos
        </Link>
      </div>
    </div>
  );

  // Renderizado de items del carrito
  const renderCartItem = (item) => (
    <li key={item.id} className="p-8 hover:bg-gray-50/50 transition duration-300 ease-in-out group">
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="w-full sm:w-44 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 flex items-center justify-center group-hover:border-blue-100 transition duration-300">
          <img
            src={item.imagen}
            alt={item.nombre}
            className="w-full h-44 object-contain p-3 transform group-hover:scale-105 transition duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/176?text=Imagen+no+disponible';
            }}
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">{item.nombre}</h3>
              <p className="text-blue-600 font-medium">S/{item.precioUnitario.toFixed(2)} c/u</p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="transition duration-300 flex items-center justify-center w-10 h-10 rounded-[50%] hover:bg-red-50 cursor-pointer p-0 border-0"
              aria-label="Eliminar"
              style={{ borderRadius: '20%' }}
            >
              <FiTrash2 size={18} className="text-gray-500 hover:text-red-500 transition-colors duration-300" />
            </button>
          </div>

          <div className="mt-4">
            {renderPersonalizacion(item.personalizacion)}

            {item.extras?.filter(extra => extra.precio > 0).length > 0 && (
              <div className="bg-gray-50/50 border border-gray-200 rounded-lg p-3 mt-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Extras incluidos</p>
                <div className="space-y-1">
                  {item.extras.filter(extra => extra.precio > 0).map((extra, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{extra.concepto}</span>
                      <span className="text-blue-600 font-medium">+S/{extra.precio.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden w-fit hover:border-blue-300 transition duration-300">
              <button
                onClick={() => handleQuantityChange(item, item.cantidad - 1)}
                className={`px-4 py-2 rounded-l-full flex items-center justify-center ${
                  item.cantidad <= (item.minimo || 1)
                    ? "text-gray-300 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 hover:bg-blue-50 cursor-pointer"
                }`}
                aria-label="Reducir"
                disabled={item.cantidad <= (item.minimo || 1)}
              >
                <FiMinus className="w-4 h-4" />
              </button>

              <span className="px-4 py-2 text-center w-12 border-x-2 border-gray-200 flex items-center justify-center">
                {item.cantidad}
              </span>

              <button
                onClick={() => handleQuantityChange(item, item.cantidad + 1)}
                className="px-4 py-2 text-gray-600 hover:bg-blue-50 transition rounded-r-full cursor-pointer flex items-center justify-center"
                aria-label="Aumentar"
              >
                <FiPlus className="w-4 h-4" />
              </button>
            </div>

            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">
                S/{item.precioTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="flex items-center">
            <Link to="/productos" className="mr-4 text-gray-500 hover:text-gray-700 transition duration-300 hover:scale-110">
              <FiArrowLeft size={22} />
            </Link>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <div className="relative">
                <FiShoppingCart className="mr-3 text-blue-600" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </div>
              Mi Carrito
            </h1>
          </div>
        </div>

        {cartItems.length === 0 ? (
          renderEmptyCart()
        ) : (
          <main className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <ul className="divide-y divide-gray-100">
                  {cartItems.map(renderCartItem)}
                </ul>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 sticky top-8 transition-all duration-300 hover:shadow-2xl">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-2xl">
                  <h2 className="text-xl font-bold text-white">Resumen de compra</h2>
                </div>

                <div className="p-8">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal ({cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}):</span>
                      <span className="font-medium text-gray-800">S/{calcularSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">IVA (16%):</span>
                      <span className="font-medium text-gray-800">S/{calcularIVA().toFixed(2)}</span>
                    </div>
                    <div className="border-t-2 border-dashed border-gray-200 pt-5 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total:</span>
                        <span className="text-3xl font-extrabold text-blue-600">S/{calcularTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    className="mt-8 w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-[20px] font-bold flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-1 cursor-pointer"
                    style={{ borderRadius: '20%' }}
                  >
                    Proceder al pago
                    <FiChevronRight className="ml-2" size={20} />
                  </button>

                  <div className="mt-8 space-y-4 text-sm">
                    <InfoItem
                      icon={() => (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      iconBg="bg-green-100"
                      iconColor="text-green-600"
                      text="Envío gratuito para pedidos > S/500"
                    />
                    <InfoItem
                      icon={() => (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      iconBg="bg-blue-100"
                      iconColor="text-blue-600"
                      text="Producción en 5-7 días hábiles"
                    />
                    <InfoItem
                      icon={() => (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      iconBg="bg-purple-100"
                      iconColor="text-purple-600"
                      text="Pago 100% seguro"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default CarritoCompras;