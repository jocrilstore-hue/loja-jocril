import { redirect } from "next/navigation";

export default function AdminLoginPage() {
  redirect("/entrar?redirect_url=/admin");
}
