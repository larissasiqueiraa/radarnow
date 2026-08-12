import jwt from "jsonwebtoken";

export function autenticarUsuario(
  req,
  res,
  next
) {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        erro:
          "Você precisa entrar na sua conta.",
      });
    }

    const token =
      authorization.substring(
        7
      );

    if (!token) {
      return res.status(401).json({
        erro:
          "Token de acesso não enviado.",
      });
    }

    const usuario =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    req.usuario = usuario;

    next();
  } catch (error) {
    if (
      error.name ===
        "TokenExpiredError" ||
      error.name ===
        "JsonWebTokenError"
    ) {
      return res.status(401).json({
        erro:
          "Sua sessão expirou. Entre novamente.",
      });
    }

    console.error(
      "Erro ao autenticar usuário:",
      error
    );

    return res.status(500).json({
      erro:
        "Erro ao verificar sua sessão.",
    });
  }
}