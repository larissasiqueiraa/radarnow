import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Send,
} from "lucide-react";

import "./RecuperarSenha.css";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function RecuperarSenha() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviarLink(event) {
    event.preventDefault();

    if (!email.trim()) {
      showToast("Digite seu e-mail.", "error");
      return;
    }

    try {
      setCarregando(true);

      const resposta = await fetch(
        `${API_URL}/api/auth/esqueci-senha`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
          }),
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        showToast(
          dados.erro ||
            "Não foi possível enviar o link de recuperação.",
          "error"
        );

        return;
      }

      setEnviado(true);

      showToast(
        "Link de recuperação enviado!",
        "success"
      );
    } catch (error) {
      console.error(
        "Erro ao solicitar recuperação de senha:",
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

  return (
    <main className="recuperar-senha-page">
      <button
        type="button"
        className="recuperar-voltar-btn"
        onClick={() => navigate("/login")}
        aria-label="Voltar para o login"
      >
        <ArrowLeft size={20} />
      </button>

      <section className="recuperar-senha-header">
        <span>Radar Now</span>

        <h1>Esqueceu sua senha?</h1>

        <p>
          Digite o e-mail da sua conta e enviaremos um
          link para você criar uma nova senha.
        </p>
      </section>

      {!enviado ? (
        <form
          className="recuperar-senha-form"
          onSubmit={enviarLink}
        >
          <label>
            E-mail

            <div className="recuperar-input-box">
              <Mail size={18} />

              <input
                type="email"
                placeholder="seuemail@email.com"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                autoComplete="email"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            className="recuperar-enviar-btn"
            disabled={carregando}
          >
            <Send size={18} />

            {carregando
              ? "Enviando..."
              : "Enviar link de recuperação"}
          </button>
        </form>
      ) : (
        <section className="recuperar-sucesso">
          <div className="recuperar-sucesso-icon">
            <Mail size={30} />
          </div>

          <h2>Confira seu e-mail</h2>

          <p>
            Enviamos um link de recuperação para:
          </p>

          <strong>{email.trim().toLowerCase()}</strong>

          <small>
            O link terá validade limitada. Confira também
            a pasta de spam.
          </small>

          <button
            type="button"
            onClick={() => setEnviado(false)}
          >
            Tentar outro e-mail
          </button>
        </section>
      )}

      <p className="recuperar-senha-footer">
        Lembrou sua senha?{" "}
        <Link to="/login">Voltar para o login</Link>
      </p>
    </main>
  );
}

export default RecuperarSenha;