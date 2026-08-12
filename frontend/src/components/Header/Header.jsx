import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  User,
} from "lucide-react";

import "./Header.css";

function buscarUsuarioSalvo() {
  try {
    const usuarioSalvo =
      localStorage.getItem(
        "radarnow_usuario"
      );

    return usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null;
  } catch {
    return null;
  }
}

function obterInicial(usuario) {
  const texto =
    usuario?.nome ||
    usuario?.usuario ||
    "";

  const textoLimpo =
    String(texto)
      .replace(/^@/, "")
      .trim();

  return textoLimpo
    ? textoLimpo
        .charAt(0)
        .toUpperCase()
    : "";
}

function Header() {
  const usuario =
    buscarUsuarioSalvo();

  const [
    erroNaFoto,
    setErroNaFoto,
  ] = useState(false);

  const fotoPerfil =
    usuario?.foto_perfil;

  const inicial =
    obterInicial(usuario);

  useEffect(() => {
    setErroNaFoto(false);
  }, [fotoPerfil]);

  const mostrarFoto =
    Boolean(fotoPerfil) &&
    !erroNaFoto;

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
        {mostrarFoto ? (
          <img
            src={fotoPerfil}
            alt=""
            className="app-mini-avatar"
            onError={() =>
              setErroNaFoto(true)
            }
          />
        ) : usuario &&
          inicial ? (
          <span
            className="app-avatar-initial"
            aria-hidden="true"
          >
            {inicial}
          </span>
        ) : (
          <User
            size={22}
            aria-hidden="true"
          />
        )}
      </Link>
    </header>
  );
}

export default Header;