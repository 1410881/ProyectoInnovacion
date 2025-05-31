import React from 'react';

const ProductoPersonalizador = ({ propiedades, configuracion, setConfiguracion }) => {
  const handleChange = (key, value) => {
    setConfiguracion(prev => ({ ...prev, [key]: value }));
  };

  const renderControl = (key, opciones) => {
    if (Array.isArray(opciones)) {
      // Si son colores, renderizar botones de color
      if (key === 'colores') {
        return (
          <div className="flex flex-wrap gap-3">
            {opciones.map(color => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border-2 ${configuracion[key] === color ? 'border-blue-500' : 'border-gray-200'}`}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => handleChange(key, color)}
                title={color}
              />
            ))}
          </div>
        );
      }
      
      // Para otras opciones, renderizar select
      return (
        <select
          className="w-full p-2 border rounded"
          value={configuracion[key]}
          onChange={(e) => handleChange(key, e.target.value)}
        >
          {opciones.map(opcion => (
            <option key={opcion} value={opcion}>{opcion}</option>
          ))}
        </select>
      );
    }
    
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Personaliza tu producto</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(propiedades).map(([key, value]) => (
          <div key={key}>
            <h3 className="font-medium mb-3 capitalize">{key}</h3>
            {renderControl(key, value)}
          </div>
        ))}
      </div>

      <button 
        className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition"
        onClick={() => console.log('Configuración aplicada:', configuracion)}
      >
        Aplicar Cambios
      </button>
    </div>
  );
};

export default ProductoPersonalizador;