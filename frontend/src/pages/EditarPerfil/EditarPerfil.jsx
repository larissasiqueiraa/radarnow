import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Save, User } from "lucide-react";

import "./EditarPerfil.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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

    const usuarioLogado = JSON.parse(usuarioSalvo);

    setNome(usuarioLogado.nome || "");
    setUsuario(usuarioLogado.usuario || "");
    setPreviewFoto(usuarioLogado.foto_perfil || "");
  }, [navigate]);

  function selecionarFoto(event) {
    const arquivo = event.target.files[0];
    if (!arquivo) return;

    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function salvarPerfil(event) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioSalvo);

    try {
      setCarregando(true);

      const formData = new FormData();

      formData.append("nome", nome);
      formData.append("usuario", usuario);

      if (foto) {
        formData.append("foto", foto);
      }

      const resposta = await fetch(
        `http://localhost:5001/api/usuarios/${usuarioLogado.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao atualizar perfil.");
        return;
      }

      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify({
          ...usuarioLogado,
          nome,
          usuario,
          foto_perfil: dados.usuario.foto_perfil,
        })
      );

      alert("Perfil atualizado com sucesso!");
      navigate("/perfil");
    } catch (error) {
      console.error(error);
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
                <img src={previewFoto} alt="Foto de perfil" />
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
                onChange={(e) => setNome(e.target.value)}
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
                onChange={(e) => setUsuario(e.target.value)}
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