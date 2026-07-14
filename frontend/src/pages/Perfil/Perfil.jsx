import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  User,
  Star,
  Heart,
  Settings,
  ChevronRight,
} from "lucide-react";

import "./Perfil.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function corrigirUrlFoto(url) {
  if (!url) {
    return "";
  }

  const urlTexto = String(url).trim();

  if (urlTexto.startsWith("blob:") || urlTexto.startsWith("data:")) {
    return urlTexto;
  }

  if (urlTexto.startsWith("http://localhost:5001")) {
    return urlTexto.replace("http://localhost:5001", API_URL);
  }

  if (urlTexto.startsWith("https://localhost:5001")) {
    return urlTexto.replace("https://localhost:5001", API_URL);
  }

  if (urlTexto.startsWith("/")) {
    return `${API_URL}${urlTexto}`;
  }

  return urlTexto;
}

function Perfil() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erroFoto, setErroFoto] = useState(false);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");
    const token = localStorage.getItem("radarnow_token");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      const resposta = await fetch(
        `${API_URL}/api/usuarios/${usuario.id}`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const textoResposta = await resposta.text();

      let dados = {};

      try {
        dados = textoResposta ? JSON.parse(textoResposta) : {};
      } catch {
        dados = {};
      }

      if (!resposta.ok) {
        showToast(dados.erro || "Erro ao carregar perfil.", "error");
        return;
      }

      const fotoRecebida =
        dados.foto_perfil ||
        dados.foto ||
        dados.picture ||
        dados.avatar ||
        "";

      const dadosCorrigidos = {
        ...dados,
        foto_perfil: corrigirUrlFoto(fotoRecebida),
      };

      setPerfil(dadosCorrigidos);
      setErroFoto(false);

      const usuarioAtualizado = {
        ...usuario,
        ...dadosCorrigidos,
      };

      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(usuarioAtualizado)
      );
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      showToast("Não foi possível conectar ao servidor.", "error");
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <main className="perfil-page">
        <Header />

        <div className="perfil-content">
          <p className="perfil-loading">Carregando perfil...</p>
        </div>

        <Footer />
      </main>
    );
  }

  if (!perfil) {
    return (
      <main className="perfil-page">
        <Header />

        <div className="perfil-content">
          <button
            type="button"
            className="perfil-back-btn"
            onClick={() => navigate("/")}
            aria-label="Voltar para Home"
          >
            <ArrowLeft size={20} />
          </button>

          <p className="perfil-loading">Perfil não encontrado.</p>
        </div>

        <Footer />
      </main>
    );
  }

  const fotoPerfil = corrigirUrlFoto(
    perfil.foto_perfil ||
      perfil.foto ||
      perfil.picture ||
      perfil.avatar ||
      ""
  );

  const nomePerfil =
    perfil.nome ||
    perfil.name ||
    perfil.email?.split("@")[0] ||
    "Usuário";

  const nomeUsuario =
    perfil.usuario ||
    perfil.username ||
    perfil.email?.split("@")[0] ||
    "usuario";

  return (
    <main className="perfil-page">
      <Header />

      <div className="perfil-content">
        <button
          type="button"
          className="perfil-back-btn"
          onClick={() => navigate("/")}
          aria-label="Voltar para Home"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="perfil-header">
          <div className="perfil-avatar">
            {fotoPerfil && !erroFoto ? (
              <img
                src={fotoPerfil}
                alt={`Foto de ${nomePerfil}`}
                onError={() => setErroFoto(true)}
              />
            ) : (
              <User size={42} />
            )}
          </div>

          <h1>{nomePerfil}</h1>
          <p>@{nomeUsuario}</p>

          <Link to="/editar-perfil" className="editar-btn">
            Editar perfil
          </Link>
        </section>

        <section className="perfil-stats">
          <div className="stat-card">
            <Star size={18} />
            <strong>{perfil.totalAvaliacoes || 0}</strong>
            <span>Avaliações</span>
          </div>

          <div className="stat-card">
            <Heart size={18} />
            <strong>{perfil.totalFavoritos || 0}</strong>
            <span>Favoritos</span>
          </div>
        </section>

        <section className="perfil-menu">
          <Link to="/favoritos" className="menu-item">
            <div>
              <Heart size={18} />
              <span>Locais favoritos</span>
            </div>

            <ChevronRight size={18} />
          </Link>

          <Link to="/configuracoes" className="menu-item">
            <div>
              <Settings size={18} />
              <span>Configurações</span>
            </div>

            <ChevronRight size={18} />
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Perfil;