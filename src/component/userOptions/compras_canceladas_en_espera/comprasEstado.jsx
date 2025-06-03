import UsuarioItem from '../../items/item_usuario';

const ComprasEstado = () => {

//FUNCION DE LOS BOTONES -----
  const handleVerDetalle = (nombre) => {
    console.log(`Ver Detalle de  ${nombre}`);
  };

  //BOTONES A MOSTRAR EN EL ITEM -----
  const botones = [
    { opcion: "Ver Detalle", funcion: handleVerDetalle }
  ];

  // DATOS DE EJEMPLO
  const consultasData = [
    {
      id: 1,
      nombre: "Carlos Federico",
      fechaPedido: "15/05/25",
      imagenUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      nombre: "Carlos Federico",
      fechaPedido: "14/05/25",
      imagenUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      nombre: "Carlos Federico",
      fechaPedido: "13/05/25",
      imagenUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ];

    return(

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6x6 mx-auto px-10">
          {/* Encabezado */}
          <div className="text-center mb-8 pt-32">
          </div>

          {/* Contenedor principal */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sección de Consultas Recientes */}
            <div className="flex-1">
              {consultasData.map((consulta) => (
                <UsuarioItem
                  infoUsuario={consulta}
                  opciones={botones}
                />
              ))}
              
              {/* Mensaje cuando no hay consultas */}
              {consultasData.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay consultas recientes</h3>
                  <p className="text-gray-500">Tus consultas y pedidos aparecerán aquí</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

    );

}

export default ComprasEstado