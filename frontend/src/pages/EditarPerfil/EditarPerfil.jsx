import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Save, User } from "lucide-react";

import "./EditarPerfil.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function EditarPerfil() {
  const navigate = useNavigate();

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
      setPreviewFoto(
        usuarioLogado.foto_perfil ||
          usuarioLogado.foto ||
          usuarioLogado.picture ||
          usuarioLogado.avatar ||
          ""
      );
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
      alert("Selecione um arquivo de imagem.");
      return;
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

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao atualizar perfil.");
        return;
      }

      const usuarioAtualizado = dados.usuario || dados;

      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify({
          ...usuarioLogado,
          ...usuarioAtualizado,
          nome: usuarioAtualizado.nome || nome.trim(),
          usuario: usuarioAtualizado.usuario || usuario.trim(),
          foto_perfil:
            usuarioAtualizado.foto_perfil ||
            usuarioAtualizado.foto ||
            usuarioAtualizado.picture ||
            usuarioLogado.foto_perfil ||
            previewFoto ||
            "",
        })
      );

      alert("Perfil atualizado com sucesso!");
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Não foi possível conectar ao servidor.");
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
              <input type="file" accept="image/*" onChange={selecionarFoto} />

              {previewFoto ? (
                <img
                  src={previewFoto}
                  alt="Foto de perfil"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    setPreviewFoto("");
                  }}
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