import type { ReactNode } from "react";
import { StoreThemeProvider } from "@/components/store/StoreTheme";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <StoreThemeProvider>
      <StoreHeader cart={[{ qty: 3 }]} />
      {children}
      <StoreFooter />
    </StoreThemeProvider>
  );
}
