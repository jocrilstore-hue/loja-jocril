import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de Cookies — Jocril",
};

export default function CookiesPage() {
  return (
    <LegalPage
      kicker="Legal · Cookies"
      title="Política de Cookies."
      intro="Que cookies utilizamos, para que servem, e como pode gerir as suas preferências a qualquer momento."
      updated="17 Abril 2026"
      sections={[
        {
          id: "o-que-sao",
          kicker: "Definição",
          title: "O que são cookies",
          body: [
            "Os cookies são pequenos ficheiros de texto colocados no seu dispositivo quando visita um website. Permitem ao site reconhecer o seu navegador e guardar informação sobre as suas preferências ou ações.",
            "Utilizamos cookies próprios (definidos por jocril.pt) e cookies de terceiros (definidos por fornecedores que utilizamos para análise, pagamentos e anti-fraude).",
          ],
        },
        {
          id: "categorias",
          kicker: "Categorias",
          title: "Categorias de cookies que utilizamos",
          table: {
            cols: "1.2fr 1fr 2fr 1fr",
            head: ["Categoria", "Consentimento", "Finalidade", "Duração"],
            rows: [
              [
                "Estritamente necessários",
                "Obrigatórios",
                "Sessão, autenticação, carrinho, anti-CSRF. Sem estes o site não funciona.",
                "Sessão",
              ],
              [
                "Funcionais",
                "Opcional",
                "Preferências de idioma, tema, moradas guardadas.",
                "12 meses",
              ],
              [
                "Analíticos",
                "Opcional",
                "Estatísticas agregadas de utilização (Plausible, auto-hospedado).",
                "12 meses",
              ],
              [
                "Marketing",
                "Opcional · desativado",
                "Remarketing e medição de campanhas (Meta, Google Ads).",
                "6 meses",
              ],
            ],
          },
        },
        {
          id: "gestao",
          kicker: "Gestão",
          title: "Como pode gerir as suas preferências",
          body: [
            "Na primeira visita ao site, é apresentado o banner de consentimento onde pode aceitar, recusar ou personalizar as suas escolhas.",
            'Pode rever e alterar as preferências a qualquer momento através do link "Preferências de cookies" no rodapé da página.',
          ],
          list: [
            "Recusar cookies não-essenciais não afeta a sua capacidade de comprar na loja.",
            "Pode também gerir cookies diretamente no seu navegador (ver documentação do Chrome, Firefox, Safari, Edge).",
            "Se apagar os cookies, o banner voltará a aparecer na próxima visita.",
          ],
        },
        {
          id: "parceiros",
          kicker: "Parceiros",
          title: "Cookies de terceiros",
          body: [
            "Utilizamos serviços de terceiros que podem colocar os seus próprios cookies. Todos foram avaliados do ponto de vista de privacidade e operam como subcontratantes nos termos do RGPD.",
          ],
          list: [
            "Stripe / Easypay — deteção de fraude durante o checkout (essencial).",
            "Cloudflare — segurança da conexão e mitigação de ataques (essencial).",
            "Plausible Analytics — estatísticas agregadas e anónimas, sem cookies persistentes.",
            "Meta Pixel e Google Ads — apenas se aceitar cookies de marketing.",
          ],
        },
        {
          id: "seguranca-cookies",
          kicker: "Segurança",
          title: "Segurança dos cookies",
          body: [
            "Todos os cookies que definimos têm o atributo Secure (transmitidos apenas em HTTPS) e SameSite=Lax por defeito. Os cookies que contêm dados sensíveis (autenticação) têm também HttpOnly, impedindo o acesso via JavaScript.",
          ],
        },
      ]}
    />
  );
}
