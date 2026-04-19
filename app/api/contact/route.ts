import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactMessage } from "@/lib/email/send";

const contactSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  company: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Assunto é obrigatório"),
  message: z.string().min(10, "Mensagem demasiado curta"),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parse = contactSchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { success: false, error: "Dados inválidos", details: parse.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    await sendContactMessage(parse.data);
    return NextResponse.json({ success: true, message: "Mensagem enviada com sucesso" });
  } catch (error) {
    console.error("[POST /api/contact] unexpected:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao enviar mensagem" },
      { status: 500 }
    );
  }
}
