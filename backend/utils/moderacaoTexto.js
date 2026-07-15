function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const palavrasProibidas = [
  // pornografia
  "pornografia",
  "porno",
  "sexo explicito",
  "boquete",
  "transar",
  "foder",
  "puta",
  "prostituta",
  "garota de programa",
  "puteiro",
  "bordel",
  "prostibulo",

  // violência
  "vou te matar",
  "vou matar",
  "quero matar",
  "te espancar",
  "explodir",

  // drogas
  "vendo cocaina",
  "vendo maconha",
  "vendo droga",

  // discurso de ódio
  "heil hitler",
  "nazista",
];

const expressoesProibidas = [
  /https?:\/\/\S+/i,
  /www\.\S+/i,
  /(?:\+?55\s?)?(?:\(?\d{2}\)?\s?)?\d{4,5}[- ]?\d{4}/,
];

export function moderarTexto(texto = "") {
  const textoOriginal = texto.trim();

  if (!textoOriginal) {
    return {
      aprovado: true,
    };
  }

  const textoNormalizado = normalizarTexto(textoOriginal);

  for (const palavra of palavrasProibidas) {
    if (textoNormalizado.includes(normalizarTexto(palavra))) {
      return {
        aprovado: false,
        motivo: "Conteúdo não permitido.",
      };
    }
  }

  for (const regex of expressoesProibidas) {
    if (regex.test(textoOriginal)) {
      return {
        aprovado: false,
        motivo: "Links e contatos não são permitidos.",
      };
    }
  }

  return {
    aprovado: true,
  };
}