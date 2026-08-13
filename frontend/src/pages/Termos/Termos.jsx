import {
  ArrowLeft,
  FileText,
  Mail,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

import "./Termos.css";

import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function Termos() {
  const navigate =
    useNavigate();

  return (
    <main className="termos-page">
      <Header />

      <div className="termos-content">
        <button
          type="button"
          className="termos-back-btn"
          onClick={() =>
            navigate(-1)
          }
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <header className="termos-header">
          <div className="termos-icon">
            <FileText size={28} />
          </div>

          <h1>
            Termos de Uso
          </h1>

          <p>
            Última atualização:
            12 de agosto de 2026
          </p>
        </header>

        <section className="termos-intro">
          <p>
            Estes Termos de Uso regulam
            o acesso e a utilização do
            Radar Now. Ao criar uma conta
            ou utilizar o aplicativo,
            você declara que leu e
            concorda com estas condições.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            1. Sobre o Radar Now
          </h2>

          <p>
            O Radar Now é uma plataforma
            colaborativa que permite
            descobrir lugares e consultar
            informações compartilhadas
            pela comunidade, incluindo
            avaliações, movimento,
            ambiente, fotos, vídeos e
            atualizações em tempo real.
          </p>

          <p>
            Algumas informações sobre
            estabelecimentos podem ser
            fornecidas por serviços
            externos e estar sujeitas a
            alterações.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            2. Cadastro e acesso
          </h2>

          <p>
            Algumas funcionalidades podem
            ser utilizadas sem cadastro.
            Para publicar conteúdo,
            favoritar lugares ou utilizar
            determinados recursos, poderá
            ser necessário criar uma
            conta.
          </p>

          <p>
            Você é responsável por manter
            seus dados corretos e por
            proteger sua senha e suas
            credenciais de acesso.
          </p>

          <p>
            Não é permitido utilizar a
            conta de outra pessoa nem
            fornecer informações falsas
            com a intenção de se passar
            por terceiros.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            3. Conteúdo publicado
          </h2>

          <p>
            Você continua responsável
            pelas avaliações,
            comentários, fotos, vídeos e
            demais conteúdos que
            publicar.
          </p>

          <p>
            Ao publicar conteúdo no Radar
            Now, você autoriza sua
            exibição dentro do aplicativo
            para o funcionamento da
            plataforma.
          </p>

          <p>
            Você declara possuir os
            direitos ou autorizações
            necessários sobre o conteúdo
            publicado e concorda em não
            violar direitos de imagem,
            privacidade, propriedade
            intelectual ou outros direitos
            de terceiros.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            4. Condutas proibidas
          </h2>

          <p>
            Não é permitido publicar ou
            utilizar o Radar Now para:
          </p>

          <ul>
            <li>
              Praticar atos ilegais,
              fraudulentos ou
              enganosos;
            </li>

            <li>
              Publicar ameaças,
              perseguição, assédio,
              discriminação ou discurso
              de ódio;
            </li>

            <li>
              Compartilhar conteúdo
              sexual, violento ou
              inadequado;
            </li>

            <li>
              Divulgar dados pessoais de
              terceiros sem autorização;
            </li>

            <li>
              Publicar avaliações falsas,
              spam ou informações
              deliberadamente incorretas;
            </li>

            <li>
              Violar direitos autorais,
              marcas, direitos de imagem
              ou outros direitos;
            </li>

            <li>
              Tentar acessar contas,
              servidores ou áreas
              restritas sem autorização;
            </li>

            <li>
              Utilizar sistemas
              automatizados para
              prejudicar, copiar ou
              sobrecarregar a plataforma;
            </li>

            <li>
              Incentivar atividades
              perigosas ou que possam
              causar danos.
            </li>
          </ul>
        </section>

        <section className="termos-section">
          <h2>
            5. Moderação e remoção
          </h2>

          <p>
            Conteúdos ou contas que
            violem estes Termos poderão
            ser removidos, limitados ou
            suspensos.
          </p>

          <p>
            Quando necessário, o Radar
            Now poderá preservar
            informações ou colaborar com
            autoridades competentes para
            cumprir obrigações legais e
            proteger usuários e
            terceiros.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            6. Informações dos lugares
          </h2>

          <p>
            As informações exibidas podem
            ser enviadas por usuários,
            estabelecimentos ou serviços
            externos. Embora busquemos
            manter os dados atualizados,
            não garantimos que horários,
            movimento, preços, endereço,
            avaliações ou outras
            informações estejam sempre
            completos ou corretos.
          </p>

          <p>
            Antes de se deslocar ou tomar
            uma decisão, recomendamos
            confirmar informações
            importantes diretamente com
            o estabelecimento.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            7. Localização e mapas
          </h2>

          <p>
            Recursos de localização,
            distância, rota e mapas são
            oferecidos como auxílio e
            podem apresentar imprecisões.
          </p>

          <p>
            O usuário deve observar as
            condições reais do local e
            seguir as normas de trânsito
            e segurança aplicáveis.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            8. Serviços de terceiros
          </h2>

          <p>
            O Radar Now pode utilizar ou
            apresentar informações
            provenientes de serviços de
            terceiros, como autenticação,
            mapas, localização,
            hospedagem e dados de
            estabelecimentos.
          </p>

          <p>
            Esses serviços possuem termos
            e políticas próprias e podem
            sofrer interrupções ou
            alterações fora do controle
            do Radar Now.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            9. Disponibilidade
          </h2>

          <p>
            Buscamos manter o aplicativo
            disponível e seguro, mas
            poderão ocorrer interrupções
            temporárias para manutenção,
            atualização, falhas técnicas
            ou situações externas.
          </p>

          <p>
            Funcionalidades poderão ser
            alteradas, adicionadas ou
            removidas para melhorar o
            serviço ou atender exigências
            técnicas e legais.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            10. Exclusão da conta
          </h2>

          <p>
            Você pode excluir sua conta
            pelo seguinte caminho:
          </p>

          <p className="termos-path">
            Perfil → Configurações →
            Excluir minha conta
          </p>

          <p>
            A exclusão é permanente e
            remove a conta e os dados
            associados, respeitadas as
            hipóteses legais de
            conservação de informações.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            11. Privacidade
          </h2>

          <p>
            O tratamento de dados
            pessoais é explicado na
            Política de Privacidade do
            Radar Now, disponível dentro
            do aplicativo e em:
          </p>

          <a href="/privacidade">
            radarnow.vercel.app/privacidade
          </a>
        </section>

        <section className="termos-section">
          <h2>
            12. Alterações nos termos
          </h2>

          <p>
            Estes Termos poderão ser
            atualizados para refletir
            mudanças no aplicativo, na
            legislação ou nas práticas
            da plataforma.
          </p>

          <p>
            A data da versão mais recente
            será indicada no início desta
            página.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            13. Legislação aplicável
          </h2>

          <p>
            Estes Termos são regidos pela
            legislação brasileira,
            respeitados os direitos
            assegurados pela legislação
            aplicável, inclusive as normas
            de proteção de dados e de
            defesa do consumidor.
          </p>
        </section>

        <section className="termos-contact">
          <Mail size={24} />

          <div>
            <h2>
              Dúvidas sobre os termos
            </h2>

            <p>
              Entre em contato pelo
              e-mail:
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

export default Termos;