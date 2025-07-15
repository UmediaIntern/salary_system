import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { api } from "~/utils/api";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "~/styles/globals.css";
import { RootLayout } from "~/components/layout/root_layout";
import { appWithTranslation } from 'next-i18next'
import nextI18nConfig from '../../next-i18next.config.mjs';
import '@xyflow/react/dist/style.css';

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
	P,
	IP
> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps<{ session: Session | null }> & {
	Component: NextPageWithLayout;
};

const defaultLayout = (page: ReactElement): ReactNode => {
	return <RootLayout>{page}</RootLayout>;
};

const MyApp = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? defaultLayout;

	return (
		<SessionProvider session={session}>
			{getLayout(<Component {...pageProps} />)}
		</SessionProvider>
	);
};

export default api.withTRPC(appWithTranslation(MyApp, nextI18nConfig));
