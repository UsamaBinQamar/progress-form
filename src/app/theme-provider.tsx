"use client";

import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import type { ReactNode } from "react";
import { theme } from "./theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
}
