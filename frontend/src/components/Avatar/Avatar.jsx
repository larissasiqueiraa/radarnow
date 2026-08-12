import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  User,
} from "lucide-react";

import "./Avatar.css";

const CORES_AVATAR = [
  ["#9b7cff", "#7057d9"],
  ["#5ee7df", "#278f9d"],
  ["#ff7b9f", "#c84f78"],
  ["#ffb866", "#d87936"],
  ["#7bc8ff", "#4478d1"],
  ["#8ee28e", "#3e9c68"],
  ["#d78cff", "#9053c7"],
  ["#ff8c7b", "#c95353"],
];

function criarNumeroDoTexto(
  texto = ""
) {
  return String(texto)
    .split("")
    .reduce(
      (total, caractere) =>
        (
          total * 31 +
          caractere.charCodeAt(0)
        ) >>> 0,
      0
    );
}

function obterInicial(
  nome,
  usuario
) {
  const texto =
    nome ||
    usuario ||
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

function Avatar({
  foto = "",
  nome = "",
  usuario = "",
  tamanho = 50,
  className = "",
  mostrarIconeSemUsuario = true,
}) {
  const [
    erroNaFoto,
    setErroNaFoto,
  ] = useState(false);

  useEffect(() => {
    setErroNaFoto(false);
  }, [foto]);

  const inicial =
    obterInicial(
      nome,
      usuario
    );

  const cores = useMemo(() => {
    const identificador =
      usuario ||
      nome ||
      "radarnow";

    const indice =
      criarNumeroDoTexto(
        identificador
      ) %
      CORES_AVATAR.length;

    return CORES_AVATAR[
      indice
    ];
  }, [usuario, nome]);

  const mostrarFoto =
    Boolean(foto) &&
    !erroNaFoto;

  const estilo = {
    "--avatar-size":
      `${tamanho}px`,

    "--avatar-cor-inicial":
      cores[0],

    "--avatar-cor-final":
      cores[1],
  };

  return (
    <span
      className={
        `rn-avatar ${className}`.trim()
      }
      style={estilo}
      aria-label={
        nome
          ? `Avatar de ${nome}`
          : "Avatar do usuário"
      }
    >
      {mostrarFoto ? (
        <img
          src={foto}
          alt=""
          className="rn-avatar-image"
          onError={() =>
            setErroNaFoto(true)
          }
        />
      ) : inicial ? (
        <span
          className="rn-avatar-initial"
          aria-hidden="true"
        >
          {inicial}
        </span>
      ) : mostrarIconeSemUsuario ? (
        <User
          className="rn-avatar-icon"
          size={Math.max(
            18,
            tamanho * 0.42
          )}
          aria-hidden="true"
        />
      ) : null}
    </span>
  );
}

export default Avatar;