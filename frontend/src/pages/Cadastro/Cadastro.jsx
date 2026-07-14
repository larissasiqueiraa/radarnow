import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    setFoto(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function cadastrar(event) {
    event.preventDefault();

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(`${API_URL}/api/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          usuario,
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        alert(dados.erro || "Erro ao criar conta.");
        return;
      }

      console.log("Foto escolhida no front:", foto);

      alert("Conta criada com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      alert("Não foi possível conectar ao servidor.");
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
        alert(dados.erro || "Erro ao continuar com Google.");
        return;
      }

      localStorage.setItem("radarnow_token", dados.token);
      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(dados.usuario)
      );

      alert("Conta criada/entrada com Google realizada com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao continuar com Google:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoGoogle(false);
    }
  }

  const cadastroGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      enviarGoogleParaBackend(tokenResponse.access_token);
    },
    onError: () => {
      alert("Não foi possível continuar com Google.");
    },
  });

  function cadastrarComApple() {
    alert("Cadastro com Apple será configurado depois.");
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-header">
        <span>Radar Now</span>

        <h1>Criar conta</h1>

        <p>
          Compartilhe experiências e descubra os melhores lugares em tempo real.
        </p>
      </section>

      <form className="cadastro-form" onSubmit={cadastrar}>
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
              onChange={(event) => setConfirmarSenha(event.target.value)}
              required
            />
          </div>
        </label>

        <button
          type="submit"
          className="cadastro-btn"
          disabled={carregando}
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
            disabled={carregandoGoogle}
          >
            <span className="google-icon">G</span>
            {carregandoGoogle ? "Continuando..." : "Google"}
          </button>

          <button
            type="button"
            className="social-btn"
            onClick={cadastrarComApple}
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