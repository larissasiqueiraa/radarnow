import {
  ArrowLeft,
  Heart,
  Mail,
  Shield,
  FileText,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import "./Sobre.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Sobre() {
  const navigate =
    useNavigate();

  return (
    <main className="sobre-page">
      <Header />

      <div className="sobre-content">
        <button
          type="button"
          className="sobre-back-btn"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="sobre-header">
          <div className="sobre-logo">
            RN
          </div>

          <h1>
            Radar Now
          </h1>

          <span>
            Versão 1.0.0
          </span>
        </header>

        <section className="sobre-card">
          <h2>
            O que está rolando agora?
          </h2>

          <p>
            O Radar Now ajuda você a
            descobrir lugares e
            acompanhar como eles estão em
            tempo real.
          </p>

          <p>
            Consulte movimento, ambiente,
            avaliações, fotos e vídeos
            compartilhados pela
            comunidade antes de escolher
            seu próximo destino.
          </p>
        </section>

        <section className="sobre-card">
          <h2>
            Nossa proposta
          </h2>

          <p>
            Aproximar pessoas dos melhores
            lugares ao redor, oferecendo
            informações atuais,
            experiências reais e uma
            comunidade colaborativa.
          </p>
        </section>

        <section className="sobre-links">
          <Link
            to="/privacidade"
            className="sobre-link"
          >
            <div>
              <Shield size={19} />

              <span>
                Política de Privacidade
              </span>
            </div>

            <span aria-hidden="true">
              ›
            </span>
          </Link>

          <Link
            to="/termos"
            className="sobre-link"
          >
            <div>
              <FileText size={19} />

              <span>
                Termos de Uso
              </span>
            </div>

            <span aria-hidden="true">
              ›
            </span>
          </Link>

          <Link
            to="/suporte"
            className="sobre-link"
          >
            <div>
              <Mail size={19} />

              <span>
                Contato e suporte
              </span>
            </div>

            <span aria-hidden="true">
              ›
            </span>
          </Link>
        </section>

        <section className="sobre-footer-message">
          <Heart
            size={18}
            aria-hidden="true"
          />

          <p>
            Feito para quem gosta de
            descobrir o que está
            acontecendo agora.
          </p>
        </section>

        <p className="sobre-copyright">
          © 2026 Radar Now. Todos os
          direitos reservados.
        </p>
      </div>

      <Footer />
    </main>
  );
}

export default Sobre;