import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Cadastro from "../pages/Cadastro/Cadastro";
import Local from "../pages/Local/Local";
import NovoStatus from "../pages/NovoStatus/NovoStatus";
import Busca from "../pages/Busca/Busca";
import Perfil from "../pages/Perfil/Perfil";
import Favoritos from "../pages/Favoritos/Favoritos";
import Configuracoes from "../pages/Configuracoes/Configuracoes";
import EditarPerfil from "../pages/EditarPerfil/EditarPerfil";
import Mapa from "../pages/Mapa/Mapa";
import Midias from "../pages/Midias/Midias";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/busca" element={<Busca />} />
        <Route path="/local/:id" element={<Local />} />
        <Route path="/local/:id/midias" element={<Midias />} />

        <Route path="/novo-status/:id" element={<NovoStatus />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />

        <Route path="/mapa" element={<Mapa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;