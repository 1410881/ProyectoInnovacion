import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../js/UserContext";

function Register() {
  const { setUser } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !passwordConfirmation) {
      setError("Completa todos los campos.");
      return;
    }
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch('http://127.0.0.1:8000/api/register', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation, // <-- así está bien
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // Si tu backend devuelve user y token:
        if (data.user && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("user_name", data.user.name);
          localStorage.setItem("user_role", data.user.role); // <-- AGREGA ESTO
          setUser({ name: data.user.name, role: data.user.role }); // <-- AGREGA role
        }
        navigate("/personal");
        // NO uses window.location.reload();
      } else {
        const data = await response.json();
        let msg = "";
        if (typeof data.error === "object" && data.error !== null) {
          msg = Object.values(data.error).flat().join(" ");
        } else {
          msg = data.error || "Error al registrar.";
        }
        setError(msg);
      }
    } catch (err) {
      setError("Error de red.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="pt-32 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-full p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear cuenta</h1>
                <p className="text-gray-600 mb-6">Completa tus datos para registrarte</p>
                <form className="space-y-4" method="POST" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="Ej: Juan Pérez"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="ejemplo@correo.com"
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
                  <div>
                    <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      id="passwordConfirmation"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                      placeholder="••••••••"
                      value={passwordConfirmation}
                      onChange={e => setPasswordConfirmation(e.target.value)}
                    />
                  </div>
                  {error && <div className="text-red-500">{error}</div>}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg"
                  >
                    Registrar cuenta
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{" "}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                      Inicia sesión
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;