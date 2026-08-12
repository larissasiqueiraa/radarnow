import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Info,
  LogOut,
  Trash2,
  ChevronRight,
  LoaderCircle,
  X,
} from "lucide-react";

import "./Configuracoes.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import {
  useToast,
} from "../../components/Toast/Toast.jsx";

import {
  API_URL,
} from "../../config/api.js";

function Configuracoes() {
  const navigate =
    useNavigate();

  const { showToast } =
    useToast();

  const [
    modalExcluirAberto,
    setModalExcluirAberto,
  ] = useState(false);

  const [
    excluindoConta,
    setExcluindoConta,
  ] = useState(false);

  function limparSessao() {
    localStorage.removeItem(
      "radarnow_usuario"
    );

    localStorage.removeItem(
      "radarnow_token"
    );
  }

  function sairDaConta() {
    limparSessao();

    showToast(
      "Você saiu da sua conta.",
      "success"
    );

    navigate("/login");
  }

  async function excluirConta() {
    const token =
      localStorage.getItem(
        "radarnow_token"
      );

    if (!token) {
      limparSessao();

      showToast(
        "Sua sessão expirou. Entre novamente.",
        "error"
      );

      navigate("/login");

      return;
    }

    try {
      setExcluindoConta(true);

      const resposta =
        await fetch(
          `${API_URL}/api/usuarios/conta`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const dados =
        await resposta.json();

      if (!resposta.ok) {
        throw new Error(
          dados.erro ||
            "Não foi possível excluir sua conta."
        );
      }

      limparSessao();

      setModalExcluirAberto(
        false
      );

      showToast(
        "Sua conta foi excluída permanentemente.",
        "success",
        5000
      );

      navigate("/");
    } catch (error) {
      showToast(
        error.message,
        "error",
        5000
      );
    } finally {
      setExcluindoConta(
        false
      );
    }
  }

  return (
    <main className="config-page">
      <Header />

      <div className="config-content">
        <button
          type="button"
          className="config-back-btn"
          onClick={() =>
            navigate("/perfil")
          }
          aria-label="Voltar para perfil"
        >
          <ArrowLeft
            size={20}
          />
        </button>

        <section className="config-header">
          <h1>
            Configurações
          </h1>

          <p>
            Personalize sua experiência
            no aplicativo.
          </p>
        </section>

        <section className="config-list">
          <button
            type="button"
            className="config-item"
            onClick={() =>
              navigate(
                "/editar-perfil"
              )
            }
          >
            <div>
              <User size={18} />

              <span>
                Editar perfil
              </span>
            </div>

            <ChevronRight
              size={18}
            />
          </button>

          <button
            type="button"
            className="config-item"
            onClick={() =>
              showToast(
                "As configurações de notificações estarão disponíveis em breve.",
                "info"
              )
            }
          >
            <div>
              <Bell size={18} />

              <span>
                Notificações
              </span>
            </div>

            <ChevronRight
              size={18}
            />
          </button>

          <button
            type="button"
            className="config-item"
            onClick={() =>
              showToast(
                "As configurações de privacidade estarão disponíveis em breve.",
                "info"
              )
            }
          >
            <div>
              <Shield size={18} />

              <span>
                Privacidade
              </span>
            </div>

            <ChevronRight
              size={18}
            />
          </button>

          <button
            type="button"
            className="config-item"
            onClick={() =>
              showToast(
                "Radar Now: descubra lugares e compartilhe como eles estão em tempo real.",
                "info",
                5000
              )
            }
          >
            <div>
              <Info size={18} />

              <span>
                Sobre o Radar Now
              </span>
            </div>

            <ChevronRight
              size={18}
            />
          </button>

          <button
            type="button"
            className="config-item logout"
            onClick={sairDaConta}
          >
            <div>
              <LogOut size={18} />

              <span>
                Sair da conta
              </span>
            </div>
          </button>

          <button
            type="button"
            className="config-item delete-account"
            onClick={() =>
              setModalExcluirAberto(
                true
              )
            }
          >
            <div>
              <Trash2
                size={18}
              />

              <span>
                Excluir minha conta
              </span>
            </div>
          </button>
        </section>
      </div>

      <Footer />

      {modalExcluirAberto && (
        <div
          className="delete-modal-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (
              event.target ===
                event.currentTarget &&
              !excluindoConta
            ) {
              setModalExcluirAberto(
                false
              );
            }
          }}
        >
          <section
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
          >
            <button
              type="button"
              className="delete-modal-close"
              onClick={() =>
                setModalExcluirAberto(
                  false
                )
              }
              disabled={
                excluindoConta
              }
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="delete-modal-icon">
              <Trash2
                size={24}
              />
            </div>

            <h2 id="delete-modal-title">
              Excluir sua conta?
            </h2>

            <p>
              Sua conta, avaliações,
              favoritos, fotos e vídeos
              serão excluídos
              permanentemente.
            </p>

            <strong>
              Esta ação não poderá ser
              desfeita.
            </strong>

            <div className="delete-modal-actions">
              <button
                type="button"
                className="delete-cancel-btn"
                onClick={() =>
                  setModalExcluirAberto(
                    false
                  )
                }
                disabled={
                  excluindoConta
                }
              >
                Cancelar
              </button>

              <button
                type="button"
                className="delete-confirm-btn"
                onClick={
                  excluirConta
                }
                disabled={
                  excluindoConta
                }
              >
                {excluindoConta ? (
                  <>
                    <LoaderCircle
                      size={18}
                      className="delete-spinner"
                    />

                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={18}
                    />

                    Excluir permanentemente
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default Configuracoes;