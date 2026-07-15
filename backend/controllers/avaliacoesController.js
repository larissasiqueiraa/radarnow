import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { moderarTexto } from "../utils/moderacaoTexto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaMidias = path.join(
  __dirname,
  "..",
  "uploads",
  "midias"
);

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

    const notaNumerica = Number(nota);

    if (
      !Number.isInteger(notaNumerica) ||
      notaNumerica < 1 ||
      notaNumerica > 5
    ) {
      return res.status(400).json({
        erro: "A nota deve ser um número inteiro de 1 a 5.",
      });
    }

    const statusLimpo = String(status).trim();

    const comentarioLimpo =
      comentario?.trim() || statusLimpo;

    if (!statusLimpo) {
      return res.status(400).json({
        erro: "O status é obrigatório.",
      });
    }

    const resultadoModeracao =
      moderarTexto(comentarioLimpo);

    if (!resultadoModeracao.aprovado) {
      return res.status(400).json({
        erro:
          resultadoModeracao.motivo ||
          "Conteúdo não permitido.",
      });
    }

    await connection.beginTransaction();

    const [resultadoAvaliacao] =
      await connection.execute(
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
          statusLimpo,
          notaNumerica,
          comentarioLimpo,
        ]
      );

    const avaliacaoId =
      resultadoAvaliacao.insertId;

    let midiaCriada = null;

    if (req.file) {
      const tipo =
        descobrirTipoMidia(req.file);

      const url = montarUrlMidia(req);

      const [resultadoMidia] =
        await connection.execute(
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
      mensagem:
        "Avaliação criada com sucesso",
      avaliacao: {
        id: avaliacaoId,
        usuario_id: Number(usuario_id),
        local_id: Number(local_id),
        status: statusLimpo,
        nota: notaNumerica,
        comentario: comentarioLimpo,
        midia: midiaCriada,
      },
    });
  } catch (error) {
    await connection.rollback();

    console.error(
      "Erro ao criar avaliação:",
      error
    );

    return res.status(500).json({
      erro: "Erro ao criar avaliação",
      detalhe: error.message,
    });
  } finally {
    connection.release();
  }
}

export async function listarAvaliacoes(
  req,
  res
) {
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

    const resultado = avaliacoes.map(
      (avaliacao) => ({
        id: avaliacao.id,
        usuario_id: avaliacao.usuario_id,
        local_id: avaliacao.local_id,
        status: avaliacao.status,
        nota: avaliacao.nota,
        comentario: avaliacao.comentario,
        criado_em: avaliacao.criado_em,
        nome: avaliacao.nome,
        usuario: avaliacao.usuario,
        foto_perfil:
          avaliacao.foto_perfil,

        midia: avaliacao.midia_id
          ? {
              id: avaliacao.midia_id,
              tipo: avaliacao.midia_tipo,
              url: avaliacao.midia_url,
              thumbnail:
                avaliacao.midia_thumbnail,
            }
          : null,
      })
    );

    return res.json(resultado);
  } catch (error) {
    console.error(
      "Erro ao buscar avaliações:",
      error
    );

    return res.status(500).json({
      erro: "Erro ao buscar avaliações",
      detalhe: error.message,
    });
  }
}

