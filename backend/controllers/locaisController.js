import pool from "../config/db.js";

/*
|--------------------------------------------------------------------------
| CORRIGIR URL DAS IMAGENS
|--------------------------------------------------------------------------
*/

function corrigirUrlImagem(url) {
  if (!url || typeof url !== "string") {
    return url;
  }

  return url.replace(
    /^http:\/\/radarnow-production\.up\.railway\.app/i,
    "https://radarnow-production.up.railway.app"
  );
}

/*
|--------------------------------------------------------------------------
| FORMATAR LOCAL
|--------------------------------------------------------------------------
*/

function formatarLocal(local) {
  return {
    ...local,

    tipos:
      typeof local.tipos === "string"
        ? JSON.parse(local.tipos || "[]")
        : local.tipos || [],

    foto_google: corrigirUrlImagem(
      local.foto_google
    ),
  };
}

/*
|--------------------------------------------------------------------------
| LISTAR LOCAIS
|--------------------------------------------------------------------------
*/

export async function listarLocais(req, res) {
  try {
    const [locais] = await pool.query(`
      SELECT
        id,
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
        origem,
        criado_em
      FROM locais
      ORDER BY nome ASC
    `);

    const locaisFormatados =
      locais.map(formatarLocal);

    res.json(locaisFormatados);
  } catch (error) {
    console.error(
      "Erro ao listar locais:",
      error
    );

    res.status(500).json({
      erro: "Erro ao listar locais.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| BUSCAR LOCAL POR ID
|--------------------------------------------------------------------------
*/

export async function buscarLocalPorId(
  req,
  res
) {
  try {
    const { id } = req.params;

    const [locais] = await pool.query(
      `
      SELECT
        id,
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
        origem,
        criado_em
      FROM locais
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    if (locais.length === 0) {
      return res.status(404).json({
        erro: "Local não encontrado.",
      });
    }

    res.json(
      formatarLocal(locais[0])
    );
  } catch (error) {
    console.error(
      "Erro ao buscar local:",
      error
    );

    res.status(500).json({
      erro: "Erro ao buscar local.",
    });
  }
}