import db from "../config/db.js";
import { moderarTexto } from "../utils/moderacaoTexto.js";

function montarUrlMidia(req) {
  if (!req.file) {
    return null;
  }

  return `${req.protocol}://${req.get("host")}/uploads/midias/${
    req.file.filename
  }`;
}

function descobrirTipoMidia(arquivo) {
  if (!arquivo) {
    return null;
  }

  if (arquivo.mimetype.startsWith("video/")) {
    return "video";
  }

  return "foto";
}

export async function criarAvaliacao(req, res) {
  const connection = await db.getConnection();

  try {
    const {
      usuario_id,
      local_id,
      status,
      nota,
      comentario,
    } = req.body;

    if (!usuario_id || !local_id || !status || !nota) {
      return res.status(400).json({
        erro: "Dados obrigatórios não enviados.",
      });
    }

    const textoParaModerar =
      comentario?.trim() || status;

    const resultadoModeracao =
      moderarTexto(textoParaModerar);

    if (!resultadoModeracao.aprovado) {
      return res.status(400).json({
        erro:
          resultadoModeracao.motivo ||
          "Conteúdo não permitido.",
      });
    }

    await connection.beginTransaction();

    const [resultadoAvaliacao] = await connection.execute(
      `
      INSERT INTO avaliacoes
      (
        usuario_id,
        local_id,
        status,
        nota,
        comentario
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        Number(usuario_id),
        Number(local_id),
        status,
        Number(nota),
        comentario?.trim() || status,
      ]
    );

    const avaliacaoId = resultadoAvaliacao.insertId;

    let midiaCriada = null;

    if (req.file) {
      const tipo = descobrirTipoMidia(req.file);
      const url = montarUrlMidia(req);

      const [resultadoMidia] = await connection.execute(
        `
        INSERT INTO midias
        (
          local_id,
          usuario_id,
          avaliacao_id,
          tipo,
          url,
          thumbnail
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          Number(local_id),
          Number(usuario_id),
          avaliacaoId,
          tipo,
          url,
          null,
        ]
      );

      midiaCriada = {
        id: resultadoMidia.insertId,
        avaliacao_id: avaliacaoId,
        local_id: Number(local_id),
        usuario_id: Number(usuario_id),
        tipo,
        url,
        thumbnail: null,
      };
    }

    await connection.commit();

    return res.status(201).json({
      mensagem: "Avaliação criada com sucesso",
      avaliacao: {
        id: avaliacaoId,
        usuario_id: Number(usuario_id),
        local_id: Number(local_id),
        status,
        nota: Number(nota),
        comentario: comentario?.trim() || status,
        midia: midiaCriada,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error("Erro ao criar avaliação:", error);

    return res.status(500).json({
      erro: "Erro ao criar avaliação",
      detalhe: error.message,
    });
  } finally {
    connection.release();
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
        usuarios.foto_perfil,

        midias.id AS midia_id,
        midias.tipo AS midia_tipo,
        midias.url AS midia_url,
        midias.thumbnail AS midia_thumbnail

      FROM avaliacoes

      INNER JOIN usuarios
        ON avaliacoes.usuario_id = usuarios.id

      LEFT JOIN midias
        ON midias.avaliacao_id = avaliacoes.id

      WHERE avaliacoes.local_id = ?

      ORDER BY avaliacoes.criado_em DESC
      `,
      [local_id]
    );

    const resultado = avaliacoes.map((avaliacao) => ({
      id: avaliacao.id,
      usuario_id: avaliacao.usuario_id,
      local_id: avaliacao.local_id,
      status: avaliacao.status,
      nota: avaliacao.nota,
      comentario: avaliacao.comentario,
      criado_em: avaliacao.criado_em,
      nome: avaliacao.nome,
      usuario: avaliacao.usuario,
      foto_perfil: avaliacao.foto_perfil,

      midia: avaliacao.midia_id
        ? {
            id: avaliacao.midia_id,
            tipo: avaliacao.midia_tipo,
            url: avaliacao.midia_url,
            thumbnail: avaliacao.midia_thumbnail,
          }
        : null,
    }));

    return res.json(resultado);
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);

    return res.status(500).json({
      erro: "Erro ao buscar avaliações",
      detalhe: error.message,
    });
  }
}