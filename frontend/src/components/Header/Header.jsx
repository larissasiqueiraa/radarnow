import {
  Link,
} from "react-router-dom";

import Avatar from "../Avatar/Avatar";

import "./Header.css";

function buscarUsuarioSalvo() {
  try {
    const usuarioSalvo =
      localStorage.getItem(
        "radarnow_usuario"
      );

    return usuarioSalvo
      ? JSON.parse(
          usuarioSalvo
        )
      : null;
  } catch {
    return null;
  }
}

function Header() {
  const usuario =
    buscarUsuarioSalvo();

  return (
    <header className="app-header">
      <Link
        to="/"
        className="app-logo"
      >
        RADAR NOW
      </Link>

      <Link
        to={
          usuario
            ? "/perfil"
            : "/login"
        }
        className="app-profile-btn"
        aria-label={
          usuario
            ? "Abrir perfil"
            : "Entrar na conta"
        }
      >
        <Avatar
          foto={
            usuario?.foto_perfil ||
            ""
          }
          nome={
            usuario?.nome ||
            ""
          }
          usuario={
            usuario?.usuario ||
            usuario?.email ||
            ""
          }
          tamanho={50}
        />
      </Link>
    </header>
  );
}

export default Header;