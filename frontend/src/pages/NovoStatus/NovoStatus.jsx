import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Send,
  Star,
  Activity,
  ImagePlus,
  MapPin,
  X,
} from "lucide-react";

import "./NovoStatus.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function NovoStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [local, setLocal] = useState(null);
  const [carregandoLocal, setCarregandoLocal] = useState(true);
  const [erroLocal, setErroLocal] = useState("");

  const [status, setStatus] = useState("");
  const [avaliacao, setAvaliacao] = useState(0);
  const [comentario, setComentario] = useState("");

  const [midia, setMidia] = useState(null);
  const [previewMidia, setPreviewMidia] = useState("");
  const [tipoMidia, setTipoMidia] = useState("");

  const [carregando, setCarregando] = useState(false);

  const statusOptions = [
    "Tranquilo",
    "Movimentado",
    "Cheio",
    "Lotado",
    "Fila grande",
    "Música boa",
    "Vale a pena",
    "Não recomendo",
  ];

  useEffect(() => {
    carregarLocal();
  }, [id]);

  useEffect(() => {
    return () => {
      if (previewMidia) {
        URL.revokeObjectURL(previewMidia);
      }
    };
  }, [previewMidia]);

  async function carregarLocal() {
    if (!id) {
      setCarregandoLocal(false);
      return;
    }

    try {
      setCarregandoLocal(true);
      setErroLocal("");

      const resposta = await fetch(
        `${API_URL}/api/locais/${id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErroLocal(
          dados.erro || "Local não encontrado."
        );

        setLocal(null);
        return;
      }

      setLocal(dados);
    } catch (error) {
      console.error(
        "Erro ao carregar local:",
        error
      );

      setErroLocal(
        "Não foi possível carregar este local."
      );

      setLocal(null);
    } finally {
      setCarregandoLocal(false);
    }
  }

  function selecionarMidia(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      removerMidia();
      return;
    }

    const ehImagem = arquivo.type.startsWith("image/");
    const ehVideo = arquivo.type.startsWith("video/");

    if (!ehImagem && !ehVideo) {
      showToast(
        "Escolha apenas uma foto ou vídeo.",
        "error"
      );

      event.target.value = "";
      return;
    }

    const limiteImagem = 10 * 1024 * 1024;
    const limiteVideo = 30 * 1024 * 1024;

    if (ehImagem && arquivo.size > limiteImagem) {
      showToast(
        "A imagem deve ter no máximo 10 MB.",
        "error"
      );

      event.target.value = "";
      return;
    }

    if (ehVideo && arquivo.size > limiteVideo) {
      showToast(
        "O vídeo deve ter no máximo 30 MB.",
        "error"
      );

      event.target.value = "";
      return;
    }

    if (previewMidia) {
      URL.revokeObjectURL(previewMidia);
    }

    setMidia(arquivo);
    setTipoMidia(ehVideo ? "video" : "foto");
    setPreviewMidia(URL.createObjectURL(arquivo));
  }

  function removerMidia() {
    if (previewMidia) {
      URL.revokeObjectURL(previewMidia);
    }

    setMidia(null);
    setPreviewMidia("");
    setTipoMidia("");
  }

  async function enviarStatus(event) {
    event.preventDefault();

    if (!local) {
      showToast(
        "Local não encontrado.",
        "error"
      );

      return;
    }

    if (!status || avaliacao === 0) {
      showToast(
        "Escolha um status e uma avaliação antes de enviar.",
        "error"
      );

      return;
    }

    const usuarioSalvo = localStorage.getItem(
      "radarnow_usuario"
    );

    const token = localStorage.getItem(
      "radarnow_token"
    );

    if (!usuarioSalvo) {
      showToast(
        "Você precisa entrar na sua conta para enviar um status.",
        "info"
      );

      navigate("/login");
      return;
    }

    let usuario;

    try {
      usuario = JSON.parse(usuarioSalvo);
    } catch (error) {
      console.error(
        "Erro ao ler usuário salvo:",
        error
      );

      localStorage.removeItem(
        "radarnow_usuario"
      );

      localStorage.removeItem(
        "radarnow_token"
      );

      navigate("/login");
      return;
    }

    try {
      setCarregando(true);

      const formulario = new FormData();

      formulario.append(
        "usuario_id",
        String(usuario.id)
      );

      formulario.append(
        "local_id",
        String(Number(id))
      );

      formulario.append(
        "status",
        status
      );

      formulario.append(
        "nota",
        String(avaliacao)
      );

      formulario.append(
        "comentario",
        comentario.trim() || status
      );

      if (midia) {
        formulario.append(
          "midia",
          midia
        );
      }

      const resposta = await fetch(
        `${API_URL}/api/avaliacoes`,
        {
          method: "POST",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          body: formulario,
        }
      );

      const texto = await resposta.text();

      let dados = {};

      try {
        dados = texto
          ? JSON.parse(texto)
          : {};
      } catch {
        dados = {};
      }

      if (!resposta.ok) {
        showToast(
          dados.erro ||
            dados.mensagem ||
            "Erro ao enviar status.",
          "error"
        );

        return;
      }

      showToast(
        "Atualização enviada com sucesso!",
        "success"
      );

      navigate(
        `/local/${id}`,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Erro ao enviar status:",
        error
      );

      showToast(
        "Não foi possível conectar ao servidor.",
        "error"
      );
    } finally {
      setCarregando(false);
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

  if (carregandoLocal) {
    return (
      <main className="novo-status-page">
        <Header />

        <div className="novo-status-content">
          <p>Carregando local...</p>
        </div>

        <Footer />
      </main>
    );
  }

  if (!local) {
    return (
      <main className="novo-status-page">
        <Header />

        <div className="novo-status-content">
          <button
            type="button"
            className="novo-status-back-btn"
            onClick={() =>
              navigate("/mapa")
            }
            aria-label="Voltar"
          >
            <ArrowLeft size={20} />
          </button>

          <section className="novo-status-header">
            <span>
              Atualização em tempo real
            </span>

            <h1>Local não encontrado</h1>

            <p>
              {erroLocal ||
                "Não foi possível encontrar este local."}
            </p>
          </section>
        </div>

        <Footer />
      </main>
    );
  }

  const imagemClasse =
    local.imagem ||
    getImagemClasse(local.categoria);

  const fotoUrl = getFotoUrl(
    local.foto_google
  );

  return (
    <main className="novo-status-page">
      <Header />

      <div className="novo-status-content">
        <button
          type="button"
          className="novo-status-back-btn"
          onClick={() =>
            navigate(`/local/${id}`)
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="novo-status-header">
          <span>
            Atualização em tempo real
          </span>

          <h1>Atualizar status</h1>

          <div className="local-selected-card">
            <div
              className={
                fotoUrl
                  ? "local-selected-image"
                  : `local-selected-image ${imagemClasse}`
              }
            >
              {fotoUrl && (
                <img
                  src={fotoUrl}
                  alt={local.nome}
                />
              )}
            </div>

            <div>
              <strong>
                {local.nome}
              </strong>

              <p>
                <MapPin size={13} />

                {local.bairro ||
                  "Florianópolis"}

                {local.endereco
                  ? ` • ${local.endereco}`
                  : ""}
              </p>
            </div>
          </div>
        </section>

        <form
          className="novo-status-form"
          onSubmit={enviarStatus}
        >
          <div className="form-group">
            <label>
              <Activity size={18} />
              Como está agora?
            </label>

            <div className="status-grid">
              {statusOptions.map(
                (item) => (
                  <button
                    type="button"
                    key={item}
                    className={
                      status === item
                        ? "status-option active"
                        : "status-option"
                    }
                    onClick={() =>
                      setStatus(item)
                    }
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <Star size={18} />
              Sua avaliação
            </label>

            <div className="stars">
              {[1, 2, 3, 4, 5].map(
                (estrela) => (
                  <button
                    type="button"
                    key={estrela}
                    className={
                      avaliacao >= estrela
                        ? "star active"
                        : "star"
                    }
                    onClick={() =>
                      setAvaliacao(estrela)
                    }
                    aria-label={`${estrela} estrela${
                      estrela > 1 ? "s" : ""
                    }`}
                  >
                    <Star
                      size={24}
                      fill={
                        avaliacao >= estrela
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                )
              )}
            </div>
          </div>

          <div className="form-group">
            <label>
              <ImagePlus size={18} />
              Foto ou vídeo
            </label>

            {!previewMidia ? (
              <label className="upload-box">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={selecionarMidia}
                />

                <span>
                  Adicionar foto ou vídeo do local
                </span>
              </label>
            ) : (
              <div className="media-preview-box">
                {tipoMidia === "video" ? (
                  <video
                    src={previewMidia}
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={previewMidia}
                    alt="Prévia da mídia selecionada"
                  />
                )}

                <button
                  type="button"
                  className="remove-media-btn"
                  onClick={removerMidia}
                  aria-label="Remover mídia"
                >
                  <X size={18} />
                </button>

                <span className="media-file-name">
                  {midia?.name}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Comentário opcional
            </label>

            <textarea
              placeholder="Ex: fila de 15 minutos, música boa, ambiente cheio..."
              value={comentario}
              onChange={(event) =>
                setComentario(
                  event.target.value
                )
              }
              maxLength={500}
            />

            <small className="comment-counter">
              {comentario.length}/500
            </small>
          </div>

          <button
            type="submit"
            className="submit-status"
            disabled={carregando}
          >
            <Send size={18} />

            <span>
              {carregando
                ? "Enviando..."
                : "Enviar atualização"}
            </span>
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}

export default NovoStatus;