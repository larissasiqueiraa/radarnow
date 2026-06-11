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

function Perfil() {
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPerfil();
  }, []);

  async function carregarPerfil() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    try {
      const resposta = await fetch(
        `http://localhost:5001/api/usuarios/${usuario.id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao carregar perfil.");
        return;
      }

      setPerfil(dados);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      alert("Não foi possível conectar ao servidor.");
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
            {perfil.foto_perfil ? (
              <img src={perfil.foto_perfil} alt={`Foto de ${perfil.nome}`} />
            ) : (
              <User size={42} />
            )}
          </div>

          <h1>{perfil.nome}</h1>
          <p>@{perfil.usuario}</p>

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