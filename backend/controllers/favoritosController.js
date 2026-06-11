import db from "../config/db.js";

export async function adicionarFavorito(req, res) {
  try {
    const { usuario_id, local_id } = req.body;

    if (!usuario_id || !local_id) {
      return res.status(400).json({
        erro: "usuario_id e local_id são obrigatórios",
      });
    }

    const [favoritoExistente] = await db.execute(
      `
      SELECT * FROM favoritos
      WHERE usuario_id = ? AND local_id = ?
      `,
      [usuario_id, local_id]
    );

    if (favoritoExistente.length > 0) {
      return res.status(200).json({
        mensagem: "Local já estava nos favoritos",
      });
    }

    await db.execute(
      `
      INSERT INTO favoritos
      (usuario_id, local_id)
      VALUES (?, ?)
      `,
      [usuario_id, local_id]
    );

    res.status(201).json({
      mensagem: "Favorito adicionado",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao adicionar favorito",
    });
  }
}

export async function listarFavoritos(req, res) {
  try {
    const { usuario_id } = req.params;

    const [favoritos] = await db.execute(
      `
      SELECT * FROM favoritos
      WHERE usuario_id = ?
      `,
      [usuario_id]
    );

    res.json(favoritos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao listar favoritos",
    });
  }
}

export async function removerFavorito(req, res) {
  try {
    const { usuario_id, local_id } = req.params;

    await db.execute(
      `
      DELETE FROM favoritos
      WHERE usuario_id = ? AND local_id = ?
      `,
      [usuario_id, local_id]
    );

    res.json({
      mensagem: "Favorito removido",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao remover favorito",
    });
  }
}