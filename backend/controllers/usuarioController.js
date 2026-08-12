import db from "../config/db.js";
import fs from "fs";
import path from "path";

function corrigirProtocolo(url) {
  if (
    !url ||
    typeof url !== "string"
  ) {
    return url;
  }

  return url.replace(
    /^http:\/\/radarnow-production\.up\.railway\.app/i,
    "https://radarnow-production.up.railway.app"
  );
}

function montarUrlFoto(
  req,
  nomeArquivo
) {
  if (!nomeArquivo) {
    return null;
  }

  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.API_URL ||
    `${req.protocol}://${req.get(
      "host"
    )}`;

  return corrigirProtocolo(
    `${backendUrl}/uploads/${nomeArquivo}`
  );
}

function obterPastaUploads() {
  const estaNoRailway =
    Boolean(
      process.env
        .RAILWAY_PROJECT_ID ||
      process.env
        .RAILWAY_ENVIRONMENT_NAME
    );

  return estaNoRailway
    ? "/app/uploads"
    : path.resolve(
        process.cwd(),
        "uploads"
      );
}

function descobrirCaminhoArquivo(
  url
) {
  if (
    !url ||
    typeof url !== "string"
  ) {
    return null;
  }

  try {
    const urlArquivo =
      new URL(url);

    if (
      !urlArquivo.pathname.startsWith(
        "/uploads/"
      )
    ) {
      return null;
    }

    const caminhoRelativo =
      decodeURIComponent(
        urlArquivo.pathname.replace(
          /^\/uploads\//,
          ""
        )
      );

    const pastaUploads =
      path.resolve(
        obterPastaUploads()
      );

    const caminhoCompleto =
      path.resolve(
        pastaUploads,
        caminhoRelativo
      );

    if (
      caminhoCompleto !==
        pastaUploads &&
      !caminhoCompleto.startsWith(
        `${pastaUploads}${path.sep}`
      )
    ) {
      return null;
    }

    return caminhoCompleto;
  } catch {
    return null;
  }
}

async function apagarArquivo(
  url
) {
  const caminho =
    descobrirCaminhoArquivo(
      url
    );

  if (!caminho) {
    return;
  }

  try {
    if (
      fs.existsSync(caminho)
    ) {
      await fs.promises.unlink(
        caminho
      );
    }
  } catch (error) {
    console.error(
      "Erro ao apagar arquivo da conta:",
      error
    );
  }
}

/*
|--------------------------------------------------------------------------
| BUSCAR PERFIL
|--------------------------------------------------------------------------
*/

export async function buscarPerfil(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const [usuarios] =
      await db.execute(
        `
        SELECT
          id,
          nome,
          usuario,
          email,
          foto_perfil
        FROM usuarios
        WHERE id = ?
        `,
        [id]
      );

    if (
      usuarios.length === 0
    ) {
      return res.status(404).json({
        erro:
          "Usuário não encontrado",
      });
    }

    const usuario =
      usuarios[0];

    const [favoritos] =
      await db.execute(
        `
        SELECT COUNT(*) AS total
        FROM favoritos
        WHERE usuario_id = ?
        `,
        [id]
      );

    const [avaliacoes] =
      await db.execute(
        `
        SELECT COUNT(*) AS total
        FROM avaliacoes
        WHERE usuario_id = ?
        `,
        [id]
      );

    return res.json({
      ...usuario,

      foto_perfil:
        corrigirProtocolo(
          usuario.foto_perfil
        ),

      totalFavoritos:
        Number(
          favoritos[0]?.total ||
            0
        ),

      totalAvaliacoes:
        Number(
          avaliacoes[0]?.total ||
            0
        ),
    });
  } catch (error) {
    console.error(
      "Erro ao buscar perfil:",
      error
    );

    return res.status(500).json({
      erro:
        "Erro ao buscar perfil",

      detalhes:
        error.message,
    });
  }
}

/*
|--------------------------------------------------------------------------
| ATUALIZAR PERFIL
|--------------------------------------------------------------------------
*/

