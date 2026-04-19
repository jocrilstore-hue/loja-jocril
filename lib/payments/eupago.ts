import { z } from "zod";

// Environment validation
const EUPAGO_API_KEY = process.env.EUPAGO_API_KEY;
const EUPAGO_BASE_URL = process.env.EUPAGO_BASE_URL || "https://clientes.eupago.pt";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jocril-store.vercel.app";
const WEBHOOK_URL = `${SITE_URL}/api/webhooks/eupago`;

// Response schemas
const multibancoResponseSchema = z.object({
  sucesso: z.boolean(),
  estado: z.number(),
  resposta: z.string(),
  referencia: z.string().optional(),
  entidade: z.string().optional(),
  valor: z.number().optional(),
});

const mbwayResponseSchema = z.object({
  sucesso: z.boolean(),
  estado: z.number(),
  resposta: z.string(),
  referencia: z.string().optional(),
  valor: z.number().optional(),
});

// Callback schema (what EuPago sends to our webhook)
export const eupagoCallbackSchema = z.object({
  valor: z.coerce.number(),
  canal: z.string(),
  referencia: z.string(),
  transacao: z.string(),
  identificador: z.string(),
  mp: z.string().optional(),
  data: z.string(),
  entidade: z.string().optional(),
  chave_api: z.string(),
});

export type EuPagoCallback = z.infer<typeof eupagoCallbackSchema>;

// Error type
export class EuPagoError extends Error {
  constructor(
    message: string,
    public code?: number,
    public details?: string
  ) {
    super(message);
    this.name = "EuPagoError";
  }
}

// Types
export interface MultibancoResult {
  entity: string;
  reference: string;
  amount: number;
  deadline: Date;
}

export interface MBWayResult {
  reference: string;
  amount: number;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatReference(reference: string): string {
  return reference.replace(/(\d{3})(?=\d)/g, "$1 ");
}

export function validatePhoneNumber(phone: string): boolean {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("351") && cleaned.length > 9) {
    cleaned = cleaned.substring(3);
  }
  return /^9[1236]\d{7}$/.test(cleaned);
}

export function formatPhoneForEuPago(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("351") && cleaned.length > 9) {
    cleaned = cleaned.substring(3);
  }
  return `351${cleaned}`;
}

export function maskPhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("351") && cleaned.length > 9) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.length < 9) return phone;
  return `${cleaned.slice(0, 3)}***${cleaned.slice(-3)}`;
}

export async function createMultibancoReference(
  orderId: string,
  amount: number,
  deadlineHours: number = 24
): Promise<MultibancoResult> {
  if (!EUPAGO_API_KEY) {
    throw new EuPagoError("Configuração de pagamento em falta", 500);
  }

  const now = new Date();
  const deadline = new Date(now.getTime() + deadlineHours * 60 * 60 * 1000);

  const payload = {
    chave: EUPAGO_API_KEY,
    valor: Number(amount.toFixed(2)),
    id: orderId,
    per_dup: 0,
    data_inicio: formatDate(now),
    data_fim: formatDate(deadline),
    callback: WEBHOOK_URL,
  };

  try {
    const response = await fetch(
      `${EUPAGO_BASE_URL}/clientes/rest_api/multibanco/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new EuPagoError(
        "Erro ao comunicar com o serviço de pagamento",
        response.status
      );
    }

    const data = await response.json();
    const parsed = multibancoResponseSchema.safeParse(data);

    if (!parsed.success) {
      console.error("Invalid EuPago response:", data);
      throw new EuPagoError("Resposta inválida do serviço de pagamento");
    }

    if (!parsed.data.sucesso || !parsed.data.referencia || !parsed.data.entidade) {
      throw new EuPagoError(
        parsed.data.resposta || "Erro ao gerar referência Multibanco",
        parsed.data.estado
      );
    }

    return {
      entity: parsed.data.entidade,
      reference: parsed.data.referencia,
      amount: parsed.data.valor || amount,
      deadline,
    };
  } catch (error) {
    if (error instanceof EuPagoError) throw error;
    console.error("EuPago Multibanco error:", error);
    throw new EuPagoError("Erro ao processar pagamento. Tente novamente.");
  }
}

export async function createMBWayPayment(
  orderId: string,
  amount: number,
  phoneNumber: string
): Promise<MBWayResult> {
  if (!EUPAGO_API_KEY) {
    throw new EuPagoError("Configuração de pagamento em falta", 500);
  }

  if (!validatePhoneNumber(phoneNumber)) {
    throw new EuPagoError("Número de telemóvel inválido. Use formato 9XXXXXXXX");
  }

  let cleanedPhone = phoneNumber.replace(/\D/g, "");
  if (cleanedPhone.startsWith("351") && cleanedPhone.length > 9) {
    cleanedPhone = cleanedPhone.substring(3);
  }

  const payload = {
    payment: {
      identifier: orderId,
      amount: {
        value: Number(amount.toFixed(2)),
        currency: "EUR",
      },
      customerPhone: cleanedPhone,
      countryCode: "+351",
      successUrl: `${SITE_URL}/checkout/sucesso`,
      failUrl: `${SITE_URL}/checkout`,
      backUrl: `${SITE_URL}/carrinho`,
      lang: "PT",
    },
    customer: {
      notify: true,
    },
  };

  try {
    const apiUrl = EUPAGO_BASE_URL.includes("sandbox")
      ? "https://sandbox.eupago.pt/api/v1.02/mbway/create"
      : "https://clientes.eupago.pt/api/v1.02/mbway/create";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${EUPAGO_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("MB Way API error response:", data);
      throw new EuPagoError(
        data.message || data.resposta || "Erro ao comunicar com o serviço de pagamento",
        response.status
      );
    }

    if (data.transactionStatus === "Success" || data.sucesso === true) {
      return {
        reference: data.reference || data.referencia || orderId,
        amount: data.amount?.value || data.valor || amount,
      };
    }

    console.error("MB Way payment failed:", data);
    throw new EuPagoError(
      data.message || data.resposta || "Erro ao iniciar pagamento MB Way",
      data.transactionStatus || data.estado
    );
  } catch (error) {
    if (error instanceof EuPagoError) throw error;
    console.error("EuPago MB Way error:", error);
    throw new EuPagoError("Erro ao processar pagamento. Tente novamente.");
  }
}

// Silence unused-warn for schema we keep for future REST v0 parity if needed
void mbwayResponseSchema;

export function verifyCallback(payload: unknown): EuPagoCallback | null {
  const parsed = eupagoCallbackSchema.safeParse(payload);
  if (!parsed.success) {
    console.error("Invalid EuPago callback:", payload, parsed.error);
    return null;
  }
  if (EUPAGO_API_KEY && parsed.data.chave_api !== EUPAGO_API_KEY) {
    console.error("EuPago callback: API key mismatch");
    return null;
  }
  return parsed.data;
}
