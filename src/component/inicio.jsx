import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';


function Inicio() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <img 
        src={logo} 
        alt="Logo de la empresa" 
        className="w-100 h-100 object-contain animate-fade-in" 
      />
    </div>
  );
}
export default Inicio;

