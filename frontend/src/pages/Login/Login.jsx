import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Mail, Lock, ArrowRight, Apple } from "lucide-react";

import "./Login.css";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Login() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoGoogle, setCarregandoGoogle] = useState(false);

  async function entrar(event) {
    event.preventDefault();

    try {
      setCarregando(true);

      const resposta = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        showToast(dados.erro || "Erro ao fazer login.", "error");
        return;
      }

      localStorage.setItem("radarnow_token", dados.token);
      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(dados.usuario)
      );

      showToast("Login realizado com sucesso!", "success");
      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      showToast("Não foi possível conectar ao servidor.", "error");
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
        showToast(dados.erro || "Erro ao entrar com Google.", "error");
        return;
      }

      localStorage.setItem("radarnow_token", dados.token);
      localStorage.setItem(
        "radarnow_usuario",
        JSON.stringify(dados.usuario)
      );

      showToast("Login com Google realizado com sucesso!", "success");
      navigate("/");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      showToast("Não foi possível conectar ao servidor.", "error");
    } finally {
      setCarregandoGoogle(false);
    }
  }

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      enviarGoogleParaBackend(tokenResponse.access_token);
    },
    onError: () => {
      showToast("Não foi possível entrar com Google.", "error");
    },
  });

  function entrarComApple() {
    showToast("Login com Apple estará disponível em breve.", "info");
  }

  return (
    <main className="login-page">
      <section className="login-header">
        <span>Radar Now</span>
        <h1>Entre na sua conta</h1>
        <p>Veja como estão os lugares em tempo real.</p>
      </section>

      <form className="login-form" onSubmit={entrar}>
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

        <Link to="/recuperar-senha" className="forgot-link">
          Esqueci minha senha
        </Link>

        <button
          type="submit"
          className="login-btn"
          disabled={carregando}
        >
          {carregando ? "Entrando..." : "Entrar"}
          <ArrowRight size={18} />
        </button>

        <div className="social-divider">
          <span>ou continue com</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-btn social-google-btn"
            onClick={() => loginGoogle()}
            disabled={carregandoGoogle}
          >
            <span className="google-icon">G</span>
            {carregandoGoogle ? "Entrando..." : "Google"}
          </button>

          <button
            type="button"
            className="social-btn"
            onClick={entrarComApple}
          >
            <Apple size={18} />
            Apple
          </button>
        </div>
      </form>

      <p className="login-footer">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </main>
  );
}

export default Login;