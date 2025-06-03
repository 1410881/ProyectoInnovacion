import React, { useEffect, useState } from "react";

function AdminPanel() {
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchAdmin() {
      try {
        const res = await fetch("http://localhost:8000/api/admin", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        if (res.status === 403) {
          setError("No tienes permisos para acceder a esta sección.");
        } else if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        setError("Error de red.");
      }
    }
    fetchAdmin();
  }, []);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Cargando...</div>;
  return <div>{JSON.stringify(data)}</div>;
}

export default AdminPanel;