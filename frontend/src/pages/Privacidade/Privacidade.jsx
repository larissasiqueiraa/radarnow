import {
  ArrowLeft,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./Privacidade.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Privacidade() {
  const navigate =
    useNavigate();

  return (
    <main className="privacidade-page">
      <Header />

      <div className="privacidade-content">
        <button
          type="button"
          className="privacidade-back-btn"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="privacidade-header">
          <div className="privacidade-icon">
            <ShieldCheck size={28} />
          </div>

          <h1>
            Política de Privacidade
          </h1>

          <p>
            Última atualização:
            12 de agosto de 2026
          </p>
        </header>

        <section className="privacidade-card">
          <p>
            Esta Política de Privacidade
            descreve como o Radar Now
            coleta, utiliza, armazena e
            protege dados pessoais
            durante o uso do aplicativo.
            Também apresenta os direitos
            dos titulares e os canais
            disponíveis para contato.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            1. Responsável pelo tratamento
          </h2>

          <p>
            O Radar Now é administrado
            por Larissa Siqueira,
            responsável pelas decisões
            relacionadas ao tratamento
            dos dados pessoais realizado
            por meio da plataforma.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            2. Dados tratados
          </h2>

          <p>
            Os dados tratados dependem
            das funcionalidades utilizadas
            e das permissões concedidas
            pelo usuário.
          </p>

          <ul>
            <li>
              Dados de cadastro, como
              nome, nome de usuário,
              endereço de e-mail e foto
              de perfil;
            </li>

            <li>
              Dados de autenticação,
              incluindo identificadores
              fornecidos pelo Google ou
              por outros métodos de
              acesso disponíveis;
            </li>

            <li>
              Localização aproximada ou
              precisa, quando autorizada
              no dispositivo;
            </li>

            <li>
              Informações relacionadas ao
              uso da conta, como lugares
              favoritados e avaliações;
            </li>

            <li>
              Conteúdo enviado
              voluntariamente, incluindo
              comentários, atualizações,
              fotos e vídeos;
            </li>

            <li>
              Dados técnicos necessários
              para o funcionamento e a
              segurança da plataforma,
              como registros de acesso,
              endereço IP, informações do
              navegador ou dispositivo e
              registros de erros.
            </li>
          </ul>
        </section>

        <section className="privacidade-section">
          <h2>
            3. Finalidades do tratamento
          </h2>

          <p>
            Os dados pessoais podem ser
            utilizados para:
          </p>

          <ul>
            <li>
              Criar, autenticar e
              administrar contas;
            </li>

            <li>
              Disponibilizar recursos de
              perfil, favoritos,
              avaliações e publicações;
            </li>

            <li>
              Exibir lugares próximos,
              calcular distâncias e
              oferecer funcionalidades de
              localização e mapa;
            </li>

            <li>
              Apresentar fotos, vídeos,
              comentários e atualizações
              compartilhadas pela
              comunidade;
            </li>

            <li>
              Manter a segurança,
              prevenir fraudes e combater
              usos indevidos;
            </li>

            <li>
              Diagnosticar falhas,
              aprimorar funcionalidades e
              melhorar a experiência de
              uso;
            </li>

            <li>
              Atender solicitações dos
              usuários e cumprir
              obrigações legais ou
              regulatórias.
            </li>
          </ul>
        </section>

        <section className="privacidade-section">
          <h2>
            4. Bases legais
          </h2>

          <p>
            O tratamento dos dados
            pessoais ocorre de acordo com
            as bases legais previstas na
            Lei Geral de Proteção de Dados
            Pessoais — LGPD, conforme
            aplicável a cada situação.
          </p>

          <p>
            Entre essas bases estão a
            execução dos serviços
            solicitados pelo usuário, o
            cumprimento de obrigações
            legais, o exercício regular de
            direitos, o legítimo interesse
            relacionado à segurança e à
            melhoria da plataforma e o
            consentimento, quando
            necessário.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            5. Localização
          </h2>

          <p>
            Mediante autorização, o Radar
            Now pode acessar a localização
            do dispositivo para apresentar
            lugares próximos, estimar
            distâncias e fornecer recursos
            relacionados ao mapa.
          </p>

          <p>
            A permissão pode ser alterada
            ou revogada a qualquer momento
            nas configurações do
            dispositivo. A desativação
            poderá limitar funcionalidades
            que dependam da localização.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            6. Conteúdo público
          </h2>

          <p>
            Nome de usuário, foto de
            perfil, avaliações,
            comentários, fotos, vídeos e
            atualizações publicados podem
            ficar visíveis para outros
            usuários, inclusive pessoas
            que utilizem determinadas
            áreas do Radar Now sem estar
            autenticadas.
          </p>

          <p>
            O usuário deve evitar publicar
            dados pessoais próprios ou de
            terceiros que não deseje
            tornar públicos.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            7. Compartilhamento de dados
          </h2>

          <p>
            O Radar Now não comercializa
            dados pessoais.
          </p>

          <p>
            Informações podem ser
            compartilhadas com prestadores
            necessários ao funcionamento
            da plataforma, incluindo
            serviços de hospedagem,
            armazenamento, banco de dados,
            autenticação, mapas,
            localização e informações
            sobre estabelecimentos.
          </p>

          <p>
            O compartilhamento também
            poderá ocorrer para cumprir
            determinações legais,
            regulatórias ou judiciais,
            responder a autoridades
            competentes e proteger
            direitos, segurança e
            integridade da plataforma e
            de seus usuários.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            8. Transferência internacional
          </h2>

          <p>
            Alguns prestadores utilizados
            pelo Radar Now podem armazenar
            ou processar informações em
            outros países.
          </p>

          <p>
            Nessas situações, são adotadas
            medidas razoáveis para que o
            tratamento ocorra de acordo
            com a legislação aplicável e
            com padrões adequados de
            proteção de dados.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            9. Armazenamento e segurança
          </h2>

          <p>
            Os dados são mantidos pelo
            período necessário para
            prestar os serviços, manter a
            segurança da plataforma,
            cumprir obrigações legais e
            exercer direitos em processos
            administrativos, judiciais ou
            arbitrais.
          </p>

          <p>
            São adotadas medidas técnicas
            e administrativas destinadas
            a reduzir riscos de perda,
            destruição, alteração,
            divulgação ou acesso não
            autorizado. Apesar dessas
            medidas, nenhum sistema é
            completamente isento de
            riscos.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            10. Exclusão da conta
          </h2>

          <p>
            A conta pode ser excluída
            diretamente no aplicativo
            pelo seguinte caminho:
          </p>

          <p className="privacidade-path">
            Perfil → Configurações →
            Excluir minha conta
          </p>

          <p>
            A exclusão remove a conta e os
            dados associados de forma
            permanente, ressalvadas as
            informações que precisem ser
            conservadas para cumprimento
            de obrigação legal, prevenção
            de fraudes ou exercício
            regular de direitos.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            11. Direitos dos titulares
          </h2>

          <p>
            Nos termos da LGPD, o titular
            poderá solicitar, conforme
            aplicável:
          </p>

          <ul>
            <li>
              Confirmação da existência de
              tratamento;
            </li>

            <li>
              Acesso aos dados pessoais;
            </li>

            <li>
              Correção de dados
              incompletos, inexatos ou
              desatualizados;
            </li>

            <li>
              Anonimização, bloqueio ou
              eliminação de dados
              desnecessários, excessivos
              ou tratados em
              desconformidade;
            </li>

            <li>
              Informações sobre entidades
              com as quais houve
              compartilhamento;
            </li>

            <li>
              Portabilidade, quando
              aplicável e regulamentada;
            </li>

            <li>
              Revogação do consentimento
              e eliminação dos dados
              tratados com essa base,
              observadas as exceções
              legais;
            </li>

            <li>
              Revisão de decisões tomadas
              unicamente com base em
              tratamento automatizado,
              quando aplicável.
            </li>
          </ul>

          <p>
            Para proteger o titular,
            poderá ser solicitada a
            confirmação de identidade
            antes do atendimento.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            12. Crianças e adolescentes
          </h2>

          <p>
            O Radar Now não é direcionado
            a crianças e não busca coletar
            conscientemente seus dados
            pessoais.
          </p>

          <p>
            Caso seja identificada uma
            conta ou publicação envolvendo
            tratamento inadequado de dados
            de crianças ou adolescentes,
            poderão ser adotadas medidas
            para proteção do titular,
            remoção do conteúdo ou
            exclusão da conta.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            13. Serviços de terceiros
          </h2>

          <p>
            O aplicativo pode conter
            integrações ou links para
            serviços de terceiros. O
            tratamento realizado
            diretamente por esses serviços
            é regido por suas próprias
            políticas de privacidade.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            14. Atualizações desta política
          </h2>

          <p>
            Esta Política poderá ser
            atualizada para refletir
            alterações legais,
            operacionais ou tecnológicas.
          </p>

          <p>
            A versão vigente estará
            disponível nesta página,
            acompanhada da data de sua
            última atualização.
          </p>
        </section>

        <section className="privacidade-contact">
          <Mail size={24} />

          <div>
            <h2>
              Contato sobre privacidade
            </h2>

            <p>
              Para exercer seus direitos
              ou esclarecer dúvidas:
            </p>

            <a href="mailto:contato.radarnow@gmail.com">
              contato.radarnow@gmail.com
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default Privacidade;