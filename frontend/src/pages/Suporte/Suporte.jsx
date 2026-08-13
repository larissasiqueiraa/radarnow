import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  Mail,
  Shield,
  Trash2,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Suporte.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Suporte() {
  const navigate =
    useNavigate();

  return (
    <main className="suporte-page">
      <Header />

      <div className="suporte-content">
        <button
          type="button"
          className="suporte-back-btn"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="suporte-header">
          <div className="suporte-icon">
            <CircleHelp size={29} />
          </div>

          <h1>
            Suporte
          </h1>

          <p>
            Estamos aqui para ajudar com
            dúvidas, problemas técnicos e
            solicitações relacionadas ao
            Radar Now.
          </p>
        </header>

        <section className="suporte-contact-card">
          <Mail size={25} />

          <div>
            <h2>
              Fale com o Radar Now
            </h2>

            <p>
              Envie uma mensagem
              descrevendo o problema ou a
              solicitação com o máximo de
              detalhes possível.
            </p>

            <a href="mailto:contato.radarnow@gmail.com?subject=Suporte%20Radar%20Now">
              contato.radarnow@gmail.com
            </a>
          </div>
        </section>

        <section className="suporte-section">
          <h2>
            Como podemos ajudar?
          </h2>

          <div className="suporte-topics">
            <article>
              <strong>
                Acesso à conta
              </strong>

              <p>
                Problemas de cadastro,
                login, recuperação de
                acesso ou atualização de
                perfil.
              </p>
            </article>

            <article>
              <strong>
                Problemas técnicos
              </strong>

              <p>
                Erros no aplicativo,
                imagens que não carregam,
                dificuldades com
                localização ou recursos
                indisponíveis.
              </p>
            </article>

            <article>
              <strong>
                Informações de lugares
              </strong>

              <p>
                Dados incorretos ou
                desatualizados sobre um
                estabelecimento.
              </p>
            </article>

            <article>
              <strong>
                Conteúdo inadequado
              </strong>

              <p>
                Denúncias relacionadas a
                avaliações, comentários,
                fotos, vídeos ou outros
                conteúdos publicados.
              </p>
            </article>

            <article>
              <strong>
                Privacidade
              </strong>

              <p>
                Solicitações relacionadas
                aos seus dados pessoais e
                aos direitos previstos na
                LGPD.
              </p>
            </article>
          </div>
        </section>

        <section className="suporte-section">
          <h2>
            Ao entrar em contato
          </h2>

          <p>
            Para facilitar a análise,
            informe:
          </p>

          <ul>
            <li>
              Seu nome de usuário no
              Radar Now, quando
              aplicável;
            </li>

            <li>
              Uma descrição clara do que
              aconteceu;
            </li>

            <li>
              O nome do lugar ou da tela
              relacionada ao problema;
            </li>

            <li>
              Capturas de tela, caso
              ajudem a demonstrar o erro;
            </li>

            <li>
              O modelo do dispositivo e
              a versão do sistema
              operacional, em caso de
              problema técnico.
            </li>
          </ul>

          <p>
            Nunca envie sua senha ou
            códigos de acesso por e-mail.
          </p>
        </section>

        <section className="suporte-section">
          <h2>
            Exclusão da conta
          </h2>

          <div className="suporte-account-delete">
            <Trash2 size={21} />

            <p>
              A exclusão pode ser
              realizada dentro do
              aplicativo em:
              <strong>
                Perfil → Configurações →
                Excluir minha conta
              </strong>
            </p>
          </div>

          <p>
            Caso não consiga acessar a
            conta, envie uma solicitação
            pelo e-mail de suporte. Para
            proteger seus dados, poderá
            ser necessário confirmar sua
            identidade.
          </p>
        </section>

        <section className="suporte-links">
          <Link
            to="/privacidade"
            className="suporte-link"
          >
            <div>
              <Shield size={19} />

              <span>
                Política de Privacidade
              </span>
            </div>

            <ChevronRight size={19} />
          </Link>

          <Link
            to="/termos"
            className="suporte-link"
          >
            <div>
              <FileText size={19} />

              <span>
                Termos de Uso
              </span>
            </div>

            <ChevronRight size={19} />
          </Link>
        </section>

        <p className="suporte-responsavel">
          Responsável pelo Radar Now:
          Larissa Siqueira
        </p>
      </div>

      <Footer />
    </main>
  );
}

export default Suporte;