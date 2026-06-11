import "./Home.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Star, Heart } from "lucide-react";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

import { getLocation } from "../../utils/gps";
import { calculateDistance } from "../../utils/distance";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarFavoritos();
    carregarLocais();
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
        `http://localhost:5001/api/favoritos/${usuarioAtual.id}`
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

      const resposta = await fetch("http://localhost:5001/api/locais");
      const dados = await resposta.json();

      if (!resposta.ok) {
        console.error("Erro ao buscar locais:", dados);
        setLocais([]);
        return;
      }

      const locaisDoBanco = Array.isArray(dados) ? dados : [];

      try {
        const location = await getLocation();

        const locaisComDistancia = locaisDoBanco.map((local) => {
          const lat = Number(local.lat);
          const lng = Number(local.lng);

          if (Number.isNaN(lat) || Number.isNaN(lng)) {
            return {
              ...local,
              distance: null,
            };
          }

          const distance = calculateDistance(
            location.lat,
            location.lng,
            lat,
            lng
          );

          return {
            ...local,
            distance,
          };
        });

        setLocais(locaisComDistancia);
      } catch (error) {
        console.log("GPS negado ou indisponível:", error);
        setLocais(locaisDoBanco);
      }
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
          `http://localhost:5001/api/favoritos/${usuarioAtual.id}/${id}`,
          {
            method: "DELETE",
          }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
          alert(dados.erro || "Erro ao remover favorito.");
          return;
        }

        setFavoritos((atual) =>
          atual.filter((favoritoId) => favoritoId !== id)
        );
      } else {
        const resposta = await fetch("http://localhost:5001/api/favoritos", {
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
          alert(dados.erro || "Erro ao adicionar favorito.");
          return;
        }

        setFavoritos((atual) => [...atual, id]);
      }
    } catch (error) {
      console.error("Erro ao alterar favorito:", error);
      alert("Não foi possível atualizar o favorito.");
    }
  }

  function normalizarTexto(texto) {
    return String(texto || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function limparBairro(bairro) {
    if (!bairro) {
      return "Florianópolis";
    }

    return String(bairro)
      .replace(/^\d+\s*-\s*/g, "")
      .replace(/^loja\s*\d+\s*-\s*/gi, "")
      .trim();
  }

  function getImagemClasse(categoria = "") {
    switch (categoria) {
      case "Balada":
        return "image-stage";

      case "Restaurante":
        return "image-restaurant";

      case "Academia":
        return "image-gym";

      case "Café":
        return "image-cafe";

      case "Bar":
        return "image-bar";

      case "Shopping":
        return "image-shopping";

      default:
        return "image-stage";
    }
  }

  function getFotoUrl(fotoGoogle) {
    if (!fotoGoogle) {
      return null;
    }

    return `http://localhost:5001/api/google-places/foto?name=${encodeURIComponent(
      fotoGoogle
    )}`;
  }

  function localTemCoordenadasValidas(local) {
    if (
      local.lat === null ||
      local.lng === null ||
      local.lat === undefined ||
      local.lng === undefined ||
      local.lat === "" ||
      local.lng === ""
    ) {
      return false;
    }

    const lat = Number(local.lat);
    const lng = Number(local.lng);

    const coordenadaValida =
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      lat !== 0 &&
      lng !== 0;

    const dentroDeFloripa =
      lat >= -27.9 &&
      lat <= -27.3 &&
      lng >= -48.8 &&
      lng <= -48.3;

    return coordenadaValida && dentroDeFloripa;
  }

  const locaisComCoordenadas = locais.filter(localTemCoordenadasValidas);

  const locaisSemDuplicados = locaisComCoordenadas.filter(
    (local, index, array) => {
      const nomeAtual = normalizarTexto(local.nome);

      return (
        index ===
        array.findIndex((item) => normalizarTexto(item.nome) === nomeAtual)
      );
    }
  );

  const locaisOrdenados = [...locaisSemDuplicados].sort((a, b) => {
    const distanciaA = a.distance ?? 999999;
    const distanciaB = b.distance ?? 999999;

    if (distanciaA !== distanciaB) {
      return distanciaA - distanciaB;
    }

    return Number(b.nota || 0) - Number(a.nota || 0);
  });

  const textoBusca = normalizarTexto(search);

  const locaisFiltrados = locaisOrdenados.filter((local) => {
    if (!textoBusca) {
      return true;
    }

    const nome = normalizarTexto(local.nome);
    const categoria = normalizarTexto(local.categoria);
    const bairro = normalizarTexto(local.bairro);
    const endereco = normalizarTexto(local.endereco);

    return (
      nome.includes(textoBusca) ||
      categoria.includes(textoBusca) ||
      bairro.includes(textoBusca) ||
      endereco.includes(textoBusca)
    );
  });

  const locaisHome = search ? locaisFiltrados : locaisFiltrados.slice(0, 6);

  return (
    <main className="home-page">
      <Header />

      <section className="home-intro">
        <h1>O que está rolando agora?</h1>
        <p>Veja movimento, fila e clima dos lugares em tempo real.</p>
      </section>

      <div className="home-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Buscar balada, restaurante, academia..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <section className="places-section">
        <div className="section-title">
          <h2>Locais rolando agora</h2>
          <Link to="/busca">Ver todos</Link>
        </div>

        <div className="places-list">
          {carregando ? (
            <div className="home-empty">
              <h3>Carregando locais...</h3>
              <p>Buscando lugares em tempo real.</p>
            </div>
          ) : locaisHome.length > 0 ? (
            locaisHome.map((place) => {
              const imagemClasse =
                place.imagem || getImagemClasse(place.categoria);

              const fotoUrl = getFotoUrl(place.foto_google);
              const bairroLimpo = limparBairro(place.bairro);

              return (
                <Link
                  to={`/local/${place.id}`}
                  className="place-card"
                  key={place.id}
                >
                  <div
                    className={
                      fotoUrl ? "place-image" : `place-image ${imagemClasse}`
                    }
                  >
                    {fotoUrl && <img src={fotoUrl} alt={place.nome} />}

                    <button
                      type="button"
                      className={
                        favoritos.includes(Number(place.id))
                          ? "place-favorite active"
                          : "place-favorite"
                      }
                      onClick={(e) => alternarFavorito(e, Number(place.id))}
                    >
                      <Heart
                        size={16}
                        fill={
                          favoritos.includes(Number(place.id))
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>

                  <div className="place-info">
                    <div className="place-top">
                      <h3>{place.nome}</h3>
                    </div>

                    <p>
                      {place.categoria || "Local"} • {bairroLimpo}
                    </p>

                    <div className="place-bottom">
                      <small>{place.status || "Sem atualização agora"}</small>

                      <span className="place-rating-bottom">
                        <Star size={13} fill="currentColor" />
                        {place.nota || "—"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="home-empty">
              <h3>Nenhum local encontrado</h3>
              <p>Tente buscar por outro nome ou categoria.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default Home;