import { useState, useEffect } from "react";

export function useUsuario() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("radarnow_usuario");

    if (data) {
      setUsuario(JSON.parse(data));
    }
  }, []);

  return usuario;
}