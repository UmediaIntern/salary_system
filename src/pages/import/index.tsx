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
import { ExcelUpload } from "~/components/file_operations/excel_upload";
import { ValidateExcel } from "./validate_excel";
import { FileUploader } from "~/components/file_operations/file_uploader";

export function CarouselDApiDemo() {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	async function handleFileUpload(files: File[]) {
		if (files.length !== 1 || !files[0]) {
      // toast
			throw new Error("Only one file can be uploaded at a time");
		}
    const file: File = files[0];

    // const data = await extractData(file);
    // console.log("extracted data", data);
    // if (data) setData(data);
	}

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
		<Carousel setApi={setApi} className="flex h-full w-full flex-col">
			<CarouselContent className="h-full">
				<CarouselItem key={0}>
					<Card className="h-full">
						<CardContent className="flex h-full grow items-center justify-center p-6">
							<span className="text-4xl font-semibold">
                <FileUploader onUpload={handleFileUpload} />
							</span>
						</CardContent>
					</Card>
				</CarouselItem>
				<CarouselItem key={1}>
					<Card className="h-full">
						<CardContent className="flex h-full grow items-center justify-center p-0">
							<ValidateExcel />
						</CardContent>
					</Card>
				</CarouselItem>
				{/* {Array.from({ length: 4 }).map((_, index) => ( */}
				{/* 	<CarouselItem key={index + 1}> */}
				{/* 		<Card className="h-full"> */}
				{/* 			<CardContent className="flex h-full grow items-center justify-center p-6"> */}
				{/* 				<span className="text-4xl font-semibold"> */}
				{/* 					{index + 2} */}
				{/* 				</span> */}
				{/* 			</CardContent> */}
				{/* 		</Card> */}
				{/* 	</CarouselItem> */}
				{/* ))} */}
			</CarouselContent>

			<div className="flex h-16 w-full flex-row justify-between py-4">
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
