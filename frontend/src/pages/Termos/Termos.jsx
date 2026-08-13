import {
  ArrowLeft,
  FileText,
  Mail,
} from "lucide-react";

import {
  Link,
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
            Estes Termos de Uso
            estabelecem as condições para
            acesso e utilização do Radar
            Now. Ao utilizar a plataforma
            ou criar uma conta, o usuário
            declara que leu, compreendeu e
            concorda com estas condições.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            1. Identificação
          </h2>

          <p>
            O Radar Now é uma plataforma
            digital administrada por
            Larissa Siqueira.
          </p>

          <p>
            Dúvidas, solicitações ou
            comunicações relacionadas à
            plataforma podem ser enviadas
            para:
          </p>

          <a href="mailto:contato.radarnow@gmail.com">
            contato.radarnow@gmail.com
          </a>
        </section>

        <section className="termos-section">
          <h2>
            2. Finalidade da plataforma
          </h2>

          <p>
            O Radar Now permite descobrir
            lugares e consultar
            informações relacionadas ao
            seu movimento, ambiente,
            localização e experiência dos
            usuários.
          </p>

          <p>
            A plataforma também permite
            que usuários cadastrados
            publiquem avaliações,
            comentários, fotos, vídeos e
            atualizações sobre os lugares
            disponíveis.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            3. Cadastro e conta
          </h2>

          <p>
            Algumas funcionalidades podem
            ser acessadas sem cadastro.
            Recursos como publicação de
            conteúdo, favoritos e
            gerenciamento de perfil podem
            exigir uma conta.
          </p>

          <p>
            Ao realizar o cadastro, o
            usuário compromete-se a
            fornecer informações
            verdadeiras, completas e
            atualizadas.
          </p>

          <p>
            O usuário é responsável pela
            confidencialidade de suas
            credenciais e pelas atividades
            realizadas em sua conta.
            Suspeitas de acesso indevido
            devem ser comunicadas ao Radar
            Now.
          </p>

          <p>
            É proibido criar contas com a
            finalidade de se passar por
            outra pessoa, enganar usuários
            ou contornar restrições
            aplicadas pela plataforma.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            4. Conteúdo dos usuários
          </h2>

          <p>
            O usuário permanece titular e
            responsável pelo conteúdo que
            publicar, incluindo
            avaliações, comentários,
            fotografias, vídeos e
            atualizações.
          </p>

          <p>
            Ao publicar conteúdo, o
            usuário concede ao Radar Now
            autorização gratuita, não
            exclusiva e válida enquanto o
            conteúdo estiver disponível
            na plataforma para armazená-lo,
            reproduzi-lo, adaptá-lo ao
            formato técnico necessário e
            exibi-lo dentro dos serviços
            do Radar Now.
          </p>

          <p>
            O usuário declara possuir os
            direitos e autorizações
            necessários para realizar a
            publicação, inclusive quando o
            conteúdo apresentar imagem,
            voz, marca, obra ou informação
            pertencente a terceiros.
          </p>

          <p>
            A autorização concedida não
            transfere ao Radar Now a
            propriedade do conteúdo
            publicado.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            5. Regras de conduta
          </h2>

          <p>
            Ao utilizar o Radar Now, não é
            permitido:
          </p>

          <ul>
            <li>
              Publicar conteúdo ilegal,
              fraudulento, enganoso ou
              deliberadamente falso;
            </li>

            <li>
              Praticar ameaça, assédio,
              perseguição, discriminação
              ou discurso de ódio;
            </li>

            <li>
              Publicar conteúdo sexual,
              extremamente violento ou
              inadequado para a
              plataforma;
            </li>

            <li>
              Expor dados pessoais,
              imagens ou informações
              privadas de terceiros sem
              autorização;
            </li>

            <li>
              Violar direitos autorais,
              marcas, direitos de imagem,
              privacidade ou outros
              direitos de terceiros;
            </li>

            <li>
              Publicar spam, publicidade
              não autorizada, avaliações
              manipuladas ou conteúdo
              repetitivo;
            </li>

            <li>
              Utilizar robôs, scripts ou
              outros métodos automatizados
              para coletar dados, criar
              interações artificiais ou
              prejudicar a plataforma;
            </li>

            <li>
              Tentar acessar contas,
              sistemas, servidores ou
              informações sem
              autorização;
            </li>

            <li>
              Introduzir código malicioso
              ou realizar qualquer ação
              capaz de comprometer a
              segurança ou a
              disponibilidade do serviço;
            </li>

            <li>
              Utilizar o Radar Now para
              incentivar atos ilegais,
              perigosos ou que coloquem
              outras pessoas em risco.
            </li>
          </ul>
        </section>

        <section className="termos-section">
          <h2>
            6. Moderação e medidas aplicáveis
          </h2>

          <p>
            O Radar Now poderá analisar
            conteúdos e atividades para
            verificar o cumprimento destes
            Termos, da legislação e das
            regras da plataforma.
          </p>

          <p>
            Em caso de violação, poderão
            ser adotadas medidas como
            remoção de conteúdo, limitação
            de funcionalidades, suspensão
            ou exclusão da conta, conforme
            a natureza e a gravidade da
            ocorrência.
          </p>

          <p>
            Conteúdos potencialmente
            ilegais ou que violem direitos
            podem ser comunicados pelo
            e-mail:
          </p>

          <a href="mailto:contato.radarnow@gmail.com">
            contato.radarnow@gmail.com
          </a>
        </section>

        <section className="termos-section">
          <h2>
            7. Informações sobre lugares
          </h2>

          <p>
            Informações sobre
            estabelecimentos podem ser
            fornecidas por usuários,
            proprietários dos locais ou
            serviços de terceiros.
          </p>

          <p>
            Movimento, ambiente, horários,
            endereço, preços, avaliações e
            demais informações podem sofrer
            alterações ou apresentar
            imprecisões.
          </p>

          <p>
            O conteúdo disponibilizado
            possui caráter informativo. O
            usuário deve confirmar
            informações relevantes
            diretamente com o
            estabelecimento antes de tomar
            decisões ou se deslocar.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            8. Localização, mapas e rotas
          </h2>

          <p>
            Recursos de localização,
            distância, mapas e rotas são
            oferecidos como ferramentas
            auxiliares e podem apresentar
            imprecisões ou indisponibilidade
            temporária.
          </p>

          <p>
            O usuário deve observar as
            condições reais do ambiente,
            seguir as normas de trânsito e
            adotar os cuidados necessários
            à sua segurança.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            9. Serviços de terceiros
          </h2>

          <p>
            O funcionamento do Radar Now
            pode depender de serviços de
            terceiros, incluindo
            autenticação, hospedagem,
            armazenamento, localização,
            mapas e informações sobre
            estabelecimentos.
          </p>

          <p>
            Esses serviços são regidos por
            termos próprios e podem sofrer
            alterações, limitações ou
            interrupções fora do controle
            do Radar Now.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            10. Propriedade intelectual
          </h2>

          <p>
            A marca Radar Now, sua
            identidade visual, interfaces,
            textos institucionais,
            elementos gráficos, código e
            demais componentes próprios da
            plataforma são protegidos pela
            legislação aplicável.
          </p>

          <p>
            Não é permitida sua cópia,
            reprodução, distribuição,
            modificação ou utilização
            comercial sem autorização
            prévia, exceto nos casos
            permitidos por lei.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            11. Disponibilidade do serviço
          </h2>

          <p>
            O Radar Now busca manter a
            plataforma disponível, segura
            e atualizada. Entretanto, o
            serviço poderá ser
            temporariamente interrompido
            para manutenção, correções,
            atualizações, falhas técnicas
            ou eventos fora de controle.
          </p>

          <p>
            Funcionalidades poderão ser
            alteradas, substituídas ou
            descontinuadas para aprimorar
            o serviço, atender exigências
            legais ou preservar a
            segurança da plataforma.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            12. Responsabilidades
          </h2>

          <p>
            Cada usuário é responsável
            pelo uso que fizer da
            plataforma, pelo conteúdo que
            publicar e pelas consequências
            decorrentes de suas ações.
          </p>

          <p>
            O Radar Now não participa da
            prestação dos serviços
            oferecidos pelos
            estabelecimentos exibidos nem
            garante a qualidade,
            disponibilidade ou segurança
            desses serviços.
          </p>

          <p>
            Nada nestes Termos exclui ou
            limita direitos e
            responsabilidades que não
            possam ser legalmente
            afastados.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            13. Exclusão da conta
          </h2>

          <p>
            O usuário pode excluir sua
            conta diretamente pelo
            aplicativo:
          </p>

          <p className="termos-path">
            Perfil → Configurações →
            Excluir minha conta
          </p>

          <p>
            A exclusão é permanente e não
            poderá ser desfeita. As
            informações poderão ser
            preservadas somente nas
            hipóteses permitidas ou
            exigidas pela legislação.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            14. Privacidade
          </h2>

          <p>
            As regras relativas à coleta,
            utilização, armazenamento e
            proteção dos dados pessoais
            estão descritas na Política de
            Privacidade.
          </p>

          <Link to="/privacidade">
            Consultar Política de Privacidade
          </Link>
        </section>

        <section className="termos-section">
          <h2>
            15. Alterações destes termos
          </h2>

          <p>
            Estes Termos poderão ser
            atualizados para refletir
            mudanças legais, técnicas ou
            operacionais.
          </p>

          <p>
            A versão vigente permanecerá
            disponível nesta página com a
            indicação da data da última
            atualização. Quando uma
            alteração exigir nova
            concordância, o usuário será
            informado de forma adequada.
          </p>
        </section>

        <section className="termos-section">
          <h2>
            16. Legislação aplicável
          </h2>

          <p>
            Estes Termos são regidos pela
            legislação brasileira,
            respeitadas as normas de
            proteção de dados, defesa do
            consumidor e demais direitos
            aplicáveis.
          </p>

          <p>
            Eventuais conflitos serão
            tratados pelo foro competente
            definido pela legislação,
            preservados os direitos do
            consumidor quanto à escolha de
            seu domicílio quando
            aplicável.
          </p>
        </section>

        <section className="termos-contact">
          <Mail size={24} />

          <div>
            <h2>
              Contato
            </h2>

            <p>
              Para dúvidas sobre estes
              Termos de Uso:
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