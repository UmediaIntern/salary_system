import { RootLayout } from "~/components/layout/root_layout";

import { type NextPageWithLayout } from "../_app";
import { useEffect, useState, type ReactElement } from "react";
import { Header } from "~/components/header";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { useTranslation } from "react-i18next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, locales } from "~/components/lang_config";

import { Card, CardContent } from "~/components/ui/card";
import {
	Carousel,
	CarouselContent,
	CarouselDots,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
	type CarouselApi,
} from "~/components/ui/carousel";

export function CarouselDApiDemo() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
			<Carousel setApi={setApi} className="flex flex-col w-full h-full">
				<CarouselContent className="h-full">
					{Array.from({ length: 5 }).map((_, index) => (
						<CarouselItem key={index}>
							<Card className="h-full">
								<CardContent className="grow h-full flex items-center justify-center p-6">
									<span className="text-4xl font-semibold">
										{index + 1}
									</span>
								</CardContent>
							</Card>
						</CarouselItem>
					))}
				</CarouselContent>

				<div className="flex w-full flex-row justify-between py-4 h-16">
					<CarouselDots />
					<div className="flex flex-row gap-2">
						<CarouselPrevious className="relative left-0 right-0 top-0 translate-x-0 translate-y-0" />
						<div className="py-2 text-center text-sm text-muted-foreground">
							Slide {current} of {count}
						</div>
						<CarouselNext className="relative left-0 right-0 top-0 translate-x-0 translate-y-0" />
					</div>
				</div>
			</Carousel>
	);
}
const PageImport: NextPageWithLayout = () => {
	const { t } = useTranslation(["nav", "common"]);

	return (
		<div className="flex h-full w-full flex-col">
			{/* header */}
			<Header title={t("import")} showOptions />
			<div className="flex h-0 grow flex-col p-4">
				<CarouselDApiDemo />
			</div>
		</div>
	);
};

PageImport.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="import">{page}</PerpageLayoutNav>
		</RootLayout>
	);
};

export default PageImport;

export const getStaticProps = async ({ locale }: { locale: string }) => {
	return {
		props: {
			...(await serverSideTranslations(
				locale,
				["common", "nav"],
				i18n,
				locales
			)),
		},
	};
};
