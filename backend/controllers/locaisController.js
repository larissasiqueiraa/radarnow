import pool from "../config/db.js";

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

    const locaisFormatados = locais.map((local) => ({
      ...local,
      tipos:
        typeof local.tipos === "string"
          ? JSON.parse(local.tipos || "[]")
          : local.tipos || [],
    }));

    res.json(locaisFormatados);
  } catch (error) {
    console.error("Erro ao listar locais:", error);

    res.status(500).json({
      erro: "Erro ao listar locais.",
    });
  }
}

export async function buscarLocalPorId(req, res) {
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

    const local = locais[0];

    const localFormatado = {
      ...local,
      tipos:
        typeof local.tipos === "string"
          ? JSON.parse(local.tipos || "[]")
          : local.tipos || [],
    };

    res.json(localFormatado);
  } catch (error) {
    console.error("Erro ao buscar local:", error);

    res.status(500).json({
      erro: "Erro ao buscar local.",
    });
  }
}