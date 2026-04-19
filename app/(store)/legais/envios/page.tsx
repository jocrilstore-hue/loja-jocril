import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de Envios — Jocril",
};

export default function EnviosPage() {
  return (
    <LegalPage
      kicker="Legal · Envios"
      title="Política de Envios."
      intro="Prazos, transportadoras, custos e procedimentos aplicáveis a todas as encomendas feitas na loja online Jocril."
      updated="17 Abril 2026"
      sections={[
        {
          id: "prazos",
          kicker: "Prazos",
          title: "Prazos de preparação e entrega",
          body: [
            "O prazo total de entrega é a soma do prazo de preparação (em armazém) e do prazo de transporte até ao destino. Os dois prazos são comunicados de forma independente no momento da encomenda.",
          ],
          table: {
            cols: "1fr 1fr 1fr",
            head: ["Tipo de produto", "Preparação", "Entrega"],
            rows: [
              ["Em stock (standard)", "24–48h úteis", "1–2 dias úteis"],
              ["À medida", "7–15 dias úteis", "1–2 dias úteis"],
              ["Séries com impressão", "5–10 dias úteis", "1–2 dias úteis"],
              ["Pré-encomenda", "Indicado em página", "1–2 dias úteis"],
            ],
          },
        },
        {
          id: "zonas",
          kicker: "Zonas",
          title: "Zonas de entrega e custos",
          table: {
            cols: "1.3fr 1fr 1fr 1fr",
            head: ["Destino", "Transportadora", "Prazo", "Preço"],
            rows: [
              ["Portugal continental", "DPD / CTT", "1–2 dias", "€ 6,90"],
              ["Madeira e Açores", "CTT Expresso", "4–6 dias", "€ 14,50"],
              ["Espanha peninsular", "DPD", "2–3 dias", "€ 12,00"],
              ["União Europeia", "DHL", "3–7 dias", "€ 22,00+"],
              ["Reino Unido e Suíça", "DHL", "5–10 dias", "Por orçamento"],
              [
                "Levantar na fábrica · Massamá",
                "—",
                "Imediato",
                "Grátis",
              ],
            ],
          },
        },
        {
          id: "portes-gratis",
          kicker: "Portes grátis",
          title: "Envio gratuito",
          list: [
            "Portugal continental: envio gratuito em encomendas superiores a €150 (antes de IVA).",
            "Clientes B2B com escalão 10+: envio gratuito em todas as encomendas.",
            "Campanhas pontuais comunicadas por email (inscreva-se na newsletter).",
          ],
        },
        {
          id: "pecas-grandes",
          kicker: "Volumes especiais",
          title: "Peças de grande dimensão",
          body: [
            "Peças com qualquer dimensão superior a 1,20 m ou peso acima de 30 kg são expedidas em pallet, por transportadora dedicada. Nestes casos, o custo é calculado individualmente e comunicado antes da confirmação final.",
            "Para entregas em andares sem elevador, ou com necessidade de equipamento especial, a Jocril poderá solicitar um adicional de serviço.",
          ],
        },
        {
          id: "seguimento",
          kicker: "Tracking",
          title: "Acompanhamento de encomendas",
          list: [
            "Enviamos email de confirmação assim que a encomenda é registada.",
            "Após expedição, receberá segundo email com o código de tracking e link da transportadora.",
            'Pode também consultar o estado da encomenda em "A minha conta" → "Encomendas" na loja.',
            "Em caso de ausência do destinatário, a transportadora deixa aviso e efetua segunda tentativa.",
          ],
        },
        {
          id: "problemas",
          kicker: "Incidências",
          title: "Danos no transporte e extravios",
          body: [
            "Todas as nossas expedições são seguradas. Se receber uma encomenda com embalagem visivelmente danificada, recusamos a entrega ou efetue reserva por escrito junto do estafeta.",
            "Reclamações por danos devem ser reportadas em até 24 horas após a receção, acompanhadas de fotografias, para geral@jocril.pt. Substituímos ou reembolsamos nos termos da garantia aplicável.",
          ],
        },
      ]}
    />
  );
}
