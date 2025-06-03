import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../js/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired")) {
      setError("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user.id);
        localStorage.setItem("user_name", data.user.name);
        localStorage.setItem("user_role", data.user.role);
        setUser({ name: data.user.name, role: data.user.role });
        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/personal");
        }
      } else {
        const data = await response.json();
        // Si error es objeto, muestra solo el primer mensaje
        let msg = "";
        if (typeof data.error === "object" && data.error !== null) {
          msg = Object.values(data.error).flat().join(" ");
        } else {
          msg = data.error || "Error al iniciar sesión";
        }
        setError(msg);
      }
    } catch (err) {
      setError("Error de red");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido de nuevo</h1>
                <p className="text-gray-600">Ingresa tus credenciales para continuar</p>
              </div>
              <form className="space-y-6" method="POST" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg"
                >
                  Iniciar sesión
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                    Regístrate
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;