import type { PropsWithChildren } from "react";
import { ThemeProvider } from "~/components/theme_provider";
import { Toaster } from "~/components/ui/toaster";
import { Toaster as SonnerToaster } from "~/components/ui/sonner"

export const RootLayout = (props: PropsWithChildren) => {
	return (
		<main className="h-full w-full">
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{props.children}
			</ThemeProvider>
			<Toaster />
      <SonnerToaster />
		</main>
	);
};
