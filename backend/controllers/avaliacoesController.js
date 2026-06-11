import db from "../config/db.js";

export async function criarAvaliacao(req, res) {
  try {
    const { usuario_id, local_id, status, nota, comentario } = req.body;

    if (!usuario_id || !local_id || !status || !nota) {
      return res.status(400).json({
        erro: "Dados obrigatórios não enviados.",
      });
    }

    await db.execute(
      `
      INSERT INTO avaliacoes
      (usuario_id, local_id, status, nota, comentario)
      VALUES (?, ?, ?, ?, ?)
      `,
      [usuario_id, local_id, status, nota, comentario || status]
    );

    return res.status(201).json({
      mensagem: "Avaliação criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar avaliação:", error);

    return res.status(500).json({
      erro: "Erro ao criar avaliação",
      detalhe: error.message,
    });
  }
}

export async function listarAvaliacoes(req, res) {
  try {
    const { local_id } = req.params;

    const [avaliacoes] = await db.execute(
      `
      SELECT 
        avaliacoes.id,
        avaliacoes.usuario_id,
        avaliacoes.local_id,
        avaliacoes.status,
        avaliacoes.nota,
        avaliacoes.comentario,
        avaliacoes.criado_em,
        usuarios.nome,
        usuarios.usuario,
        usuarios.foto_perfil
      FROM avaliacoes
      INNER JOIN usuarios 
        ON avaliacoes.usuario_id = usuarios.id
      WHERE avaliacoes.local_id = ?
      ORDER BY avaliacoes.criado_em DESC
      `,
      [local_id]
    );

    return res.json(avaliacoes);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);

    return res.status(500).json({
      erro: "Erro ao buscar avaliações",
      detalhe: error.message,
    });
  }
}