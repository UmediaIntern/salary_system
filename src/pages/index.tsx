import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "./_app";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import Router from "next/router";


const PageHome: NextPageWithLayout = () => {
	const { data: session, status } = useSession();

	const { data, refetch } = api.access.accessByRole.useQuery(undefined, {
		enabled: false,
	});

	if (status === "loading") {
		return <p>Loading...</p>;
	}

	if (status === "unauthenticated") {
		void Router.push("/login");
	}

	if (status === "authenticated") {
		void refetch();
	}

	if (data && status === "authenticated") {
		if (data?.functions) {
			void Router.replace("/functions");
		} else {
			void Router.replace("/settings");
		}
	}

	return <></>;
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return <RootLayout>{page}</RootLayout>;
};

export default PageHome;
