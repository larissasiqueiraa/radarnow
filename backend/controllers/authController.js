import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function gerarToken(usuario) {
  return jwt.sign(
    {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      foto_perfil: usuario.foto_perfil,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function gerarUsuarioPeloEmail(email) {
  const base = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  return `${base}${Date.now().toString().slice(-4)}`;
}

function montarUrlFoto(req) {
  if (!req.file) {
    return null;
  }

  return `${req.protocol}://${req.get("host")}/uploads/perfis/${
    req.file.filename
  }`;
}

export async function cadastrar(req, res) {
  try {
    let { nome, usuario, email, senha } = req.body;

    nome = nome?.trim();
    usuario = usuario?.trim().replace(/^@/, "").toLowerCase();
    email = email?.trim().toLowerCase();

    if (!nome || !usuario || !email || !senha) {
      return res.status(400).json({
        erro: "Preencha todos os campos",
      });
    }

    if (senha.length < 6) {
      return res.status(400).json({
        erro: "A senha deve ter pelo menos 6 caracteres",
      });
    }

    const usuarioValido = /^[a-z0-9_.]+$/;

    if (!usuarioValido.test(usuario)) {
      return res.status(400).json({
        erro: "O usuário pode conter apenas letras, números, ponto e underline",
      });
    }

    const [usuariosExistentes] = await db.execute(
      `
      SELECT id, email, usuario
      FROM usuarios
      WHERE email = ? OR usuario = ?
      `,
      [email, usuario]
    );

    if (usuariosExistentes.length > 0) {
      const existente = usuariosExistentes[0];

      if (existente.email === email) {
        return res.status(400).json({
          erro: "Este e-mail já está cadastrado",
        });
      }

      return res.status(400).json({
        erro: "Este nome de usuário já está sendo utilizado",
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const fotoPerfil = montarUrlFoto(req);

    const [resultado] = await db.execute(
      `
      INSERT INTO usuarios
      (
        nome,
        usuario,
        email,
        senha,
        foto_perfil
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [nome, usuario, email, senhaHash, fotoPerfil]
    );

    const [usuariosCriados] = await db.execute(
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
      [resultado.insertId]
    );

    const novoUsuario = usuariosCriados[0];
    const token = gerarToken(novoUsuario);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        usuario: novoUsuario.usuario,
        email: novoUsuario.email,
        foto_perfil: novoUsuario.foto_perfil,
      },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);

    return res.status(500).json({
      erro: "Erro ao cadastrar usuário",
      detalhe: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const { senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Preencha e-mail e senha",
      });
    }

    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos",
      });
    }

    const usuarioEncontrado = usuarios[0];

    if (!usuarioEncontrado.senha) {
      return res.status(401).json({
        erro: "Esta conta foi criada com Google ou Apple. Entre usando o mesmo método.",
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuarioEncontrado.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "E-mail ou senha inválidos",
      });
    }

    const token = gerarToken(usuarioEncontrado);

    return res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        usuario: usuarioEncontrado.usuario,
        email: usuarioEncontrado.email,
        foto_perfil: usuarioEncontrado.foto_perfil,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);

    return res.status(500).json({
      erro: "Erro ao fazer login",
      detalhe: error.message,
    });
  }
}

export async function loginGoogle(req, res) {
  try {
    const { credential, access_token } = req.body;

    let googleId;
    let nome;
    let email;
    let fotoGoogle;

    if (credential) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      googleId = payload.sub;
      nome = payload.name;
      email = payload.email;
      fotoGoogle = payload.picture;
    } else if (access_token) {
      const respostaGoogle = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const dadosGoogle = await respostaGoogle.json();

      if (!respostaGoogle.ok) {
        return res.status(401).json({
          erro: "Token do Google inválido",
          detalhe: dadosGoogle,
        });
      }

      googleId = dadosGoogle.sub;
      nome = dadosGoogle.name;
      email = dadosGoogle.email;
      fotoGoogle = dadosGoogle.picture;
    } else {
      return res.status(400).json({
        erro: "Token do Google não enviado",
      });
    }

    if (!email) {
      return res.status(400).json({
        erro: "Não foi possível obter o e-mail da conta Google",
      });
    }

    email = email.trim().toLowerCase();

    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    let usuarioFinal;

    if (usuarios.length > 0) {
      usuarioFinal = usuarios[0];

      await db.execute(
        `
        UPDATE usuarios
        SET
          google_id = COALESCE(google_id, ?),
          foto_perfil = COALESCE(foto_perfil, ?)
        WHERE id = ?
        `,
        [googleId, fotoGoogle, usuarioFinal.id]
      );

      const [usuariosAtualizados] = await db.execute(
        "SELECT * FROM usuarios WHERE id = ?",
        [usuarioFinal.id]
      );

      usuarioFinal = usuariosAtualizados[0];
    } else {
      const usuarioGerado = gerarUsuarioPeloEmail(email);

      const [resultado] = await db.execute(
        `
        INSERT INTO usuarios
        (
          nome,
          usuario,
          email,
          senha,
          foto_perfil,
          google_id
        )
        VALUES (?, ?, ?, ?, ?, ?)
        `,
        [
          nome,
          usuarioGerado,
          email,
          null,
          fotoGoogle,
          googleId,
        ]
      );

      const [novoUsuario] = await db.execute(
        "SELECT * FROM usuarios WHERE id = ?",
        [resultado.insertId]
      );

      usuarioFinal = novoUsuario[0];
    }

    const token = gerarToken(usuarioFinal);

    return res.json({
      mensagem: "Login com Google realizado com sucesso",
      token,
      usuario: {
        id: usuarioFinal.id,
        nome: usuarioFinal.nome,
        usuario: usuarioFinal.usuario,
        email: usuarioFinal.email,
        foto_perfil: usuarioFinal.foto_perfil,
      },
    });
  } catch (error) {
    console.error("Erro no login com Google:", error);

    return res.status(500).json({
      erro: "Erro ao fazer login com Google",
      detalhe: error.message,
    });
  }
}