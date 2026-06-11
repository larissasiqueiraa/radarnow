import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Home,
  Search,
  Heart,
  Plus,
  Map,
  X,
  MapPin,
  Star,
  Lock,
} from "lucide-react";

import "./Footer.css";

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [authModalAberto, setAuthModalAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [locais, setLocais] = useState([]);
  const [carregandoLocais, setCarregandoLocais] = useState(false);

  const usuarioSalvo = localStorage.getItem("radarnow_usuario");
  const estaLogado = !!usuarioSalvo;

  function isActive(path) {
    return location.pathname === path;
  }

  async function carregarLocais() {
    try {
      setCarregandoLocais(true);

      const resposta = await fetch("http://localhost:5001/api/locais");

      if (!resposta.ok) {
        throw new Error("Erro ao buscar locais.");
      }

      const dados = await resposta.json();
      setLocais(dados);
    } catch (error) {
      console.error("Erro ao carregar locais no footer:", error);
      setLocais([]);
    } finally {
      setCarregandoLocais(false);
    }
  }

  function abrirModal() {
    if (!estaLogado) {
      setAuthModalAberto(true);
      return;
    }

    setModalAberto(true);
    setBusca("");
  }

  function fecharModal() {
    setModalAberto(false);
    setBusca("");
  }

  function fecharAuthModal() {
    setAuthModalAberto(false);
  }

  function irParaFavoritos() {
    if (!estaLogado) {
      setAuthModalAberto(true);
      return;
    }

    navigate("/favoritos");
  }

  function selecionarLocal(id) {
    fecharModal();
    navigate(`/novo-status/${id}`);
  }

  function irParaCadastro() {
    fecharAuthModal();
    navigate("/cadastro");
  }

  function irParaLogin() {
    fecharAuthModal();
    navigate("/login");
  }

  useEffect(() => {
    if (modalAberto && locais.length === 0) {
      carregarLocais();
    }
  }, [modalAberto]);

  const locaisFiltrados = locais.filter((place) => {
    const texto = busca.toLowerCase();

    return (
      place.nome?.toLowerCase().includes(texto) ||
      place.categoria?.toLowerCase().includes(texto) ||
      place.bairro?.toLowerCase().includes(texto) ||
      place.endereco?.toLowerCase().includes(texto)
    );
  });

  return (
    <>
      <footer className="app-footer">
        <Link
          to="/"
          className={isActive("/") ? "footer-item active" : "footer-item"}
        >
          <Home size={20} />
          <span>Início</span>
        </Link>

        <Link
          to="/busca"
          className={isActive("/busca") ? "footer-item active" : "footer-item"}
        >
          <Search size={20} />
          <span>Buscar</span>
        </Link>

        <button type="button" className="footer-plus" onClick={abrirModal}>
          <Plus size={30} />
        </button>

        <button
          type="button"
          onClick={irParaFavoritos}
          className={
            isActive("/favoritos") ? "footer-item active" : "footer-item"
          }
        >
          <Heart size={20} />
          <span>Favoritos</span>
        </button>

        <Link
          to="/mapa"
          className={isActive("/mapa") ? "footer-item active" : "footer-item"}
        >
          <Map size={20} />
          <span>Mapa</span>
        </Link>
      </footer>

      {modalAberto && (
        <div className="status-modal-overlay">
          <div className="status-modal">
            <div className="status-modal-header">
              <div>
                <h2>Atualizar status</h2>
                <p>Escolha o lugar que você quer atualizar agora.</p>
              </div>

              <button type="button" onClick={fecharModal}>
                <X size={20} />
              </button>
            </div>

            <div className="status-modal-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Buscar local..."
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
              />
            </div>

            <div className="status-modal-list">
              {carregandoLocais ? (
                <div className="status-modal-empty">
                  <h3>Carregando locais...</h3>
                  <p>Aguarde um instante.</p>
                </div>
              ) : locaisFiltrados.length > 0 ? (
                locaisFiltrados.map((place) => (
                  <button
                    type="button"
                    className="status-modal-card"
                    key={place.id}
                    onClick={() => selecionarLocal(place.id)}
                  >
                    <div className="status-modal-image">
                      {place.foto_google ? (
                        <img
                          src={`http://localhost:5001/api/google-places/foto?name=${encodeURIComponent(
                            place.foto_google
                          )}`}
                          alt={place.nome}
                        />
                      ) : (
                        <MapPin size={22} />
                      )}
                    </div>

                    <div className="status-modal-info">
                      <div className="status-modal-top">
                        <h3>{place.nome}</h3>

                        <span>
                          <Star size={13} fill="currentColor" />
                          {place.nota || "—"}
                        </span>
                      </div>

                      <p>
                        {place.categoria || "Local"} •{" "}
                        {place.bairro || "Florianópolis"}
                      </p>

                      <small>
                        <MapPin size={12} />
                        {place.endereco || "Endereço não informado"}
                      </small>
                    </div>
                  </button>
                ))
              ) : (
                <div className="status-modal-empty">
                  <h3>Nenhum local encontrado</h3>
                  <p>Tente buscar por outro nome ou bairro.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {authModalAberto && (
        <div className="status-modal-overlay">
          <div className="auth-footer-modal">
            <button
              type="button"
              className="auth-footer-close"
              onClick={fecharAuthModal}
            >
              <X size={20} />
            </button>

            <div className="auth-footer-icon">
              <Lock size={24} />
            </div>

            <h2>Entre para participar</h2>

            <p>
              Crie sua conta para atualizar status, favoritar lugares e acessar
              suas informações salvas.
            </p>

            <button type="button" onClick={irParaCadastro}>
              Criar conta grátis
            </button>

            <button
              type="button"
              className="auth-footer-secondary"
              onClick={irParaLogin}
            >
              Já tenho conta
            </button>

            <button
              type="button"
              className="auth-footer-ghost"
              onClick={fecharAuthModal}
            >
              Continuar explorando
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;