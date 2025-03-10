import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { onPromise } from "~/utils/on_promise";

export function LanguageSelector() {
	const router = useRouter();
	const { pathname, asPath, query } = router;

	async function setLanguage(language: string) {
		localStorage.setItem("language", language);
		document.cookie = `NEXT_LOCALE=${language}`;
		await router.push({ pathname, query }, asPath, { locale: language });
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Globe className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle language</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={onPromise(async () => await setLanguage("en"))}>
					English
				</DropdownMenuItem>
				<DropdownMenuItem onClick={onPromise(async () => await setLanguage("zh-TW"))}>
					繁體中文
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
