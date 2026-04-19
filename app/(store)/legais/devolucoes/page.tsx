import LegalPage from "@/components/legal/LegalPage";

export const metadata = {
  title: "Política de Devoluções — Jocril",
};

export default function DevolucoesPage() {
  return (
    <LegalPage
      kicker="Legal · Devoluções"
      title="Política de Devoluções."
      intro="Condições aplicáveis a pedidos de devolução, troca e reembolso. Procuramos resolver qualquer situação com rapidez e transparência."
      updated="17 Abril 2026"
      sections={[
        {
          id: "prazo-legal",
          kicker: "Prazo",
          title: "Prazo de livre resolução",
          body: [
            "De acordo com o Decreto-Lei 24/2014, dispõe de 14 dias a contar da data de receção para exercer o direito de livre resolução, sem necessidade de justificar a sua decisão.",
            "Este prazo aplica-se exclusivamente a consumidores finais, no âmbito de contratos celebrados à distância.",
          ],
        },
        {
          id: "elegibilidade",
          kicker: "Elegibilidade",
          title: "Produtos elegíveis e excluídos",
          body: [
            "Nem todos os produtos são elegíveis para devolução livre. A tabela seguinte clarifica as situações mais comuns:",
          ],
          table: {
            cols: "1.6fr 1fr 1.4fr",
            head: ["Situação", "Elegível", "Observações"],
            rows: [
              [
                "Produto standard em embalagem original",
                "Sim",
                "Até 14 dias após receção",
              ],
              [
                "Produto standard com sinais de utilização",
                "Não",
                "Exceto defeito de fabrico",
              ],
              [
                "Peça à medida ou personalizada",
                "Não",
                "Art.º 17.º, n.º 1, al. c) DL 24/2014",
              ],
              [
                "Produto com defeito ou dano de transporte",
                "Sim",
                "Custo total a cargo da Jocril",
              ],
              [
                "Erro de envio por parte da Jocril",
                "Sim",
                "Custo total a cargo da Jocril",
              ],
              [
                "Produtos descontinuados ou outlet",
                "Caso a caso",
                "Ver condições na ficha",
              ],
            ],
          },
        },
        {
          id: "processo",
          kicker: "Processo",
          title: "Como iniciar uma devolução",
          list: [
            'Aceder a "A minha conta" → "Encomendas" e selecionar "Pedir devolução" na encomenda em causa.',
            "Indicar os artigos a devolver e o motivo. Receberá por email a etiqueta de devolução pré-paga (quando aplicável) e instruções.",
            "Embalar os produtos na caixa original, protegendo-os adequadamente.",
            "Entregar o volume ao transportador indicado. O cliente é responsável pela entrega em bom estado.",
            "Após receção e inspeção (até 5 dias úteis), confirmaremos a aceitação e processaremos o reembolso.",
          ],
        },
        {
          id: "reembolso",
          kicker: "Reembolso",
          title: "Forma e prazo de reembolso",
          body: [
            "O reembolso é efetuado no método de pagamento utilizado na encomenda original, no prazo máximo de 14 dias a contar da data em que foi comunicada a decisão de resolução.",
            "Reservamo-nos o direito de reter o reembolso até à receção efetiva dos produtos ou até prova do envio dos mesmos, conforme ocorra primeiro.",
          ],
          list: [
            "MBWay / Cartão: crédito automático, 3–7 dias úteis para estar visível no banco.",
            "Multibanco / Transferência: reembolso por transferência para o IBAN que nos indicar.",
            "PayPal: crédito na conta PayPal associada à compra.",
            "Conta corrente B2B: nota de crédito emitida e abatida na próxima fatura.",
          ],
        },
        {
          id: "trocas",
          kicker: "Trocas",
          title: "Trocas de dimensão ou cor",
          body: [
            "Facilitamos trocas de produtos standard por outra referência, cor ou dimensão disponível no catálogo. O processo é o mesmo de uma devolução, sendo a nova encomenda processada após receção do artigo original.",
            "Eventuais diferenças de preço são reembolsadas ou cobradas consoante o caso.",
          ],
        },
        {
          id: "defeitos",
          kicker: "Defeitos",
          title: "Produtos defeituosos ou danificados",
          body: [
            "Se receber um produto com defeito ou danificado no transporte, comunique-nos em até 24 horas para geral@jocril.pt, acompanhado de fotografias detalhadas.",
            "Em caso confirmado, assumimos a totalidade dos custos de devolução e substituímos o produto com prioridade máxima, ou procedemos ao reembolso integral.",
          ],
        },
      ]}
    />
  );
}
