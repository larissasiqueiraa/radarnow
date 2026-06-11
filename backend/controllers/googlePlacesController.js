import pool from "../config/db.js";

function mostrarChaveParcial(apiKey) {
  if (!apiKey) return "SEM CHAVE";
  return `${apiKey.slice(0, 10)}...${apiKey.slice(-6)}`;
}

function extrairBairro(endereco) {
  if (!endereco) {
    return "Florianópolis";
  }

  const bairrosConhecidos = [
    "Lagoa da Conceição",
    "Centro",
    "Rio Tavares",
    "Campeche",
    "Coqueiros",
    "Saco dos Limões",
    "Córrego Grande",
    "Trindade",
    "Estreito",
    "Jurerê",
    "Jurerê Internacional",
    "Ingleses",
    "Canasvieiras",
    "Ribeirão da Ilha",
    "Santa Mônica",
    "Itacorubi",
    "Agronômica",
    "Beira-Mar",
    "Carvoeira",
    "Pantanal",
    "João Paulo",
    "Santo Antônio de Lisboa",
    "Cacupé",
    "Ratones",
    "Vargem Grande",
    "Vargem Pequena",
    "Barra da Lagoa",
    "Morro das Pedras",
    "Armação",
    "Pântano do Sul",
    "Tapera",
    "Carianos",
    "Abraão",
    "Capoeiras",
    "Kobrasol",
    "Campinas",
    "São José",
    "Palhoça",
  ];

  const enderecoNormalizado = endereco.toLowerCase();

  const bairroEncontrado = bairrosConhecidos.find((bairro) =>
    enderecoNormalizado.includes(bairro.toLowerCase())
  );

  if (bairroEncontrado) {
    return bairroEncontrado;
  }

  const partesComTraco = endereco.split(" - ").map((parte) => parte.trim());

  if (partesComTraco.length >= 2) {
    const possivelBairro = partesComTraco[partesComTraco.length - 2]
      .split(",")[0]
      .replace(/\d+/g, "")
      .replace(/loja/gi, "")
      .replace(/sala/gi, "")
      .replace(/box/gi, "")
      .replace(/container/gi, "")
      .replace(/nº/gi, "")
      .replace(/n°/gi, "")
      .trim();

    if (possivelBairro) {
      return possivelBairro;
    }
  }

  const partesVirgula = endereco.split(",").map((parte) => parte.trim());

  if (partesVirgula.length >= 2) {
    const possivelBairro = partesVirgula[1]
      .replace(/\d+/g, "")
      .replace(/loja/gi, "")
      .replace(/sala/gi, "")
      .replace(/box/gi, "")
      .replace(/container/gi, "")
      .replace(/nº/gi, "")
      .replace(/n°/gi, "")
      .trim();

    if (possivelBairro) {
      return possivelBairro;
    }
  }

  return "Florianópolis";
}

