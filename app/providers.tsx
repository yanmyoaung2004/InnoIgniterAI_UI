"use client";

import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider>
			<AuthProvider>{children}</AuthProvider>
		</ThemeProvider>
	);
}
