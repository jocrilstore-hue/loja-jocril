import type { ReactNode } from "react";
import { StoreThemeProvider } from "@/components/store/StoreTheme";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <StoreThemeProvider>
      <StoreHeader />
      {children}
      <StoreFooter />
    </StoreThemeProvider>
  );
}
