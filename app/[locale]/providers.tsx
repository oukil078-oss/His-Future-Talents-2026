"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/lib/theme";
import { LanguageProvider } from "@/context/LanguageContext";
import { bahij, neulis } from "@/lib/fonts";

export function Providers({ children, locale }: { children: React.ReactNode; locale: any }) {
  return (
    <LanguageProvider locale={locale} bahijClass={bahij.variable} neulisClass={neulis.variable}>
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </LanguageProvider>
  );
}
