import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Star, MapPin } from "lucide-react";

import "./AtualizarLocal.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function AtualizarLocal() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarLocais();
  }, []);

  async function carregarLocais() {
    try {
      const resposta = await fetch(`${API_URL}/api/locais`);

      if (!resposta.ok) {
        throw new Error("Erro ao buscar locais.");
      }

      const dados = await resposta.json();
      setLocais(dados);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      alert("Não foi possível carregar os locais.");
    } finally {
      setCarregando(false);
    }
  }

  const locaisFiltrados = locais.filter((place) => {
    const textoBusca = search.toLowerCase();

    return (
      place.nome?.toLowerCase().includes(textoBusca) ||
      place.categoria?.toLowerCase().includes(textoBusca) ||
      place.bairro?.toLowerCase().includes(textoBusca) ||
      place.endereco?.toLowerCase().includes(textoBusca)
    );
  });

  return (
    <main className="atualizar-local-page">
      <Header />

      <div className="atualizar-local-content">
        <button
          type="button"
          className="atualizar-local-back-btn"
          onClick={() => navigate("/")}
          aria-label="Voltar para Home"
        >
          <ArrowLeft size={20} />
        </button>

        <section className="atualizar-local-header">
          <h1>Qual lugar você quer atualizar?</h1>
          <p>Escolha um local para informar como ele está agora.</p>
        </section>

        <section className="atualizar-local-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Buscar por nome, categoria ou bairro..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </section>

        <section className="atualizar-local-list">
          {carregando ? (
            <div className="atualizar-local-empty">
              <h3>Carregando locais...</h3>
              <p>Aguarde um instante.</p>
            </div>
          ) : locaisFiltrados.length > 0 ? (
            locaisFiltrados.map((place) => (
              <Link
                to={`/novo-status/${place.id}`}
                className="atualizar-local-card"
                key={place.id}
              >
                <div className="atualizar-local-image">
                  {place.foto_google ? (
                    <img
                      src={`${API_URL}/api/google-places/foto?name=${encodeURIComponent(
                        place.foto_google
                      )}`}
                      alt={place.nome}
                    />
                  ) : (
                    <MapPin size={26} />
                  )}
                </div>

                <div className="atualizar-local-info">
                  <div className="atualizar-local-top">
                    <h3>{place.nome}</h3>

                    <span>
                      <Star size={14} fill="currentColor" />
                      {place.nota || "—"}
                    </span>
                  </div>

                  <p>
                    {place.categoria || "Local"} •{" "}
                    {place.bairro || "Florianópolis"}
                  </p>

                  <div className="atualizar-local-bottom">
                    <small>
                      {place.status || "Sem atualização recente"}
                    </small>

                    <span>
                      <MapPin size={13} />
                      {place.endereco || "Endereço não informado"}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="atualizar-local-empty">
              <h3>Nenhum local encontrado</h3>
              <p>Tente buscar por outro nome, categoria ou bairro.</p>
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default AtualizarLocal;