const UsuarioItem = ({ infoUsuario, opciones }) => {
  const { id, nombre, fechaPedido, imagenUrl, estado, ...otrosCampos } = infoUsuario;

  const getColorClasses = (estado) => {
    if (estado === "Comprado") return "from-green-400 to-green-300";
    if (estado === "Cancelado") return "from-red-400 to-red-300";
    return "from-gray-400 to-gray-300";
  };

  // Filtramos los campos extra, excluyendo explícitamente 'id'
  const camposExtras = Object.entries(otrosCampos).filter(
    ([key]) => !["id"].includes(key)
  );

  return (
    <div className={`bg-gradient-to-r ${getColorClasses(estado)} rounded-3xl p-2 shadow-lg mb-6`}>
      <div className="bg-white rounded-3xl p-6 flex items-center justify-between min-h-32">
        {/* Sección izquierda */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              src={imagenUrl} 
              alt={`Avatar de ${nombre}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="bg-gray-200 rounded-full px-20 py-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{nombre}</h3>
            </div>
            <p className="text-base text-gray-600 font-medium">
              Pedido Realizado el {fechaPedido}
            </p>
            {estado && (
              <p className="text-base text-gray-600 font-medium">
                Estado: {estado}
              </p>
            )}
            {/* Mostrar campos extra (excepto id) */}
            {camposExtras.map(([key, value]) => (
              <p key={key} className="text-base text-gray-600 font-medium capitalize">
                {key}: {value}
              </p>
            ))}
          </div>
        </div>

        {/* Sección derecha - Botones */}
        <div className="flex gap-3 flex-wrap">
          {opciones.map((opcion, index) => (
            <button 
              key={index}
              onClick={() => opcion.funcion(nombre)}
              className="bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-700 hover:text-gray-800 px-5 py-3 rounded-full text-base font-medium transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {opcion.opcion}
            </button>
          ))}
        </div>
      </div>
    </div>  
  );
};

export default UsuarioItem;
