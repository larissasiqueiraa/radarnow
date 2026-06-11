import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Footer from "../../components/Footer/Footer";
import "./Mapa.css";

const filtros = [
  { label: "Todos", value: "todos" },
  { label: "Baladas", value: "Balada" },
  { label: "Restaurantes", value: "Restaurante" },
  { label: "Academias", value: "Academia" },
  { label: "Bares", value: "Bar" },
];

function Mapa() {
  const navigate = useNavigate();

  const [locais, setLocais] = useState([]);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [filtroAtivo, setFiltroAtivo] = useState("todos");
  const [carregandoLocais, setCarregandoLocais] = useState(true);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const centroFloripa = {
    lat: -27.5954,
    lng: -48.548,
  };

  useEffect(() => {
    carregarLocais();
  }, []);

  async function carregarLocais() {
    try {
      setCarregandoLocais(true);

      const resposta = await fetch("http://localhost:5001/api/locais");
      const dados = await resposta.json();

      if (!resposta.ok) {
        console.log("Erro ao buscar locais:", dados);
        setLocais([]);
        return;
      }

      setLocais(Array.isArray(dados) ? dados : []);
    } catch (error) {
      console.log("Erro ao carregar locais:", error);
      setLocais([]);
    } finally {
      setCarregandoLocais(false);
    }
  }

  function trocarFiltro(filtro) {
    setFiltroAtivo(filtro);
    setLocalSelecionado(null);
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

  function getCategoriaConfig(categoria) {
    switch (categoria) {
      case "Balada":
        return {
          cor: "#8b5cf6",
        };

      case "Restaurante":
        return {
          cor: "#f97316",
        };

      case "Academia":
        return {
          cor: "#22c55e",
        };

      case "Bar":
        return {
          cor: "#06b6d4",
        };

      default:
        return {
          cor: "#7c3aed",
        };
    }
  }

  function criarIconePin(categoria) {
    if (!window.google) {
      return undefined;
    }

    const config = getCategoriaConfig(categoria);

    const svg = `
      <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <filter id="shadow" x="0" y="0" width="22" height="28" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.35"/>
        </filter>

        <path 
          filter="url(#shadow)"
          d="M11 1.5C6 1.5 2 5.5 2 10.5C2 17.5 11 26.5 11 26.5C11 26.5 20 17.5 20 10.5C20 5.5 16 1.5 11 1.5Z" 
          fill="${config.cor}"
        />

        <circle 
          cx="11" 
          cy="10.5" 
          r="4.2" 
          fill="rgba(255,255,255,0.22)" 
          stroke="rgba(255,255,255,0.55)" 
          stroke-width="0.8"
        />

        <circle 
          cx="11" 
          cy="10.5" 
          r="2" 
          fill="white" 
          fill-opacity="0.9"
        />
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(22, 28),
      anchor: new window.google.maps.Point(11, 28),
    };
  }

  const locaisSemDuplicados = locais.filter((local, index, array) => {
    const nomeAtual = normalizarTexto(local.nome);

    return (
      index ===
      array.findIndex((item) => normalizarTexto(item.nome) === nomeAtual)
    );
  });

  const locaisComCoordenadas = locaisSemDuplicados.filter((local) => {
    const lat = Number(local.lat);
    const lng = Number(local.lng);

    const coordenadaValida =
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      lat !== 0 &&
      lng !== 0;

    return coordenadaValida;
  });

  const locaisFiltrados = locaisComCoordenadas.filter((local) => {
    if (filtroAtivo === "todos") {
      return true;
    }

    return getCategoriaNormalizada(local) === filtroAtivo;
  });

  if (loadError) {
    return (
      <main className="mapa-page">
        <p className="mapa-message">Erro ao carregar o mapa.</p>
        <Footer />
      </main>
    );
  }

  if (!isLoaded || carregandoLocais) {
    return (
      <main className="mapa-page">
        <p className="mapa-message">Carregando mapa...</p>
        <Footer />
      </main>
    );
  }

  return (
    <main className="mapa-page">
      <header className="mapa-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mapa-back"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Mapa</h1>
          <p>{locaisFiltrados.length} lugares encontrados</p>
        </div>
      </header>

      <section className="mapa-filtros">
        {filtros.map((filtro) => (
          <button
            key={filtro.value}
            type="button"
            className={
              filtroAtivo === filtro.value
                ? "mapa-filtro active"
                : "mapa-filtro"
            }
            onClick={() => trocarFiltro(filtro.value)}
          >
            {filtro.label}
          </button>
        ))}
      </section>

      <section className="mapa-container">
        <GoogleMap
          mapContainerClassName="google-map"
          center={centroFloripa}
          zoom={11}
          options={{
            fullscreenControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: true,
          }}
          onClick={() => setLocalSelecionado(null)}
        >
          {locaisFiltrados.map((local) => {
            const categoriaNormalizada = getCategoriaNormalizada(local);

            return (
              <Marker
                key={local.id}
                position={{
                  lat: Number(local.lat),
                  lng: Number(local.lng),
                }}
                title={local.nome}
                icon={criarIconePin(categoriaNormalizada)}
                onClick={() =>
                  setLocalSelecionado({
                    ...local,
                    categoriaNormalizada,
                  })
                }
              />
            );
          })}

          {localSelecionado && (
            <InfoWindow
              position={{
                lat: Number(localSelecionado.lat),
                lng: Number(localSelecionado.lng),
              }}
              onCloseClick={() => setLocalSelecionado(null)}
            >
              <div className="mapa-info-card">
                <h3>{localSelecionado.nome}</h3>

                <p className="mapa-info-status">
                  {localSelecionado.categoriaNormalizada ||
                    getCategoriaNormalizada(localSelecionado)}
                </p>

                <div className="mapa-info-details">
                  <span>
                    <MapPin size={13} />
                    {localSelecionado.bairro || "Florianópolis"}
                  </span>

                  <span>
                    <Star size={13} fill="currentColor" />
                    {localSelecionado.nota || "—"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/local/${localSelecionado.id}`)}
                >
                  Ver detalhes
                </button>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </section>

      <Footer />
    </main>
  );
}

export default Mapa;