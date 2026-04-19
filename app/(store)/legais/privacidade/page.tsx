import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de Privacidade — Jocril",
};

export default function PrivacidadePage() {
  return (
    <LegalPage
      kicker="Legal · Privacidade"
      title="Política de Privacidade."
      intro="Como recolhemos, utilizamos e protegemos os seus dados pessoais. Este documento aplica-se a todos os visitantes, clientes e utilizadores registados da loja online Jocril."
      updated="17 Abril 2026"
      sections={[
        {
          id: "identificacao",
          kicker: "Responsável",
          title: "Identificação do responsável pelo tratamento",
          body: [
            "O responsável pelo tratamento dos dados pessoais recolhidos através deste website é a Jocril — Sociedade Transformadora de Acrílicos, Lda., com sede na Rua da Tipografia 14, 2415-560 Leiria, NIF 500 842 160.",
            "Para qualquer questão relacionada com a proteção de dados pessoais, poderá contactar o nosso Encarregado de Proteção de Dados (DPO) através de dpo@jocril.pt.",
          ],
        },
        {
          id: "dados-recolhidos",
          kicker: "Dados recolhidos",
          title: "Que dados recolhemos",
          body: [
            "Recolhemos apenas os dados necessários para prestar os nossos serviços, cumprir obrigações legais e melhorar a sua experiência na loja.",
          ],
          list: [
            "Dados de identificação: nome, NIF (se aplicável), data de nascimento.",
            "Dados de contacto: morada de entrega e faturação, email, telefone.",
            "Dados de conta: palavra-passe (cifrada), preferências de comunicação, histórico de encomendas.",
            "Dados de pagamento: tratados exclusivamente pelos nossos parceiros certificados PCI-DSS (Stripe, Easypay, PayPal). Nunca armazenamos dados de cartão.",
            "Dados técnicos: endereço IP, tipo de dispositivo, browser, páginas visitadas, tempo de permanência.",
          ],
        },
        {
          id: "finalidades",
          kicker: "Finalidades",
          title: "Para que utilizamos os seus dados",
          list: [
            "Processar e entregar encomendas, incluindo comunicação com transportadoras.",
            "Emitir faturas e cumprir obrigações fiscais e contabilísticas.",
            "Gerir a sua conta, devoluções e pedidos de apoio ao cliente.",
            "Enviar comunicações de marketing, apenas mediante consentimento prévio.",
            "Prevenir fraude, uso indevido e garantir a segurança da plataforma.",
            "Analisar estatísticas agregadas para melhorar o catálogo e a experiência de compra.",
          ],
        },
        {
          id: "base-legal",
          kicker: "Fundamento legal",
          title: "Fundamento jurídico do tratamento",
          body: [
            "O tratamento dos seus dados assenta em diferentes fundamentos legais, consoante a finalidade:",
          ],
          table: {
            cols: "1fr 2.2fr",
            head: ["Fundamento", "Aplicação"],
            rows: [
              [
                "Execução contratual",
                "Processamento de encomendas, entregas, devoluções, gestão de conta.",
              ],
              [
                "Obrigação legal",
                "Faturação, retenção fiscal, resposta a autoridades.",
              ],
              [
                "Interesse legítimo",
                "Prevenção de fraude, segurança, análise estatística agregada.",
              ],
              [
                "Consentimento",
                "Newsletter, cookies não-essenciais, comunicações promocionais.",
              ],
            ],
          },
        },
        {
          id: "conservacao",
          kicker: "Retenção",
          title: "Durante quanto tempo conservamos os dados",
          list: [
            "Dados de faturação: 10 anos (imposição legal).",
            "Dados de conta: enquanto a conta permanecer ativa ou até pedido de eliminação.",
            "Dados de encomendas: 5 anos após a última encomenda para efeitos de garantia e histórico.",
            "Dados de marketing: até ao momento em que retire o consentimento.",
            "Dados técnicos: até 13 meses após a última visita.",
          ],
        },
        {
          id: "partilha",
          kicker: "Subcontratantes",
          title: "Com quem partilhamos os seus dados",
          body: [
            "Partilhamos dados apenas com subcontratantes necessários à prestação do serviço, todos vinculados por contrato de tratamento de dados nos termos do RGPD.",
          ],
          list: [
            "Transportadoras: DPD, CTT Expresso, SEUR, DHL (para efeitos de entrega).",
            "Prestadores de pagamento: Stripe Payments Europe Ltd., Easypay, PayPal (Europe).",
            "Infraestrutura: Vercel Inc. (alojamento), Supabase (base de dados), Cloudflare (CDN e segurança).",
            "Contabilidade: gabinete certificado, sujeito a sigilo profissional.",
          ],
        },
        {
          id: "direitos",
          kicker: "Os seus direitos",
          title: "Direitos que pode exercer",
          body: [
            "Nos termos do Regulamento Geral sobre a Proteção de Dados, pode a qualquer momento:",
          ],
          list: [
            "Aceder aos seus dados pessoais e obter uma cópia dos mesmos.",
            "Solicitar a retificação de dados incorretos ou desatualizados.",
            'Solicitar a eliminação dos dados, quando aplicável ("direito ao esquecimento").',
            "Opor-se ao tratamento ou solicitar a sua limitação.",
            "Exercer o direito à portabilidade dos seus dados em formato estruturado.",
            "Apresentar reclamação junto da CNPD — Comissão Nacional de Proteção de Dados (cnpd.pt).",
          ],
        },
        {
          id: "seguranca",
          kicker: "Segurança",
          title: "Medidas de segurança",
          body: [
            "Todas as comunicações com a loja são cifradas em TLS 1.3. Palavras-passe são armazenadas com hash bcrypt. O acesso aos dados internos é limitado a colaboradores autorizados, sujeitos a NDA e formação regular em proteção de dados.",
            "Realizamos backups diários e auditorias de segurança trimestrais. Em caso de violação de dados, notificaremos a CNPD no prazo de 72 horas e, se aplicável, os titulares afetados.",
          ],
        },
      ]}
    />
  );
}