export async function atualizarUsuario(
  req,
  res
) {
  try {
    const { id } =
      req.params;

    const {
      nome,
      usuario,
    } = req.body;

    if (
      !nome?.trim() ||
      !usuario?.trim()
    ) {
      return res.status(400).json({
        erro:
          "Nome e usuário são obrigatórios",
      });
    }

    const [resultadoAtual] =
      await db.execute(
        `
        SELECT foto_perfil
        FROM usuarios
        WHERE id = ?
        `,
        [id]
      );

    if (
      resultadoAtual.length ===
      0
    ) {
      return res.status(404).json({
        erro:
          "Usuário não encontrado",
      });
    }

    const usuarioAtual =
      resultadoAtual[0];

    const fotoPerfil =
      req.file
        ? montarUrlFoto(
            req,
            req.file.filename
          )
        : usuarioAtual.foto_perfil;

    await db.execute(
      `
      UPDATE usuarios
      SET
        nome = ?,
        usuario = ?,
        foto_perfil = ?
      WHERE id = ?
      `,
      [
        nome.trim(),
        usuario.trim(),
        fotoPerfil,
        id,
      ]
    );

    const [usuarios] =
      await db.execute(
        `
        SELECT
          id,
          nome,
          usuario,
          email,
          foto_perfil
        FROM usuarios
        WHERE id = ?
        `,
        [id]
      );

    return res.json({
      mensagem:
        "Perfil atualizado com sucesso",

      usuario: {
        ...usuarios[0],

        foto_perfil:
          corrigirProtocolo(
            usuarios[0]
              .foto_perfil
          ),
      },
    });
  } catch (error) {
    console.error(
      "Erro ao atualizar usuário:",
      error
    );

    return res.status(500).json({
      erro:
        "Erro ao atualizar usuário",

      detalhes:
        error.message,
    });
  }
}

/*
|--------------------------------------------------------------------------
| EXCLUIR A PRÓPRIA CONTA
|--------------------------------------------------------------------------
*/

export async function excluirConta(
  req,
  res
) {
  const connection =
    await db.getConnection();

  let transacaoIniciada =
    false;

  try {
    const usuarioId =
      Number(req.usuario?.id);

    if (
      !Number.isInteger(
        usuarioId
      ) ||
      usuarioId <= 0
    ) {
      return res.status(401).json({
        erro:
          "Usuário não autenticado.",
      });
    }

    const [usuarios] =
      await connection.execute(
        `
        SELECT
          id,
          foto_perfil
        FROM usuarios
        WHERE id = ?
        LIMIT 1
        `,
        [usuarioId]
      );

    if (
      usuarios.length === 0
    ) {
      return res.status(404).json({
        erro:
          "Conta não encontrada.",
      });
    }

    const [midias] =
      await connection.execute(
        `
        SELECT
          url,
          thumbnail
        FROM midias
        WHERE usuario_id = ?
        `,
        [usuarioId]
      );

    const arquivos = [
      usuarios[0].foto_perfil,

      ...midias.flatMap(
        (midia) => [
          midia.url,
          midia.thumbnail,
        ]
      ),
    ].filter(Boolean);

    await connection.beginTransaction();

    transacaoIniciada = true;

    await connection.execute(
      `
      DELETE FROM midias
      WHERE usuario_id = ?
      `,
      [usuarioId]
    );

    const [resultado] =
      await connection.execute(
        `
        DELETE FROM usuarios
        WHERE id = ?
        `,
        [usuarioId]
      );

    if (
      resultado.affectedRows ===
      0
    ) {
      await connection.rollback();

      transacaoIniciada =
        false;

      return res.status(404).json({
        erro:
          "Conta não encontrada.",
      });
    }

    await connection.commit();

    transacaoIniciada =
      false;

    await Promise.allSettled(
      arquivos.map(
        apagarArquivo
      )
    );

    return res.json({
      mensagem:
        "Sua conta e seus dados foram excluídos permanentemente.",
    });
  } catch (error) {
    if (transacaoIniciada) {
      await connection.rollback();
    }

    console.error(
      "Erro ao excluir conta:",
      error
    );

    return res.status(500).json({
      erro:
        "Não foi possível excluir sua conta.",

      detalhes:
        error.message,
    });
  } finally {
    connection.release();
  }
}