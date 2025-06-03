import React, { useEffect, useState } from "react";

function AdminPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("http://localhost:8000/api/admin", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.status === 403) {
          setError("No tienes permisos para acceder a esta sección.");
        } else if (res.status === 401) {
          // Token expirado o inválido
          localStorage.clear();
          window.location.href = "/login?expired=1";
        } else if (res.ok) {
          const json = await res.json();
          setData(json);
        } else {
          setError("Error al cargar el panel.");
        }
      } catch (e) {
        setError("Error de red.");
      }
    }
    fetchAdmin();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">¡Bienvenido a tu panel de administración!</h2>
        <p className="text-gray-600">
          {data ? data.message : "Cargando..."}
        </p>
        {data && data.users_count !== undefined && (
          <p className="mt-4 font-semibold">Usuarios registrados: {data.users_count}</p>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;