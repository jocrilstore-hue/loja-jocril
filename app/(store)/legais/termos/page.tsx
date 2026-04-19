import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Termos e Condições — Jocril",
};

export default function TermosPage() {
  return (
    <LegalPage
      kicker="Legal · Termos"
      title="Termos e Condições."
      intro="Termos gerais de venda e utilização da loja online Jocril. Ao efetuar uma encomenda, o cliente aceita integralmente as condições aqui descritas."
      updated="17 Abril 2026"
      sections={[
        {
          id: "objeto",
          kicker: "Objeto",
          title: "Objeto e âmbito",
          body: [
            "Os presentes termos regulam a venda de produtos acrílicos standard e personalizados através da loja online jocril.pt, operada pela Jocril — Sociedade Transformadora de Acrílicos, Lda.",
            "Ao efetuar uma encomenda, o cliente declara ter lido, compreendido e aceitado sem reservas as presentes condições, bem como a nossa Política de Privacidade e Política de Cookies.",
          ],
        },
        {
          id: "encomendas",
          kicker: "Encomendas",
          title: "Processo de encomenda",
          list: [
            "A colocação da encomenda é confirmada por email, contendo o número de referência, lista de artigos e valor total.",
            "A Jocril reserva-se o direito de recusar ou cancelar encomendas em caso de indisponibilidade de stock, erro manifesto no preço ou suspeita de fraude.",
            "Encomendas de peças personalizadas ou à medida apenas são aceites após confirmação de orçamento e pagamento antecipado de 50% do valor.",
          ],
        },
        {
          id: "precos",
          kicker: "Preços e pagamento",
          title: "Preços e modalidades de pagamento",
          body: [
            "Todos os preços apresentados incluem IVA à taxa legal em vigor (23%), salvo indicação expressa em contrário. Os custos de envio são calculados em função do destino e peso, sendo apresentados antes da finalização da compra.",
          ],
          table: {
            cols: "1fr 1.4fr 1fr",
            head: ["Método", "Prazo de liquidação", "Taxa aplicável"],
            rows: [
              ["MBWay", "Instantâneo", "Sem custos"],
              ["Multibanco", "Até 3 dias úteis", "Sem custos"],
              ["Cartão Visa / MC", "Instantâneo", "Sem custos"],
              ["Transferência", "Até 2 dias úteis", "Sem custos"],
              [
                "Conta corrente B2B",
                "Faturação 30 dias",
                "Sujeita a aprovação",
              ],
            ],
          },
        },
        {
          id: "envios",
          kicker: "Expedição",
          title: "Condições de expedição",
          list: [
            "Produtos em stock: expedição em 48h úteis após confirmação de pagamento.",
            "Produtos à medida: prazo definido em orçamento, tipicamente 7–15 dias úteis.",
            "Envios para Portugal continental: DPD, CTT Expresso ou SEUR (1–2 dias úteis).",
            "Envios para ilhas: 4–6 dias úteis. Europa continental: 3–7 dias úteis via DHL.",
            "Levantamento gratuito na fábrica (Massamá), mediante marcação prévia.",
          ],
        },
        {
          id: "devolucoes",
          kicker: "Devoluções",
          title: "Direito de livre resolução",
          body: [
            "Nos termos do Decreto-Lei 24/2014, o consumidor dispõe de 14 dias a contar da receção do produto para exercer o direito de livre resolução, sem necessidade de justificação.",
          ],
          list: [
            "O produto deve ser devolvido em embalagem original, sem sinais de utilização.",
            "Peças personalizadas, cortadas ou fabricadas à medida não são elegíveis para devolução (art.º 17.º, n.º 1, al. c) do mesmo diploma).",
            "O reembolso é efetuado no método de pagamento original, no prazo máximo de 14 dias após receção e inspeção do produto.",
            "Os custos de transporte de devolução são suportados pelo cliente, exceto em caso de defeito ou erro de envio.",
          ],
        },
        {
          id: "garantia",
          kicker: "Garantia",
          title: "Garantia legal de conformidade",
          body: [
            "Todos os produtos beneficiam da garantia legal de 3 anos para consumidores e 2 anos para profissionais, contados a partir da data de entrega, nos termos do Decreto-Lei 84/2021.",
            "A garantia não abrange desgaste por utilização indevida, danos acidentais ou alterações efetuadas pelo cliente.",
          ],
        },
        {
          id: "responsabilidade",
          kicker: "Responsabilidade",
          title: "Limitação de responsabilidade",
          body: [
            "A Jocril não poderá ser responsabilizada por atrasos ou impossibilidade de entrega resultantes de caso fortuito, força maior, greves ou eventos fora do seu controlo razoável.",
            "A responsabilidade da Jocril limita-se, em qualquer caso, ao valor da encomenda em causa, excluindo-se qualquer responsabilidade por danos indiretos ou lucros cessantes.",
          ],
        },
        {
          id: "litigios",
          kicker: "Resolução de litígios",
          title: "Resolução alternativa de litígios",
          body: [
            "Em caso de litígio, o consumidor pode recorrer às seguintes entidades de resolução alternativa de litígios de consumo:",
          ],
          list: [
            "CIAB — Centro de Informação, Mediação e Arbitragem de Consumo (ciab.pt).",
            "CNIACC — Centro Nacional de Informação e Arbitragem de Conflitos de Consumo (cniacc.pt).",
            "Plataforma europeia ODR — ec.europa.eu/consumers/odr.",
          ],
        },
        {
          id: "lei-aplicavel",
          kicker: "Lei aplicável",
          title: "Lei aplicável e foro",
          body: [
            "Os presentes termos regem-se pela lei portuguesa. Para dirimir qualquer litígio emergente da sua aplicação, as partes designam o foro da Comarca de Leiria, com expressa renúncia a qualquer outro.",
          ],
        },
      ]}
    />
  );
}
