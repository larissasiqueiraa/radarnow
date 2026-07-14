import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Star,
  MapPin,
  Clock,
  ArrowLeft,
  Zap,
  Route,
  Heart,
  RefreshCcw,
} from "lucide-react";

import "./Local.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Local() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [local, setLocal] = useState(null);
  const [carregandoLocal, setCarregandoLocal] = useState(true);
  const [erroLocal, setErroLocal] = useState("");

  const [favorito, setFavorito] = useState(false);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregandoAvaliacoes, setCarregandoAvaliacoes] = useState(true);

  const usuarioSalvo = localStorage.getItem("radarnow_usuario");
  const estaLogado = !!usuarioSalvo;

  useEffect(() => {
    carregarLocal();
    carregarAvaliacoes();
    verificarFavorito();
  }, [id]);

  async function carregarLocal() {
    try {
      setCarregandoLocal(true);
      setErroLocal("");

      const resposta = await fetch(`${API_URL}/api/locais/${id}`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroLocal(dados.erro || "Local não encontrado.");
        setLocal(null);
        return;
      }

      setLocal(dados);
    } catch (error) {
      console.error("Erro ao carregar local:", error);
      setErroLocal("Não foi possível carregar este local.");
      setLocal(null);
    } finally {
      setCarregandoLocal(false);
    }
  }

  async function verificarFavorito() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      setFavorito(false);
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);

    try {
      const resposta = await fetch(
        `${API_URL}/api/favoritos/${usuario.id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error(dados.erro || "Erro ao carregar favoritos");
        return;
      }

      const estaFavoritado = dados.some(
        (item) => Number(item.local_id) === Number(id)
      );

      setFavorito(estaFavoritado);
    } catch (error) {
      console.error("Erro ao verificar favorito:", error);
    }
  }

  async function alternarFavorito() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      navigate("/cadastro");
      return;
    }

    const usuario = JSON.parse(usuarioSalvo);
    const localId = Number(id);

    try {
      if (favorito) {
        const resposta = await fetch(
          `${API_URL}/api/favoritos/${usuario.id}/${localId}`,
          {
            method: "DELETE",
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          alert(dados.erro || "Erro ao remover favorito.");
          return;
        }

        setFavorito(false);
      } else {
        const resposta = await fetch(`${API_URL}/api/favoritos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuario.id,
            local_id: localId,
          }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          alert(dados.erro || "Erro ao adicionar favorito.");
          return;
        }

        setFavorito(true);
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
      alert("Não foi possível atualizar o favorito.");
    }
  }

  async function carregarAvaliacoes() {
    try {
      setCarregandoAvaliacoes(true);

      const resposta = await fetch(
        `${API_URL}/api/avaliacoes/${id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro ao buscar avaliações:", dados);
        setAvaliacoes([]);
        return;
      }

      setAvaliacoes(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      setAvaliacoes([]);
    } finally {
      setCarregandoAvaliacoes(false);
    }
  }

  function irParaAtualizarStatus() {
    if (!estaLogado) {
      navigate("/cadastro");
      return;
    }

    navigate(`/novo-status/${id}`);
  }

  function abrirRota() {
    if (!local?.lat || !local?.lng) {
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${local.lat},${local.lng}`;
    window.open(url, "_blank");
  }

  function getStatusClass(status = "") {
    const texto = status.toLowerCase();

    if (texto.includes("tranquilo")) return "status-green";
    if (texto.includes("movimentado")) return "status-yellow";
    if (texto.includes("cheio")) return "status-orange";
    if (texto.includes("lotado")) return "status-red";

    return "status-purple";
  }

  function getCategoriaCor(categoria = "") {
    switch (categoria) {
      case "Balada":
        return "purple";

      case "Restaurante":
        return "orange";

      case "Academia":
        return "green";

      case "Café":
        return "yellow";

      case "Bar":
        return "blue";

      case "Shopping":
        return "pink";

      default:
        return "purple";
    }
  }

  function getImagemClasse(categoria = "") {
    switch (categoria) {
      case "Balada":
        return "image-stage";

      case "Restaurante":
        return "image-restaurant";

      case "Academia":
        return "image-gym";

      case "Café":
        return "image-cafe";

      case "Bar":
        return "image-bar";

      case "Shopping":
        return "image-shopping";

      default:
        return "image-stage";
    }
  }

  function getFotoUrl(fotoGoogle) {
    if (!fotoGoogle) {
      return null;
    }

    return `${API_URL}/api/google-places/foto?name=${encodeURIComponent(
      fotoGoogle
    )}`;
  }

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

  function formatarData(data) {
    if (!data) return "agora";

    const dataAvaliacao = new Date(data);

    return dataAvaliacao.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (carregandoLocal) {
    return (
      <main className="local-page">
        <Header />

        <div className="local-content">
          <p className="reviews-empty">Carregando local...</p>
        </div>

        <Footer />
      </main>
    );
  }

  if (!local) {
    return (
      <main className="local-page">
        <Header />

        <div className="local-content">
          <button
            type="button"
            className="local-back-btn"
            onClick={() => navigate("/")}
            aria-label="Voltar para Home"
          >
            <ArrowLeft size={20} />
          </button>

          <h1>Local não encontrado</h1>

          {erroLocal && <p className="reviews-empty">{erroLocal}</p>}
        </div>

        <Footer />
      </main>
    );
  }

  const ultimaAvaliacao = avaliacoes.length > 0 ? avaliacoes[0] : null;

  const statusAtual =
    ultimaAvaliacao?.status || local?.status || "Sem atualização agora";

  const comentarioAtual =
    ultimaAvaliacao?.comentario ||
    local?.descricao ||
    "Ainda não há comentários recentes sobre este local.";

  const notaAtual = ultimaAvaliacao?.nota || local?.nota || "—";

  const tempoAtual = ultimaAvaliacao?.criado_em
    ? formatarData(ultimaAvaliacao.criado_em)
    : "agora";

  const categoriaCor = getCategoriaCor(local.categoria);
  const imagemClasse = local.imagem || getImagemClasse(local.categoria);
  const fotoUrl = getFotoUrl(local.foto_google);
  const bairroLimpo = limparBairro(local.bairro);

  return (
    <main className="local-page">
      <Header />

      <div className="local-content">
        <button
          type="button"
          className="local-back-btn"
          onClick={() => navigate("/")}
          aria-label="Voltar para Home"
        >
          <ArrowLeft size={20} />
        </button>

        <section
          className={fotoUrl ? "local-hero" : `local-hero ${imagemClasse}`}
        >
          {fotoUrl && (
            <img
              className="local-hero-img"
              src={fotoUrl}
              alt={local.nome}
            />
          )}

          <div className="hero-overlay">
            <span className={`categoria ${categoriaCor}`}>
              {local.categoria || "Local"}
            </span>

            <h1>{local.nome}</h1>

            <div className="hero-rating">
              <Star size={16} fill="currentColor" />
              <span>{notaAtual}</span>
            </div>

            <div className="local-meta">
              <MapPin size={16} />
              <span>{local.endereco || bairroLimpo || "Florianópolis"}</span>
            </div>
          </div>
        </section>

        <section className="status-card">
          <div className="status-header">
            <span>
              <Zap size={15} />
              Agora
            </span>

            <small>
              <Clock size={14} />
              {tempoAtual}
            </small>
          </div>

          <div className="current-status">
            <span
              className={`status-dot ${getStatusClass(statusAtual)}`}
            ></span>

            <h2>{statusAtual}</h2>
          </div>

          <p>{comentarioAtual}</p>

          <button
            type="button"
            className="status-update-btn"
            onClick={irParaAtualizarStatus}
          >
            <RefreshCcw size={17} />
            Atualizar status
          </button>
        </section>

        <section className="quick-actions compact">
          <button type="button" onClick={abrirRota}>
            <Route size={17} />
            Rota
          </button>

          <button
            type="button"
            className={favorito ? "favorite-active" : ""}
            onClick={alternarFavorito}
          >
            <Heart size={17} fill={favorito ? "currentColor" : "none"} />
            {favorito ? "Favorito" : "Favoritar"}
          </button>
        </section>

        {estaLogado ? (
          <>
            <section className="photo-preview">
              <div className="section-title">
                <h3>Fotos recentes</h3>
                <span>Ver todas</span>
              </div>

              <div className="photo-grid">
                <div
                  className={
                    fotoUrl ? "photo-card" : `photo-card ${imagemClasse}`
                  }
                >
                  {fotoUrl && <img src={fotoUrl} alt={local.nome} />}
                </div>

                <div className="photo-card photo-alt-one"></div>
                <div className="photo-card photo-alt-two"></div>
              </div>
            </section>

            <section className="updates-feed">
              <div className="section-title">
                <h3>Avaliações recentes</h3>
                <span>{avaliacoes.length} avaliações</span>
              </div>

              {carregandoAvaliacoes && (
                <p className="reviews-empty">Carregando avaliações...</p>
              )}

              {!carregandoAvaliacoes && avaliacoes.length === 0 && (
                <p className="reviews-empty">
                  Nenhuma avaliação ainda. Seja a primeira pessoa a atualizar
                  este local.
                </p>
              )}

              {!carregandoAvaliacoes &&
                avaliacoes.map((avaliacao) => (
                  <article className="comment-card" key={avaliacao.id}>
                    <div className="avatar">
                      {avaliacao.foto_perfil ? (
                        <img
                          src={avaliacao.foto_perfil}
                          alt={avaliacao.nome || "Usuário"}
                        />
                      ) : avaliacao.nome ? (
                        avaliacao.nome.charAt(0).toUpperCase()
                      ) : (
                        "U"
                      )}
                    </div>

                    <div className="comment-content">
                      <div className="comment-header">
                        <strong>{avaliacao.nome || "Usuário"}</strong>

                        <span>
                          <Star size={13} fill="currentColor" />
                          {avaliacao.nota}
                        </span>
                      </div>

                      {avaliacao.status && (
                        <span
                          className={`review-status ${getStatusClass(
                            avaliacao.status
                          )}`}
                        >
                          {avaliacao.status}
                        </span>
                      )}

                      <p>{avaliacao.comentario}</p>

                      <small className="review-date">
                        @{avaliacao.usuario || "usuario"} •{" "}
                        {formatarData(avaliacao.criado_em)}
                      </small>
                    </div>
                  </article>
                ))}
            </section>
          </>
        ) : (
          <section className="locked-local-content">
            <div className="locked-blur">
              <section className="photo-preview">
                <div className="section-title">
                  <h3>Fotos recentes</h3>
                  <span>Ver todas</span>
                </div>

                <div className="photo-grid">
                  <div
                    className={
                      fotoUrl ? "photo-card" : `photo-card ${imagemClasse}`
                    }
                  >
                    {fotoUrl && <img src={fotoUrl} alt={local.nome} />}
                  </div>

                  <div className="photo-card photo-alt-one"></div>
                  <div className="photo-card photo-alt-two"></div>
                </div>
              </section>

              <section className="updates-feed">
                <div className="section-title">
                  <h3>Avaliações recentes</h3>
                  <span>12 avaliações</span>
                </div>

                <article className="comment-card">
                  <div className="avatar">L</div>

                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>Larissa</strong>

                      <span>
                        <Star size={13} fill="currentColor" />5
                      </span>
                    </div>

                    <span className="review-status status-red">Lotado</span>

                    <p>Fila grande agora, mas o ambiente está muito bom.</p>

                    <small className="review-date">@usuario • agora</small>
                  </div>
                </article>

                <article className="comment-card">
                  <div className="avatar">M</div>

                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>Marina</strong>

                      <span>
                        <Star size={13} fill="currentColor" />4
                      </span>
                    </div>

                    <span className="review-status status-yellow">
                      Movimentado
                    </span>

                    <p>Está enchendo aos poucos, vale chegar logo.</p>

                    <small className="review-date">
                      @usuario • há 8 min
                    </small>
                  </div>
                </article>
              </section>
            </div>

            <div className="locked-card">
              <h2>Entre para ver o radar completo</h2>

              <p>
                Crie sua conta para ver avaliações recentes, fotos, comentários
                e atualizar o status dos lugares em tempo real.
              </p>

              <button type="button" onClick={() => navigate("/cadastro")}>
                Criar conta grátis
              </button>

              <button
                type="button"
                className="locked-secondary"
                onClick={() => navigate("/login")}
              >
                Já tenho conta
              </button>

              <button
                type="button"
                className="locked-ghost"
                onClick={() => navigate("/")}
              >
                Continuar explorando
              </button>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default Local;