import db from "../config/db.js";

export async function listarMidiasDoLocal(req, res) {
  try {
    const { localId } = req.params;

    const [midias] = await db.execute(
      `
      SELECT
        m.id,
        m.local_id,
        m.usuario_id,
        m.tipo,
        m.url,
        m.thumbnail,
        m.criado_em,
        u.nome AS usuario_nome,
        u.usuario AS usuario_username,
        u.foto_perfil AS usuario_foto
      FROM midias m
      LEFT JOIN usuarios u
        ON u.id = m.usuario_id
      WHERE m.local_id = ?
      ORDER BY m.criado_em DESC
      `,
      [localId]
    );

    return res.json(midias);
  } catch (error) {
    console.error("Erro ao listar mídias:", error);

    return res.status(500).json({
      erro: "Erro ao buscar mídias do local",
      detalhe: error.message,
    });
  }
}

export async function criarMidia(req, res) {
  try {
    const {
      local_id,
      usuario_id,
      tipo,
      url,
      thumbnail,
    } = req.body;

    if (!local_id || !tipo || !url) {
      return res.status(400).json({
        erro: "Local, tipo e URL são obrigatórios",
      });
    }

    if (!["foto", "video"].includes(tipo)) {
      return res.status(400).json({
        erro: "O tipo deve ser foto ou video",
      });
    }

    const [resultado] = await db.execute(
      `
      INSERT INTO midias
      (
        local_id,
        usuario_id,
        tipo,
        url,
        thumbnail
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        local_id,
        usuario_id || null,
        tipo,
        url,
        thumbnail || null,
      ]
    );

    const [midiasCriadas] = await db.execute(
      `
      SELECT *
      FROM midias
      WHERE id = ?
      `,
      [resultado.insertId]
    );

    return res.status(201).json(midiasCriadas[0]);
  } catch (error) {
    console.error("Erro ao criar mídia:", error);

    return res.status(500).json({
      erro: "Erro ao salvar mídia",
      detalhe: error.message,
    });
  }
}

export async function excluirMidia(req, res) {
  try {
    const { id } = req.params;

    const [resultado] = await db.execute(
      "DELETE FROM midias WHERE id = ?",
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Mídia não encontrada",
      });
    }

    return res.json({
      mensagem: "Mídia excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir mídia:", error);

    return res.status(500).json({
      erro: "Erro ao excluir mídia",
      detalhe: error.message,
    });
  }
}