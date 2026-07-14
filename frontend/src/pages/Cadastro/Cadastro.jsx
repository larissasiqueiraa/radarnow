import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Apple,
  Camera,
} from "lucide-react";

import "./Cadastro.css";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Cadastro() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  useEffect(() => {
    return () => {
      if (previewFoto) {
        URL.revokeObjectURL(previewFoto);
      }
    };
  }, [previewFoto]);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      showToast(
        "Escolha uma imagem JPG, PNG ou WEBP.",
        "error"
      );
      event.target.value = "";
      return;
    }

    const tamanhoMaximo = 5 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximo) {
      showToast(
        "A foto deve ter no máximo 5 MB.",
        "error"
      );
      event.target.value = "";
      return;
    }

    if (previewFoto) {
      URL.revokeObjectURL(previewFoto);
    }

    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function cadastrar(event) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      showToast("As senhas não coincidem.", "error");
      return;
    }

    try {
      setCarregando(true);

      const formulario = new FormData();

      formulario.append("nome", nome.trim());
      formulario.append(
        "usuario",
        usuario.trim().replace(/^@/, "")
      );
      formulario.append("email", email.trim().toLowerCase());
      formulario.append("senha", senha);

      if (foto) {
        formulario.append("foto", foto);
      }

      const resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: "POST",
        body: formulario,
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        showToast(
          dados.erro || "Erro ao criar conta.",
          "error"
        );
        return;
      }

      if (!dados.token || !dados.usuario) {
        showToast(
          "A conta foi criada, mas não foi possível entrar automaticamente.",
          "error"
        );
        navigate("/login");
        return;
      }

      localStorage.setItem("radarnow_token", dados.token);
      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(dados.usuario)
      );

      showToast("Conta criada com sucesso!", "success");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao criar conta:", error);

      showToast(
        "Não foi possível conectar ao servidor.",
        "error"
      );
    } finally {
      setCarregando(false);
    }
  }

  async function enviarGoogleParaBackend(accessToken) {
    try {
      setCarregandoGoogle(true);

      const resposta = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: accessToken,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        showToast(
          dados.erro || "Erro ao continuar com Google.",
          "error"
        );
        return;
      }

      localStorage.setItem("radarnow_token", dados.token);
      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(dados.usuario)
      );

      showToast(
        "Entrada com Google realizada com sucesso!",
        "success"
      );

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Erro ao continuar com Google:", error);

      showToast(
        "Não foi possível conectar ao servidor.",
        "error"
      );
    } finally {
      setCarregandoGoogle(false);
    }
  }

  const cadastroGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      enviarGoogleParaBackend(tokenResponse.access_token);
    },
    onError: () => {
      showToast(
        "Não foi possível continuar com Google.",
        "error"
      );
    },
  });

  function cadastrarComApple() {
    showToast(
      "Cadastro com Apple estará disponível em breve.",
      "info"
    );
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-header">
        <span>Radar Now</span>

        <h1>Criar conta</h1>

        <p>
          Compartilhe experiências e descubra os melhores lugares em
          tempo real.
        </p>
      </section>

      <form className="cadastro-form" onSubmit={cadastrar}>
        <div className="avatar-upload-area">
          <label className="avatar-upload">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={selecionarFoto}
            />

            {previewFoto ? (
              <img src={previewFoto} alt="Foto de perfil" />
            ) : (
              <div className="avatar-placeholder">
                <Camera size={28} />
              </div>
            )}
          </label>

          <span>Foto de perfil opcional</span>
        </div>

        <label>
          Nome
          <div className="input-box">
            <User size={18} />

            <input
              type="text"
              placeholder="Seu nome"
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
              placeholder="@usuario"
              value={usuario}
              onChange={(event) => setUsuario(event.target.value)}
              required
            />
          </div>
        </label>

        <label>
          E-mail
          <div className="input-box">
            <Mail size={18} />

            <input
              type="email"
              placeholder="seuemail@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
        </label>

        <label>
          Senha
          <div className="input-box">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Sua senha"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              minLength={6}
              required
            />
          </div>
        </label>

        <label>
          Confirmar senha
          <div className="input-box">
            <Lock size={18} />

            <input
              type="password"
              placeholder="Repita sua senha"
              value={confirmarSenha}
              onChange={(event) =>
                setConfirmarSenha(event.target.value)
              }
              minLength={6}
              required
            />
          </div>
        </label>

        <button
          type="submit"
          className="cadastro-btn"
          disabled={carregando || carregandoGoogle}
        >
          {carregando ? "Criando conta..." : "Criar conta"}
          <ArrowRight size={18} />
        </button>

        <div className="social-divider">
          <span>ou continue com</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-btn social-google-btn"
            onClick={() => cadastroGoogle()}
            disabled={carregandoGoogle || carregando}
          >
            <span className="google-icon">G</span>

            {carregandoGoogle ? "Continuando..." : "Google"}
          </button>

          <button
            type="button"
            className="social-btn"
            onClick={cadastrarComApple}
            disabled={carregando || carregandoGoogle}
          >
            <Apple size={18} />
            Apple
          </button>
        </div>
      </form>

      <p className="cadastro-footer">
        Já possui conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}

export default Cadastro;