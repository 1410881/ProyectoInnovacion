import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Personal() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/api/pedidos", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setPedidos(data);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_name");
    localStorage.removeItem("cart");
    navigate("/login");
    window.location.reload();
  };

  const handleCancelar = (pedidoId) => {
    // Aquí puedes implementar la lógica de cancelación en el futuro
    alert(`¿Seguro que deseas cancelar el pedido #${pedidoId}? (Funcionalidad pendiente)`);
  };

  const handleCambios = (pedidoId) => {
    // Funcionalidad pendiente
    alert(`Funcionalidad para realizar cambios en el pedido #${pedidoId} próximamente`);
  };

  const handleVerDetalles = (pedidoId) => {
    // Aquí puedes navegar a una página de detalles o mostrar un modal
    alert(`Ver detalles del pedido #${pedidoId} (Funcionalidad pendiente)`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido a tu panel personal!</h2>
        <p className="text-gray-600 mb-6">Aquí podrás ver tu información y acceder a tus funcionalidades personales.</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
        >
          Cerrar sesión
        </button>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Mis pedidos</h3>
          {loading ? (
            <div>Cargando...</div>
          ) : pedidos.length === 0 ? (
            <div>No tienes pedidos aún.</div>
          ) : (
            <ul className="space-y-4">
              {pedidos.map(pedido => (
                <li key={pedido.id} className="border p-4 rounded-lg flex items-center justify-between shadow-sm bg-gray-50">
                  {/* Izquierda: Fecha */}
                  <div className="text-left w-1/3">
                    <div className="text-xs text-gray-500 mb-1">
                      {new Date(pedido.created_at).toLocaleDateString("es-PE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                    <div className="font-bold">
                      Pedido #{pedido.id}
                    </div>
                    <div className="text-sm text-gray-700">
                      Total: S/{pedido.total} <br />
                      Estado: <span className="font-semibold">{pedido.estado}</span>
                    </div>
                  </div>
                  {/* Derecha: Botones */}
                  <div className="flex flex-col gap-2 w-2/3 items-end">
                    <button
                      onClick={() => handleCancelar(pedido.id)}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                      Cancelar pedido
                    </button>
                    <button
                      onClick={() => handleCambios(pedido.id)}
                      className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition text-sm"
                    >
                      Realizar cambios
                    </button>
                    <button
                      onClick={() => handleVerDetalles(pedido.id)}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                      Ver más detalles
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Personal;