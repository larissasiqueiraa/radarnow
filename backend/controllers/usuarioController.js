import db from "../config/db.js";

// PEGAR PERFIL
export async function buscarPerfil(req, res) {
  try {
    const { id } = req.params;

    const [usuarios] = await db.execute(
      `
      SELECT id, nome, usuario, email, foto_perfil
      FROM usuarios
      WHERE id = ?
      `,
      [id],
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const usuario = usuarios[0];

    const [favoritos] = await db.execute(
      `
      SELECT COUNT(*) as total
      FROM favoritos
      WHERE usuario_id = ?
      `,
      [id],
    );

    const [avaliacoes] = await db.execute(
      `
      SELECT COUNT(*) as total
      FROM avaliacoes
      WHERE usuario_id = ?
      `,
      [id],
    );

    res.json({
      ...usuario,
      totalFavoritos: favoritos[0].total,
      totalAvaliacoes: avaliacoes[0].total,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao buscar perfil",
    });
  }
}

// ATUALIZAR PERFIL (UPLOAD CORRIGIDO)
export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, usuario } = req.body;

    if (!nome || !usuario) {
      return res.status(400).json({
        erro: "Nome e usuário são obrigatórios",
      });
    }

    // 🔥 pega foto atual do banco
    const [usuarioAtualResult] = await db.execute(
      "SELECT foto_perfil FROM usuarios WHERE id = ?",
      [id],
    );

    const usuarioAtual = usuarioAtualResult[0];

    // 🔥 nova foto ou mantém a antiga
    const foto_perfil = req.file
      ? `http://localhost:5001/uploads/${req.file.filename}`
      : usuarioAtual.foto_perfil;

    const [resultado] = await db.execute(
      `
      UPDATE usuarios
      SET nome = ?, usuario = ?, foto_perfil = ?
      WHERE id = ?
      `,
      [nome, usuario, foto_perfil, id],
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const [usuarios] = await db.execute(
      `
      SELECT id, nome, usuario, email, foto_perfil
      FROM usuarios
      WHERE id = ?
      `,
      [id],
    );

    res.json({
      mensagem: "Perfil atualizado com sucesso",
      usuario: usuarios[0],
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      erro: "Erro ao atualizar usuário",
    });
  }
}