import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Save, User } from "lucide-react";

import "./EditarPerfil.css";
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

function EditarPerfil() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    try {
      const usuarioLogado = JSON.parse(usuarioSalvo);

      setNome(usuarioLogado.nome || usuarioLogado.name || "");

      setUsuario(
        usuarioLogado.usuario ||
          usuarioLogado.username ||
          usuarioLogado.email?.split("@")[0] ||
          ""
      );

      const fotoSalva =
        usuarioLogado.foto_perfil ||
        usuarioLogado.foto ||
        usuarioLogado.picture ||
        usuarioLogado.avatar ||
        "";

      setPreviewFoto(corrigirUrlFoto(fotoSalva));
    } catch (error) {
      console.error("Erro ao ler usuário salvo:", error);

      localStorage.removeItem("radarnow_usuario");
      localStorage.removeItem("radarnow_token");

      navigate("/login");
    }
  }, [navigate]);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      showToast("Selecione um arquivo de imagem.", "error");
      event.target.value = "";
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      showToast("A imagem deve ter no máximo 5 MB.", "error");
      event.target.value = "";
      return;
    }

    if (previewFoto.startsWith("blob:")) {
      URL.revokeObjectURL(previewFoto);
    }

    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem("radarnow_usuario");
    const token = localStorage.getItem("radarnow_token");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    let usuarioLogado;

    try {
      usuarioLogado = JSON.parse(usuarioSalvo);
    } catch (error) {
      console.error("Erro ao ler usuário salvo:", error);

      localStorage.removeItem("radarnow_usuario");
      localStorage.removeItem("radarnow_token");

      navigate("/login");
      return;
    }

    try {
      setCarregando(true);

      const formData = new FormData();

      formData.append("nome", nome.trim());
      formData.append("usuario", usuario.trim());

      if (foto) {
        formData.append("foto", foto);
      }

      const resposta = await fetch(
        `${API_URL}/api/usuarios/${usuarioLogado.id}`,
        {
          method: "PUT",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
          body: formData,
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
        showToast(dados.erro || "Erro ao atualizar perfil.", "error");
        return;
      }

      const usuarioAtualizado = dados.usuario || dados;

      const fotoRecebida =
        usuarioAtualizado.foto_perfil ||
        usuarioAtualizado.foto ||
        usuarioAtualizado.picture ||
        usuarioAtualizado.avatar ||
        usuarioLogado.foto_perfil ||
        "";

      const fotoPerfilCorrigida = corrigirUrlFoto(fotoRecebida);

      const novoUsuarioSalvo = {
        ...usuarioLogado,
        ...usuarioAtualizado,
        nome: usuarioAtualizado.nome || nome.trim(),
        usuario: usuarioAtualizado.usuario || usuario.trim(),
        foto_perfil: fotoPerfilCorrigida,
      };

      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(novoUsuarioSalvo)
      );

      showToast("Perfil atualizado com sucesso!", "success");
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showToast("Não foi possível conectar ao servidor.", "error");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="editar-perfil-page">
      <Header />

      <div className="editar-perfil-content">
        <button
          type="button"
          className="editar-back-btn"
          onClick={() => navigate("/perfil")}
          aria-label="Voltar para perfil"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="editar-header">
          <h1>Editar perfil</h1>
          <p>Atualize suas informações e sua foto de perfil.</p>
        </section>

        <form className="editar-form" onSubmit={salvarPerfil}>
          <div className="avatar-upload-area">
            <label className="avatar-upload">
              <input
                type="file"
                accept="image/*"
                onChange={selecionarFoto}
              />

              {previewFoto ? (
                <img
                  src={previewFoto}
                  alt="Foto de perfil"
                  onError={() => setPreviewFoto("")}
                />
              ) : (
                <div className="avatar-placeholder">
                  <Camera size={28} />
                </div>
              )}
            </label>

            <span>Alterar foto</span>
          </div>

          <label>
            Nome
            <div className="input-box">
              <User size={18} />

              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
          </label>

          <label>
            Usuário
            <div className="input-box">
              <User size={18} />

              <input
                type="text"
                value={usuario}
                onChange={(event) => setUsuario(event.target.value)}
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="save-profile-btn"
            disabled={carregando}
          >
            <Save size={18} />

            <span>{carregando ? "Salvando..." : "Salvar alterações"}</span>
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}

export default EditarPerfil;