import "./Busca.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Star, Heart } from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useToast } from "../../components/Toast/Toast.jsx";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://radarnow-production.up.railway.app";

function Busca() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [locais, setLocais] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [search, setSearch] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");
  const [carregando, setCarregando] = useState(true);

  const categorias = [
    { label: "Todos", value: "Todos" },
    { label: "Baladas", value: "Balada" },
    { label: "Restaurantes", value: "Restaurante" },
    { label: "Academias", value: "Academia" },
    { label: "Bares", value: "Bar" },
  ];

  useEffect(() => {
    carregarLocais();
    carregarFavoritos();
  }, []);

  async function carregarFavoritos() {
    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      setFavoritos([]);
      return;
    }

    const usuarioAtual = JSON.parse(usuarioSalvo);

    try {
      const resposta = await fetch(
        `${API_URL}/api/favoritos/${usuarioAtual.id}`
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error(dados.erro || "Erro ao carregar favoritos");
        return;
      }

      const ids = dados.map((item) => Number(item.local_id));
      setFavoritos(ids);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    }
  }

  async function carregarLocais() {
    try {
      setCarregando(true);

      const resposta = await fetch(`${API_URL}/api/locais`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro ao buscar locais:", dados);
        setLocais([]);
        return;
      }

      setLocais(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
      setLocais([]);
    } finally {
      setCarregando(false);
    }
  }

  async function alternarFavorito(event, id) {
    event.preventDefault();

    const usuarioSalvo = localStorage.getItem("radarnow_usuario");

    if (!usuarioSalvo) {
      navigate("/login");
      return;
    }

    const usuarioAtual = JSON.parse(usuarioSalvo);
    const jaFavoritado = favoritos.includes(id);

    try {
      if (jaFavoritado) {
        const resposta = await fetch(
          `${API_URL}/api/favoritos/${usuarioAtual.id}/${id}`,
          {
            method: "DELETE",
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          showToast(dados.erro || "Erro ao remover favorito.", "error");
          return;
        }

        setFavoritos((atual) =>
          atual.filter((favoritoId) => favoritoId !== id)
        );

        showToast("Local removido dos favoritos.", "success");
      } else {
        const resposta = await fetch(`${API_URL}/api/favoritos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: usuarioAtual.id,
            local_id: id,
          }),
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
          showToast(dados.erro || "Erro ao adicionar favorito.", "error");
          return;
        }

        setFavoritos((atual) => [...atual, id]);

        showToast("Local adicionado aos favoritos.", "success");
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
      showToast("Não foi possível atualizar o favorito.", "error");
    }
  }

  function normalizarTexto(texto) {
    return String(texto || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function getTiposTexto(tipos) {
    if (!tipos) {
      return "";
    }

    if (Array.isArray(tipos)) {
      return tipos.join(" ");
    }

    try {
      const tiposConvertidos = JSON.parse(tipos);

      if (Array.isArray(tiposConvertidos)) {
        return tiposConvertidos.join(" ");
      }
    } catch (error) {
      return String(tipos);
    }

    return String(tipos);
  }

  function getCategoriaNormalizada(local) {
    const categoria = normalizarTexto(local.categoria);
    const tipos = normalizarTexto(getTiposTexto(local.tipos));
    const nome = normalizarTexto(local.nome);

    if (
      categoria.includes("balada") ||
      categoria.includes("night_club") ||
      tipos.includes("night_club") ||
      tipos.includes("night club") ||
      nome.includes("no class") ||
      nome.includes("posh") ||
      nome.includes("p12") ||
      nome.includes("milk")
    ) {
      return "Balada";
    }

    if (
      categoria.includes("restaurante") ||
      categoria.includes("restaurant") ||
      tipos.includes("restaurant") ||
      tipos.includes("meal_takeaway") ||
      tipos.includes("food")
    ) {
      return "Restaurante";
    }

    if (
      categoria.includes("academia") ||
      categoria.includes("gym") ||
      tipos.includes("gym")
    ) {
      return "Academia";
    }

    if (categoria.includes("bar") || tipos.includes("bar")) {
      return "Bar";
    }

    return local.categoria || "Local";
  }

  function limparBairro(bairro) {
    if (!bairro) {
      return "Florianópolis";
    }

    const bairroLimpo = String(bairro)
      .replace(/^\d+\s*-\s*/g, "")
      .replace(/^loja\s*\d+\s*-\s*/gi, "")
      .trim();

    return bairroLimpo || "Florianópolis";
  }

  function getImagemClasse(categoria = "") {
    switch (categoria) {
      case "Balada":
        return "image-stage";

      case "Restaurante":
        return "image-restaurant";

      case "Academia":
        return "image-gym";

      case "Bar":
        return "image-bar";

      default:
        return "image-stage";
    }
  }

  function getFotoUrl(fotoGoogle) {
    if (!fotoGoogle) {
      return null;
    }

    return `${API_URL}/api/google-places/foto?name=${encodeURIComponent(
      fotoGoogle
    )}`;
  }

  function deveEsconderLocal(local) {
    const nome = normalizarTexto(local.nome);
    const bairro = normalizarTexto(local.bairro);
    const endereco = normalizarTexto(local.endereco);

    const smartFitCampeche =
      nome.includes("smart fit") &&
      (bairro.includes("campeche") || endereco.includes("campeche"));

    return smartFitCampeche;
  }

  function buscaDiretaCombina(local, termoDigitado) {
    const busca = normalizarTexto(termoDigitado);

    if (!busca) {
      return true;
    }

    const categoriaNormalizada = getCategoriaNormalizada(local);
    const tiposTexto = getTiposTexto(local.tipos);

    const textoCompleto = normalizarTexto(`
      ${local.nome || ""}
      ${categoriaNormalizada || ""}
      ${local.categoria || ""}
      ${local.bairro || ""}
      ${local.endereco || ""}
      ${tiposTexto || ""}
    `);

    return textoCompleto.includes(busca);
  }

  const locaisVisiveis = locais.filter((local) => !deveEsconderLocal(local));

  const locaisSemDuplicados = locaisVisiveis.filter((local, index, array) => {
    const nomeAtual = normalizarTexto(local.nome);

    return (
      index ===
      array.findIndex((item) => normalizarTexto(item.nome) === nomeAtual)
    );
  });

  const lugaresFiltrados = locaisSemDuplicados.filter((local) => {
    const termoDigitado = search.trim();
    const categoriaNormalizada = getCategoriaNormalizada(local);

    const combinaBusca = buscaDiretaCombina(local, termoDigitado);

    const combinaCategoria =
      categoriaAtiva === "Todos" || categoriaNormalizada === categoriaAtiva;

    return combinaBusca && combinaCategoria;
  });

  return (
    <main className="radarnow-busca-page">
      <Header />

      <div className="busca-content">
        <button
          type="button"
          className="busca-back-btn"
          onClick={() => navigate("/")}
          aria-label="Voltar para Home"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="busca-header">
          <h1>Buscar locais</h1>
          <p>Encontre lugares e veja como está o movimento agora.</p>
        </header>

        <section className="busca-search-box">
          <Search size={18} />

          <input
            className="busca-input"
            type="text"
            placeholder="Buscar por balada, restaurante, academia ou bar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </section>

        <section className="busca-filters">
          {categorias.map((categoria) => (
            <button
              key={categoria.value}
              type="button"
              className={categoriaAtiva === categoria.value ? "active" : ""}
              onClick={() => setCategoriaAtiva(categoria.value)}
            >
              {categoria.label}
            </button>
          ))}
        </section>

        <section className="busca-list">
          {carregando ? (
            <div className="busca-empty">
              <h3>Carregando locais...</h3>
              <p>Buscando lugares cadastrados no Radar Now.</p>
            </div>
          ) : lugaresFiltrados.length > 0 ? (
            lugaresFiltrados.map((local) => {
              const categoriaNormalizada = getCategoriaNormalizada(local);
              const imagemClasse =
                local.imagem || getImagemClasse(categoriaNormalizada);

              const fotoUrl = getFotoUrl(local.foto_google);
              const bairroLimpo = limparBairro(local.bairro);
              const localFavoritado = favoritos.includes(Number(local.id));

              return (
                <Link
                  to={`/local/${local.id}`}
                  className="busca-card"
                  key={local.id}
                >
                  <div
                    className={
                      fotoUrl
                        ? "busca-card-image"
                        : `busca-card-image ${imagemClasse}`
                    }
                  >
                    {fotoUrl && <img src={fotoUrl} alt={local.nome} />}

                    <button
                      type="button"
                      className={
                        localFavoritado
                          ? "busca-favorite active"
                          : "busca-favorite"
                      }
                      onClick={(event) =>
                        alternarFavorito(event, Number(local.id))
                      }
                      aria-label={
                        localFavoritado
                          ? "Remover dos favoritos"
                          : "Adicionar aos favoritos"
                      }
                    >
                      <Heart
                        size={16}
                        fill={localFavoritado ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="busca-card-info">
                    <div className="busca-card-top">
                      <h3>{local.nome}</h3>
                    </div>

                    <p className="busca-category">
                      {categoriaNormalizada} • {bairroLimpo}
                    </p>

                    <div className="busca-bottom">
                      <small>{local.status || "Sem atualização agora"}</small>

                      <span className="busca-rating-bottom">
                        <Star size={13} fill="currentColor" />
                        {local.nota || "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="busca-empty">
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

export default Busca;