export async function atualizarAvaliacao(
  req,
  res
) {
  try {
    const { id } = req.params;

    const {
      usuario_id,
      status,
      nota,
      comentario,
    } = req.body;

    if (
      !id ||
      !usuario_id ||
      !status ||
      nota === undefined ||
      nota === null
    ) {
      return res.status(400).json({
        erro:
          "Avaliação, usuário, status e nota são obrigatórios.",
      });
    }

    const avaliacaoId = Number(id);
    const usuarioId = Number(usuario_id);
    const notaNumerica = Number(nota);
    const statusLimpo = String(status).trim();

    const comentarioLimpo =
      comentario?.trim() || statusLimpo;

    if (
      !Number.isInteger(avaliacaoId) ||
      avaliacaoId <= 0 ||
      !Number.isInteger(usuarioId) ||
      usuarioId <= 0
    ) {
      return res.status(400).json({
        erro:
          "Avaliação ou usuário inválido.",
      });
    }

    if (!statusLimpo) {
      return res.status(400).json({
        erro: "O status é obrigatório.",
      });
    }

    if (
      !Number.isInteger(notaNumerica) ||
      notaNumerica < 1 ||
      notaNumerica > 5
    ) {
      return res.status(400).json({
        erro:
          "A nota deve ser um número inteiro de 1 a 5.",
      });
    }

    const resultadoModeracao =
      moderarTexto(comentarioLimpo);

    if (!resultadoModeracao.aprovado) {
      return res.status(400).json({
        erro:
          resultadoModeracao.motivo ||
          "Conteúdo não permitido.",
      });
    }

    const [avaliacoes] = await db.execute(
      `
      SELECT
        id,
        usuario_id,
        local_id
      FROM avaliacoes
      WHERE id = ?
      LIMIT 1
      `,
      [avaliacaoId]
    );

    if (avaliacoes.length === 0) {
      return res.status(404).json({
        erro: "Avaliação não encontrada.",
      });
    }

    const avaliacaoExistente =
      avaliacoes[0];

    if (
      Number(
        avaliacaoExistente.usuario_id
      ) !== usuarioId
    ) {
      return res.status(403).json({
        erro:
          "Você não pode editar a avaliação de outra pessoa.",
      });
    }

    const [resultadoAtualizacao] =
      await db.execute(
        `
        UPDATE avaliacoes
        SET
          status = ?,
          nota = ?,
          comentario = ?
        WHERE id = ?
          AND usuario_id = ?
        `,
        [
          statusLimpo,
          notaNumerica,
          comentarioLimpo,
          avaliacaoId,
          usuarioId,
        ]
      );

    if (
      resultadoAtualizacao.affectedRows ===
      0
    ) {
      return res.status(404).json({
        erro:
          "Não foi possível atualizar a avaliação.",
      });
    }

    return res.json({
      mensagem:
        "Avaliação atualizada com sucesso.",
      avaliacao: {
        id: avaliacaoId,
        usuario_id: usuarioId,
        local_id: Number(
          avaliacaoExistente.local_id
        ),
        status: statusLimpo,
        nota: notaNumerica,
        comentario: comentarioLimpo,
      },
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar avaliação:",
      error
    );

    return res.status(500).json({
      erro:
        "Erro ao atualizar avaliação.",
      detalhe: error.message,
    });
  }
}

export async function excluirAvaliacao(
  req,
  res
) {
  const connection =
    await db.getConnection();

  let transacaoIniciada = false;

  try {
    const { id } = req.params;
    const { usuario_id } = req.body;

    if (!id || !usuario_id) {
      return res.status(400).json({
        erro:
          "Avaliação e usuário são obrigatórios.",
      });
    }

    const [avaliacoes] =
      await connection.execute(
        `
        SELECT
          avaliacoes.id,
          avaliacoes.usuario_id,
          midias.url AS midia_url
        FROM avaliacoes
        LEFT JOIN midias
          ON midias.avaliacao_id =
             avaliacoes.id
        WHERE avaliacoes.id = ?
        LIMIT 1
        `,
        [Number(id)]
      );

    if (avaliacoes.length === 0) {
      return res.status(404).json({
        erro: "Avaliação não encontrada.",
      });
    }

    const avaliacao = avaliacoes[0];

    if (
      Number(avaliacao.usuario_id) !==
      Number(usuario_id)
    ) {
      return res.status(403).json({
        erro:
          "Você não pode excluir a avaliação de outra pessoa.",
      });
    }

    await connection.beginTransaction();

    transacaoIniciada = true;

    await connection.execute(
      `
      DELETE FROM midias
      WHERE avaliacao_id = ?
      `,
      [Number(id)]
    );

    const [resultado] =
      await connection.execute(
        `
        DELETE FROM avaliacoes
        WHERE id = ?
          AND usuario_id = ?
        `,
        [
          Number(id),
          Number(usuario_id),
        ]
      );

    if (resultado.affectedRows === 0) {
      await connection.rollback();

      transacaoIniciada = false;

      return res.status(404).json({
        erro:
          "Não foi possível excluir a avaliação.",
      });
    }

    await connection.commit();

    transacaoIniciada = false;

    if (avaliacao.midia_url) {
      try {
        const urlMidia = new URL(
          avaliacao.midia_url
        );

        const nomeArquivo = path.basename(
          urlMidia.pathname
        );

        const caminhoArquivo = path.join(
          pastaMidias,
          nomeArquivo
        );

        if (
          fs.existsSync(caminhoArquivo)
        ) {
          await fs.promises.unlink(
            caminhoArquivo
          );
        }
      } catch (errorArquivo) {
        console.error(
          "Avaliação apagada, mas houve erro ao remover o arquivo:",
          errorArquivo
        );
      }
    }

    return res.json({
      mensagem:
        "Avaliação excluída com sucesso.",
    });
  } catch (error) {
    if (transacaoIniciada) {
      await connection.rollback();
    }

    console.error(
      "Erro ao excluir avaliação:",
      error
    );

    return res.status(500).json({
      erro: "Erro ao excluir avaliação.",
      detalhe: error.message,
    });
  } finally {
    connection.release();
  }
}