import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Bell,
  Shield,
  Info,
  LogOut,
  ChevronRight,
} from "lucide-react";

import "./Configuracoes.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Configuracoes() {
  const navigate = useNavigate();

  function sairDaConta() {
    localStorage.removeItem("radarnow_usuario");
    navigate("/login");
  }

  return (
    <main className="config-page">
      <Header />

      <div className="config-content">
        <button
          type="button"
          className="config-back-btn"
          onClick={() => navigate("/perfil")}
          aria-label="Voltar para perfil"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="config-header">
          <h1>Configurações</h1>
          <p>Personalize sua experiência no aplicativo.</p>
        </section>

        <section className="config-list">
          <button
            type="button"
            className="config-item"
            onClick={() => navigate("/editar-perfil")}
          >
            <div>
              <User size={18} />
              <span>Editar perfil</span>
            </div>

            <ChevronRight size={18} />
          </button>

          <button type="button" className="config-item">
            <div>
              <Bell size={18} />
              <span>Notificações</span>
            </div>

            <ChevronRight size={18} />
          </button>

          <button type="button" className="config-item">
            <div>
              <Shield size={18} />
              <span>Privacidade</span>
            </div>

            <ChevronRight size={18} />
          </button>

          <button type="button" className="config-item">
            <div>
              <Info size={18} />
              <span>Sobre o Radar Now</span>
            </div>

            <ChevronRight size={18} />
          </button>

          <button
            type="button"
            className="config-item logout"
            onClick={sairDaConta}
          >
            <div>
              <LogOut size={18} />
              <span>Sair da conta</span>
            </div>
          </button>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Configuracoes;