function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function buscarLugaresGoogle(req, res) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    console.log("CHAVE USADA PELO BACKEND:", mostrarChaveParcial(apiKey));

    if (!apiKey) {
      return res.status(500).json({
        erro: "Chave da Google Places API não configurada no backend.",
      });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
      `?location=-27.6729,-48.5027` +
      `&radius=8000` +
      `&type=restaurant` +
      `&language=pt-BR` +
      `&key=${apiKey}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("STATUS GOOGLE LEGACY HTTP:", resposta.status);
    console.log("STATUS GOOGLE LEGACY:", dados.status);

    if (!resposta.ok || dados.status !== "OK") {
      return res.status(400).json({
        erro: "Erro ao buscar lugares no Google Places Legacy.",
        detalhes: dados,
      });
    }

    const lugares = (dados.results || []).map((place) => ({
      google_place_id: place.place_id,
      nome: place.name || "Sem nome",
      endereco: place.vicinity || "",
      bairro: extrairBairro(place.vicinity || ""),
      nota: place.rating || null,
      lat: place.geometry?.location?.lat || null,
      lng: place.geometry?.location?.lng || null,
      tipos: place.types || [],
      foto_google: place.photos?.[0]?.photo_reference || null,
    }));

    return res.json(lugares);
  } catch (error) {
    console.error("Erro ao buscar lugares:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar lugares.",
      detalhes: error.message,
    });
  }
}

async function buscarFotoLegacyPorPlaceId(placeId, apiKey) {
  try {
    if (!placeId) {
      return null;
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=photos` +
      `&language=pt-BR` +
      `&key=${apiKey}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("DETAILS LEGACY STATUS HTTP:", resposta.status);
    console.log("DETAILS LEGACY STATUS GOOGLE:", dados.status);

    if (!resposta.ok || dados.status !== "OK") {
      return null;
    }

    return dados.result?.photos?.[0]?.photo_reference || null;
  } catch (error) {
    console.error("Erro ao buscar foto na API legacy:", error);
    return null;
  }
}

async function buscarMelhorFoto(place, apiKey) {
  const fotoDoTextSearch = place.photos?.[0]?.photo_reference || null;

  if (fotoDoTextSearch) {
    return fotoDoTextSearch;
  }

  const googlePlaceId = place.place_id;

  const fotoLegacy = await buscarFotoLegacyPorPlaceId(googlePlaceId, apiKey);

  if (fotoLegacy) {
    return fotoLegacy;
  }

  return null;
}

export async function importarLugaresGoogle(req, res) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    console.log("CHAVE USADA PELO BACKEND:", mostrarChaveParcial(apiKey));

    if (!apiKey) {
      return res.status(500).json({
        erro: "Chave da Google Places API não configurada no backend.",
      });
    }

    const { termo, categoria } = req.body;

    if (!termo || !categoria) {
      return res.status(400).json({
        erro: "Informe termo e categoria.",
      });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${encodeURIComponent(termo)}` +
      `&language=pt-BR` +
      `&region=br` +
      `&key=${apiKey}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    console.log("STATUS GOOGLE TEXT LEGACY HTTP:", resposta.status);
    console.log("STATUS GOOGLE TEXT LEGACY:", dados.status);

    if (!resposta.ok || dados.status !== "OK") {
      return res.status(400).json({
        erro: "Erro ao buscar lugares no Google Places Text Search Legacy.",
        detalhes: dados,
      });
    }

    const lugares = dados.results || [];

    let inseridosOuAtualizados = 0;
    const lugaresSalvos = [];

    for (const place of lugares) {
      const googlePlaceId = place.place_id;
      const nome = place.name || "Sem nome";
      const endereco = place.formatted_address || place.vicinity || "";
      const bairro = extrairBairro(endereco);
      const nota = place.rating || null;
      const lat = place.geometry?.location?.lat || null;
      const lng = place.geometry?.location?.lng || null;
      const tipos = JSON.stringify(place.types || []);

      if (!googlePlaceId || !nome || !lat || !lng) {
        continue;
      }

      const fotoGoogle = await buscarMelhorFoto(place, apiKey);

      await pool.query(
        `
        INSERT INTO locais
          (
            google_place_id,
            nome,
            categoria,
            endereco,
            bairro,
            nota,
            lat,
            lng,
            tipos,
            foto_google,
            origem
          )
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          nome = VALUES(nome),
          categoria = VALUES(categoria),
          endereco = VALUES(endereco),
          bairro = VALUES(bairro),
          nota = VALUES(nota),
          lat = VALUES(lat),
          lng = VALUES(lng),
          tipos = VALUES(tipos),
          foto_google = COALESCE(VALUES(foto_google), foto_google),
          origem = VALUES(origem)
        `,
        [
          googlePlaceId,
          nome,
          categoria,
          endereco,
          bairro,
          nota,
          lat,
          lng,
          tipos,
          fotoGoogle,
          "google_text",
        ]
      );

      inseridosOuAtualizados++;

      lugaresSalvos.push({
        google_place_id: googlePlaceId,
        nome,
        categoria,
        endereco,
        bairro,
        nota,
        lat,
        lng,
        foto_google: fotoGoogle,
      });

      await esperar(120);
    }

    return res.json({
      mensagem: "Importação finalizada.",
      termo,
      categoria,
      totalEncontrado: lugares.length,
      totalSalvo: inseridosOuAtualizados,
      lugares: lugaresSalvos,
    });
  } catch (error) {
    console.error("Erro ao importar lugares:", error);

    return res.status(500).json({
      erro: "Erro interno ao importar lugares.",
      detalhes: error.message,
    });
  }
}

export async function atualizarFotosLocais(req, res) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    console.log("CHAVE USADA PELO BACKEND:", mostrarChaveParcial(apiKey));

    if (!apiKey) {
      return res.status(500).json({
        erro: "Chave da Google Places API não configurada no backend.",
      });
    }

    const limite = Number(req.body?.limite) || 120;

    const [locais] = await pool.query(
      `
      SELECT 
        id,
        nome,
        google_place_id
      FROM locais
      WHERE 
        (foto_google IS NULL OR foto_google = '')
        AND google_place_id IS NOT NULL
        AND google_place_id <> ''
      LIMIT ?
      `,
      [limite]
    );

    let atualizados = 0;
    let semFotoNaApi = 0;
    let erros = 0;

    const resultados = [];

    for (const local of locais) {
      try {
        const fotoGoogle = await buscarFotoLegacyPorPlaceId(
          local.google_place_id,
          apiKey
        );

        if (!fotoGoogle) {
          semFotoNaApi++;

          resultados.push({
            id: local.id,
            nome: local.nome,
            status: "SEM_FOTO",
          });

          await esperar(150);
          continue;
        }

        await pool.query(
          `
          UPDATE locais
          SET foto_google = ?
          WHERE id = ?
          `,
          [fotoGoogle, local.id]
        );

        atualizados++;

        resultados.push({
          id: local.id,
          nome: local.nome,
          status: "ATUALIZADO",
        });

        await esperar(150);
      } catch (error) {
        erros++;

        resultados.push({
          id: local.id,
          nome: local.nome,
          status: "ERRO",
          mensagem: error.message,
        });
      }
    }

    return res.json({
      mensagem: "Atualização de fotos concluída.",
      totalVerificado: locais.length,
      atualizados,
      semFotoNaApi,
      erros,
      resultados,
    });
  } catch (error) {
    console.error("Erro ao atualizar fotos dos locais:", error);

    return res.status(500).json({
      erro: "Erro ao atualizar fotos dos locais.",
      detalhes: error.message,
    });
  }
}

export async function buscarFotoGoogle(req, res) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const { name } = req.query;

    console.log("CHAVE USADA PELO BACKEND:", mostrarChaveParcial(apiKey));

    if (!apiKey) {
      return res.status(500).json({
        erro: "Chave da Google Places API não configurada no backend.",
      });
    }

    if (!name) {
      return res.status(400).json({
        erro: "Nome da foto não informado.",
      });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/photo` +
      `?maxwidth=800` +
      `&photo_reference=${encodeURIComponent(name)}` +
      `&key=${apiKey}`;

    const resposta = await fetch(url);

    console.log("STATUS FOTO GOOGLE:", resposta.status);
    console.log(
      "CONTENT TYPE FOTO GOOGLE:",
      resposta.headers.get("content-type")
    );

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        erro: "Erro ao buscar foto no Google Places.",
      });
    }

    const contentType = resposta.headers.get("content-type") || "image/jpeg";
    const imagemBuffer = Buffer.from(await resposta.arrayBuffer());

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.send(imagemBuffer);
  } catch (error) {
    console.error("Erro ao buscar foto:", error);

    return res.status(500).json({
      erro: "Erro interno ao buscar foto.",
      detalhes: error.message,
    });
  }
}