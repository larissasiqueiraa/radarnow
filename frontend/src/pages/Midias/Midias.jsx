import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Image,
  Play,
  X,
} from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Midias.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

const LIMITE_SWIPE_HORIZONTAL = 55;
const LIMITE_FECHAR_VERTICAL = 110;

function Midias() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [midias, setMidias] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);

  const [indiceAberto, setIndiceAberto] = useState(null);
  const [deslocamentoY, setDeslocamentoY] = useState(0);
  const [arrastando, setArrastando] = useState(false);

  const toqueInicial = useRef({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    carregarMidias();
  }, [id]);

  const midiasFiltradas = useMemo(() => {
    return midias.filter((midia) => {
      if (filtro === "todas") {
        return true;
      }

      return midia.tipo === filtro;
    });
  }, [midias, filtro]);

  const midiaAberta =
    indiceAberto !== null
      ? midiasFiltradas[indiceAberto]
      : null;

  useEffect(() => {
    if (indiceAberto !== null) {
      setIndiceAberto(null);
    }
  }, [filtro]);

  useEffect(() => {
    if (!midiaAberta) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [midiaAberta]);

  async function carregarMidias() {
    try {
      setCarregando(true);

      const resposta = await fetch(
        `${API_URL}/api/midias/local/${id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error(
          dados.erro || "Erro ao buscar mídias"
        );

        setMidias([]);
        return;
      }

      setMidias(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar mídias:", error);
      setMidias([]);
    } finally {
      setCarregando(false);
    }
  }

  function abrirMidia(indice) {
    setIndiceAberto(indice);
    setDeslocamentoY(0);
    setArrastando(false);
  }

  function fecharMidia() {
    setIndiceAberto(null);
    setDeslocamentoY(0);
    setArrastando(false);
  }

  function mostrarProxima() {
    if (indiceAberto === null) {
      return;
    }

    setIndiceAberto((indiceAtual) => {
      if (indiceAtual >= midiasFiltradas.length - 1) {
        return 0;
      }

      return indiceAtual + 1;
    });

    setDeslocamentoY(0);
  }

  function mostrarAnterior() {
    if (indiceAberto === null) {
      return;
    }

    setIndiceAberto((indiceAtual) => {
      if (indiceAtual <= 0) {
        return midiasFiltradas.length - 1;
      }

      return indiceAtual - 1;
    });

    setDeslocamentoY(0);
  }

  function iniciarToque(event) {
    const toque = event.touches[0];

    toqueInicial.current = {
      x: toque.clientX,
      y: toque.clientY,
    };

    setArrastando(true);
  }

  function moverToque(event) {
    if (!arrastando) {
      return;
    }

    const toque = event.touches[0];

    const diferencaX =
      toque.clientX - toqueInicial.current.x;

    const diferencaY =
      toque.clientY - toqueInicial.current.y;

    const movimentoMaisVertical =
      Math.abs(diferencaY) > Math.abs(diferencaX);

    if (!movimentoMaisVertical) {
      return;
    }

    if (diferencaY > 0) {
      setDeslocamentoY(diferencaY);
    }
  }

  function finalizarToque(event) {
    if (!arrastando) {
      return;
    }

    const toqueFinal = event.changedTouches[0];

    const diferencaX =
      toqueFinal.clientX - toqueInicial.current.x;

    const diferencaY =
      toqueFinal.clientY - toqueInicial.current.y;

    const movimentoHorizontal =
      Math.abs(diferencaX) > Math.abs(diferencaY);

    const movimentoVertical =
      Math.abs(diferencaY) > Math.abs(diferencaX);

    if (
      movimentoVertical &&
      diferencaY > LIMITE_FECHAR_VERTICAL
    ) {
      fecharMidia();
      return;
    }

    if (
      movimentoHorizontal &&
      Math.abs(diferencaX) > LIMITE_SWIPE_HORIZONTAL
    ) {
      if (diferencaX < 0) {
        mostrarProxima();
      } else {
        mostrarAnterior();
      }

      setArrastando(false);
      return;
    }

    setDeslocamentoY(0);
    setArrastando(false);
  }

  const opacidadeFundo = Math.max(
    0.12,
    0.7 - deslocamentoY / 450
  );

  return (
    <main className="midias-page">
      <Header />

      <div className="midias-content">
        <header className="midias-header">
          <button
            type="button"
            className="midias-back-btn"
            onClick={() => navigate(`/local/${id}`)}
            aria-label="Voltar"
          >
            <ArrowLeft size={21} />
          </button>

          <div>
            <span>Radar Now</span>
            <h1>Todas as mídias</h1>
          </div>
        </header>

        <div className="midias-filtros">
          <button
            type="button"
            className={filtro === "todas" ? "ativo" : ""}
            onClick={() => setFiltro("todas")}
          >
            Todas
          </button>

          <button
            type="button"
            className={filtro === "foto" ? "ativo" : ""}
            onClick={() => setFiltro("foto")}
          >
            Fotos
          </button>

          <button
            type="button"
            className={filtro === "video" ? "ativo" : ""}
            onClick={() => setFiltro("video")}
          >
            Vídeos
          </button>
        </div>

        {carregando && (
          <p className="midias-mensagem">
            Carregando mídias...
          </p>
        )}

        {!carregando && midiasFiltradas.length === 0 && (
          <div className="midias-vazio">
            <Image size={32} />

            <h2>Nenhuma mídia ainda</h2>

            <p>
              As fotos e vídeos enviados pelos usuários
              aparecerão aqui.
            </p>
          </div>
        )}

        {!carregando && midiasFiltradas.length > 0 && (
          <section className="midias-grid">
            {midiasFiltradas.map((midia, indice) => (
              <button
                type="button"
                className="midia-card"
                key={midia.id}
                onClick={() => abrirMidia(indice)}
              >
                {midia.tipo === "video" ? (
                  <>
                    {midia.thumbnail ? (
                      <img
                        src={midia.thumbnail}
                        alt="Prévia do vídeo"
                      />
                    ) : (
                      <video
                        src={`${midia.url}#t=0.1`}
                        muted
                        playsInline
                        preload="metadata"
                      />
                    )}

                    <span className="midia-play">
                      <Play
                        size={22}
                        fill="currentColor"
                      />
                    </span>
                  </>
                ) : (
                  <img
                    src={midia.url}
                    alt="Foto enviada por usuário"
                    loading="lazy"
                  />
                )}
              </button>
            ))}
          </section>
        )}
      </div>

      {midiaAberta && (
        <div
          className="midia-modal"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${opacidadeFundo})`,
          }}
          onClick={fecharMidia}
        >
          <button
            type="button"
            className="midia-modal-close"
            onClick={(event) => {
              event.stopPropagation();
              fecharMidia();
            }}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          <span className="midia-modal-indicador">
            {indiceAberto + 1}/{midiasFiltradas.length}
          </span>

          <div
            className={
              `midia-modal-content ${
                arrastando ? "arrastando" : ""
              }`
            }
            style={{
              transform: `translateY(${deslocamentoY}px)`,
            }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={iniciarToque}
            onTouchMove={moverToque}
            onTouchEnd={finalizarToque}
          >
            {midiaAberta.tipo === "video" ? (
              <video
                key={midiaAberta.id}
                src={midiaAberta.url}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                key={midiaAberta.id}
                src={midiaAberta.url}
                alt={`Mídia ${indiceAberto + 1} de ${
                  midiasFiltradas.length
                }`}
                draggable="false"
              />
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default Midias;