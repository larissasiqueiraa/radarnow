import db from "../config/db.js";

function montarUrlFoto(req, nomeArquivo) {
  if (!nomeArquivo) {
    return null;
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    `${req.protocol}://${req.get("host")}`;

  return `${backendUrl}/uploads/${nomeArquivo}`;
}

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
      [id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const usuario = usuarios[0];

    const [favoritos] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM favoritos
      WHERE usuario_id = ?
      `,
      [id]
    );

    const [avaliacoes] = await db.execute(
      `
      SELECT COUNT(*) AS total
      FROM avaliacoes
      WHERE usuario_id = ?
      `,
      [id]
    );

    return res.json({
      ...usuario,
      totalFavoritos: Number(favoritos[0]?.total || 0),
      totalAvaliacoes: Number(avaliacoes[0]?.total || 0),
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);

    return res.status(500).json({
      erro: "Erro ao buscar perfil",
      detalhes: error.message,
    });
  }
}

// ATUALIZAR PERFIL
export async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { nome, usuario } = req.body;

    if (!nome?.trim() || !usuario?.trim()) {
      return res.status(400).json({
        erro: "Nome e usuário são obrigatórios",
      });
    }

    const [usuarioAtualResult] = await db.execute(
      `
      SELECT foto_perfil
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    if (usuarioAtualResult.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    const usuarioAtual = usuarioAtualResult[0];

    const fotoPerfil = req.file
      ? montarUrlFoto(req, req.file.filename)
      : usuarioAtual.foto_perfil;

    await db.execute(
      `
      UPDATE usuarios
      SET nome = ?, usuario = ?, foto_perfil = ?
      WHERE id = ?
      `,
      [nome.trim(), usuario.trim(), fotoPerfil, id]
    );

    const [usuarios] = await db.execute(
      `
      SELECT id, nome, usuario, email, foto_perfil
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    return res.json({
      mensagem: "Perfil atualizado com sucesso",
      usuario: usuarios[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);

    return res.status(500).json({
      erro: "Erro ao atualizar usuário",
      detalhes: error.message,
    });
  }
}