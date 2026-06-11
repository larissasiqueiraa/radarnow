import { Link } from "react-router-dom";
import { User } from "lucide-react";
import "./Header.css";

function Header() {
  const usuarioSalvo = localStorage.getItem("radarnow_usuario");
  const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null;

  return (
    <header className="app-header">
      <Link to="/" className="app-logo">
        RADAR NOW
      </Link>

      <Link to="/perfil" className="app-profile-btn">
        {usuario?.foto_perfil ? (
          <img
            src={usuario.foto_perfil}
            alt="Foto de perfil"
            className="app-mini-avatar"
          />
        ) : (
          <User size={22} />
        )}
      </Link>
    </header>
  );
}

export default Header;