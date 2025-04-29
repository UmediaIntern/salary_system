import { useRouter } from "next/router";
import { useEffect } from "react";

export function useExitWarning(on: boolean) {
	const router = useRouter();

	useEffect(() => {
		const handleWindowClose = (e: BeforeUnloadEvent) => {
			if (on) {
				e.preventDefault();
				e.returnValue = ""; // Required for Chrome to display the alert
			}
		};

		const handleRouteChange = (url: string) => {
			if (
				on &&
				!confirm(
					"You have unsaved changes, do you really want to leave?"
				)
			) {
				// Cancel route change
				router.events.emit("routeChangeError");
				throw "Route change aborted";
			}
		};

		window.addEventListener("beforeunload", handleWindowClose);
		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			window.removeEventListener("beforeunload", handleWindowClose);
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, [on, router]);
}

