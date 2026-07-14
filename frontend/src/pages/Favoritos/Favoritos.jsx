import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, Star, MapPin } from "lucide-react";

import "./Favoritos.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Favoritos() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
  }, []);

  function limparBairro(bairro) {
    if (!bairro) {
      return "Florianópolis";
    }

    const bairroLimpo = String(bairro)
      .replace(/^\d+\s*-\s*/g, "")
      .replace(/^loja\s*\d+\s*-\s*/gi, "")
      .trim();

    return bairroLimpo || "Florianópolis";
  }

  function getFotoUrl(fotoGoogle) {
    if (!fotoGoogle) {
      return null;
    }

    return `${API_URL}/api/google-places/foto?name=${encodeURIComponent(
      fotoGoogle
    )}`;
  }

  async function carregarFavoritos() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");
    const token = localStorage.getItem("radarnow_token");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      setCarregando(true);

      const headers = token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {};

      const respostaFavoritos = await fetch(
        `${API_URL}/api/favoritos/${usuario.id}`,
        {
          headers,
        }
      );

      if (!respostaFavoritos.ok) {
        throw new Error("Erro ao buscar favoritos.");
      }

      const dadosFavoritos = await respostaFavoritos.json();

      const respostaLocais = await fetch(`${API_URL}/api/locais`);

      if (!respostaLocais.ok) {
        throw new Error("Erro ao buscar locais.");
      }

      const locais = await respostaLocais.json();

      const listaFavoritos = Array.isArray(dadosFavoritos)
        ? dadosFavoritos
        : [];

      const listaLocais = Array.isArray(locais) ? locais : [];

      const locaisFavoritos = listaFavoritos
        .map((favorito) =>
          listaLocais.find(
            (local) => Number(local.id) === Number(favorito.local_id)
          )
        )
        .filter(Boolean);

      setFavoritos(locaisFavoritos);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
      showToast("Não foi possível carregar seus favoritos.", "error");
    } finally {
      setCarregando(false);
    }
  }

  async function removerFavorito(event, localId) {
    event.preventDefault();
    event.stopPropagation();

    const usuarioSalvo = localStorage.getItem("radarnow_usuario");
    const token = localStorage.getItem("radarnow_token");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuario = JSON.parse(usuarioSalvo);

      const resposta = await fetch(
        `${API_URL}/api/favoritos/${usuario.id}/${localId}`,
        {
          method: "DELETE",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        showToast(dados.erro || "Erro ao remover favorito.", "error");
        return;
      }

      setFavoritos((listaAtual) =>
        listaAtual.filter((local) => Number(local.id) !== Number(localId))
      );

      showToast("Local removido dos favoritos.", "success");
    } catch (error) {
      console.error("Erro ao remover favorito:", error);
      showToast("Não foi possível remover este favorito.", "error");
    }
  }

  return (
    <main className="favoritos-page">
      <Header />

      <div className="favoritos-content">
        <button
          type="button"
          className="favoritos-back-btn"
          onClick={() => navigate("/")}
          aria-label="Voltar para Home"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="favoritos-header">
          <h1>Favoritos</h1>
          <p>Acesse rápido os lugares que você quer acompanhar.</p>
        </section>

        {carregando && (
          <p className="favoritos-empty">Carregando favoritos...</p>
        )}

        {!carregando && favoritos.length === 0 && (
          <section className="favoritos-empty-box">
            <Heart size={34} />
            <h2>Nenhum favorito ainda</h2>
            <p>Salve locais na Home ou na Busca para encontrar aqui depois.</p>

            <Link to="/busca">Buscar locais</Link>
          </section>
        )}

        {!carregando && favoritos.length > 0 && (
          <section className="favoritos-list">
            {favoritos.map((local) => {
              const fotoUrl = getFotoUrl(local.foto_google);
              const bairroLimpo = limparBairro(local.bairro);

              return (
                <Link
                  to={`/local/${local.id}`}
                  className="favorito-card"
                  key={local.id}
                >
                  <div className="favorito-image">
                    {fotoUrl ? (
                      <img src={fotoUrl} alt={local.nome} />
                    ) : (
                      <MapPin size={26} />
                    )}

                    <button
                      type="button"
                      className="favorito-heart"
                      onClick={(event) => removerFavorito(event, local.id)}
                      aria-label="Remover dos favoritos"
                    >
                      <Heart size={16} fill="currentColor" />
                    </button>
                  </div>

                  <div className="favorito-info">
                    <div className="favorito-top">
                      <h3>{local.nome}</h3>
                    </div>

                    <p>
                      {local.categoria || "Local"} • {bairroLimpo}
                    </p>

                    <div className="favorito-bottom">
                      <small>{local.status || "Sem atualização recente"}</small>

                      <span className="favorito-rating-bottom">
                        <Star size={13} fill="currentColor" />
                        {local.nota || "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default Favoritos;