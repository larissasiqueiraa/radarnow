import { useEffect, useState } from "react";
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

function Midias() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [midias, setMidias] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [carregando, setCarregando] = useState(true);
  const [midiaAberta, setMidiaAberta] = useState(null);

  useEffect(() => {
    carregarMidias();
  }, [id]);

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

  const midiasFiltradas = midias.filter((midia) => {
    if (filtro === "todas") {
      return true;
    }

    return midia.tipo === filtro;
  });

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
            {midiasFiltradas.map((midia) => (
              <button
                type="button"
                className="midia-card"
                key={midia.id}
                onClick={() => setMidiaAberta(midia)}
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
                        src={midia.url}
                        muted
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
          onClick={() => setMidiaAberta(null)}
        >
          <button
            type="button"
            className="midia-modal-close"
            onClick={() => setMidiaAberta(null)}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>

          <div
            className="midia-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            {midiaAberta.tipo === "video" ? (
              <video
                src={midiaAberta.url}
                controls
                autoPlay
                playsInline
              />
            ) : (
              <img
                src={midiaAberta.url}
                alt="Mídia ampliada"
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