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
            O Radar Now respeita sua
            privacidade e está
            comprometido com a proteção
            dos seus dados pessoais.
            Esta Política de Privacidade
            explica quais informações
            são tratadas, como elas são
            utilizadas e quais são os
            seus direitos.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            1. Dados que coletamos
          </h2>

          <p>
            Dependendo de como você
            utiliza o Radar Now, podemos
            tratar as seguintes
            informações:
          </p>

          <ul>
            <li>
              Nome, nome de usuário e
              endereço de e-mail;
            </li>

            <li>
              Foto de perfil;
            </li>

            <li>
              Identificador da conta
              Google, quando esse método
              de acesso for utilizado;
            </li>

            <li>
              Localização aproximada ou
              precisa, mediante
              autorização do
              dispositivo;
            </li>

            <li>
              Lugares favoritados;
            </li>

            <li>
              Avaliações, comentários e
              atualizações de status;
            </li>

            <li>
              Fotos e vídeos enviados
              voluntariamente;
            </li>

            <li>
              Informações técnicas
              necessárias para segurança,
              funcionamento e diagnóstico
              de falhas.
            </li>
          </ul>
        </section>

        <section className="privacidade-section">
          <h2>
            2. Como utilizamos os dados
          </h2>

          <p>
            Os dados poderão ser
            utilizados para:
          </p>

          <ul>
            <li>
              Criar, autenticar e
              administrar sua conta;
            </li>

            <li>
              Exibir lugares próximos e
              informações relevantes
              para sua região;
            </li>

            <li>
              Permitir avaliações,
              favoritos, fotos, vídeos e
              atualizações em tempo real;
            </li>

            <li>
              Personalizar sua
              experiência no aplicativo;
            </li>

            <li>
              Prevenir fraudes, abusos e
              acessos não autorizados;
            </li>

            <li>
              Corrigir erros e melhorar
              o funcionamento do Radar
              Now;
            </li>

            <li>
              Cumprir obrigações legais
              e proteger os direitos dos
              usuários e da plataforma.
            </li>
          </ul>
        </section>

        <section className="privacidade-section">
          <h2>
            3. Localização
          </h2>

          <p>
            O Radar Now pode solicitar
            acesso à localização do
            dispositivo para apresentar
            lugares próximos, calcular
            distâncias e oferecer
            recursos relacionados ao
            mapa.
          </p>

          <p>
            O acesso somente ocorre com
            a sua autorização e pode ser
            desativado a qualquer momento
            nas configurações do
            dispositivo. Alguns recursos
            podem ficar limitados sem
            essa permissão.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            4. Conteúdo publicado
          </h2>

          <p>
            Avaliações, comentários,
            fotos, vídeos, nome de usuário
            e atualizações publicadas
            podem ficar visíveis para
            outras pessoas no Radar Now.
          </p>

          <p>
            Não publique informações
            pessoais, imagens ou
            conteúdos que você não deseja
            tornar públicos.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            5. Compartilhamento
          </h2>

          <p>
            O Radar Now não vende seus
            dados pessoais.
          </p>

          <p>
            Algumas informações poderão
            ser processadas por
            prestadores necessários ao
            funcionamento do aplicativo,
            como serviços de hospedagem,
            banco de dados,
            autenticação, mapas e
            informações sobre lugares.
          </p>

          <p>
            Esses serviços recebem
            somente as informações
            necessárias para executar
            suas respectivas funções e
            possuem políticas próprias
            de privacidade.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            6. Armazenamento e segurança
          </h2>

          <p>
            Adotamos medidas técnicas e
            administrativas para reduzir
            riscos de perda, alteração,
            divulgação ou acesso não
            autorizado aos dados.
          </p>

          <p>
            Nenhum sistema é totalmente
            livre de riscos. Por isso,
            recomendamos que você proteja
            sua senha e não compartilhe
            suas credenciais de acesso.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            7. Exclusão da conta
          </h2>

          <p>
            Você pode excluir sua conta
            diretamente pelo aplicativo,
            acessando:
          </p>

          <p className="privacidade-path">
            Perfil → Configurações →
            Excluir minha conta
          </p>

          <p>
            A exclusão remove
            permanentemente a conta e os
            dados associados, respeitadas
            eventuais obrigações legais
            de retenção.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            8. Seus direitos
          </h2>

          <p>
            Conforme a legislação
            aplicável, incluindo a Lei
            Geral de Proteção de Dados
            Pessoais — LGPD, você poderá
            solicitar:
          </p>

          <ul>
            <li>
              Confirmação do tratamento
              de dados;
            </li>

            <li>
              Acesso aos dados;
            </li>

            <li>
              Correção de informações
              incompletas ou
              desatualizadas;
            </li>

            <li>
              Exclusão ou anonimização,
              quando aplicável;
            </li>

            <li>
              Informações sobre o
              compartilhamento;
            </li>

            <li>
              Revogação do consentimento,
              quando essa for a base
              utilizada.
            </li>
          </ul>
        </section>

        <section className="privacidade-section">
          <h2>
            9. Crianças e adolescentes
          </h2>

          <p>
            O Radar Now não é direcionado
            a crianças. Caso seja
            identificado o tratamento
            indevido de dados de menores,
            poderão ser tomadas medidas
            para remoção das informações
            e da respectiva conta.
          </p>
        </section>

        <section className="privacidade-section">
          <h2>
            10. Alterações nesta política
          </h2>

          <p>
            Esta Política de Privacidade
            poderá ser atualizada para
            refletir mudanças no
            aplicativo, na legislação ou
            nas práticas de tratamento
            de dados.
          </p>

          <p>
            A data da atualização mais
            recente estará sempre
            indicada no início desta
            página.
          </p>
        </section>

        <section className="privacidade-contact">
          <Mail size={24} />

          <div>
            <h2>
              Entre em contato
            </h2>

            <p>
              Para dúvidas ou
              solicitações relacionadas
              à privacidade:
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