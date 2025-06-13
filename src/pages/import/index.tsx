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
import { ValidateExcel } from "./validate_excel";
import { FileUploader } from "~/components/file_operations/file_uploader";
import { extractData } from "~/components/file_operations/excel_upload_utils";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import {
	importFields,
	importFieldsKeys,
	type ImportFieldsType,
} from "~/server/api/types/import_type";
import { excelFieldMapping } from "./excel_mapping";

export function CarouselDApiDemo() {
	const [carouselApi, setCarouselApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const [data, setData] = useState<ImportFieldsType[]>([]);

	const importTransaction =
		api.importTransaction.importTransaction.useMutation();

	async function handleFileUpload(files: File[]) {
		if (files.length !== 1 || !files[0]) {
			// toast
			throw new Error("Only one file can be uploaded at a time");
		}
		const file: File = files[0];

		const data = await extractData(file);
		console.log("extracted data", data);
		if (data) {
			const value = Object.values(data)[0];
			if (value) {
				const header: any[] | undefined = value[0];
				if (!header) {
					console.log("No header in excel");
					return;
				}
				const indices: number[] = [];
				importFieldsKeys.options.forEach((key) => {
					const excelFieldName = excelFieldMapping[key];
					const idx = header.indexOf(excelFieldName);
					if (idx === -1) {
						console.log(`${excelFieldName} not found in excel`);
					}
					indices.push(idx);
					console.log(excelFieldName);
				});

				// Processing rows
				const transactionRows: ImportFieldsType[] = [];
				const excelRows = value.slice(1);
				let i = 0;
				for (const row of excelRows) {
					// console.log(row);
					const obj: Record<string, unknown> = {};
					importFieldsKeys.options.forEach((key, idx) => {
						const dataIdx = indices[idx];
						if (
							dataIdx != undefined &&
							dataIdx >= 0 &&
							row[dataIdx] != undefined
						) {
							obj[key] = row[dataIdx];
						} else {
							console.log(
								`${key} not found in excel idx=${idx} dataIdx=${dataIdx}`
							);
						}
					});

					const result = importFields.safeParse(obj);
					if (!result.success) {
						console.log(result.error.message);
						console.log(row, i, obj);
						i += 1;
						return;
					}
					if (!result.data) {
						console.log("No data");
						i += 1;
						return;
					}
					transactionRows.push(result.data);
					setData(transactionRows);
				}
			}
		}
	}

	function handleUpload() {
		console.log(data);
		importTransaction.mutate(data);
	}

	useEffect(() => {
		if (!carouselApi) {
			return;
		}

		setCount(carouselApi.scrollSnapList().length);
		setCurrent(carouselApi.selectedScrollSnap() + 1);

		carouselApi.on("select", () => {
			setCurrent(carouselApi.selectedScrollSnap() + 1);
		});
	}, [carouselApi]);

	return (
		<Carousel
			setApi={setCarouselApi}
			className="flex h-full w-full flex-col"
		>
			<CarouselContent className="h-full">
				<CarouselItem key={0}>
					<Card className="h-full">
						<CardContent className="flex h-full grow items-center justify-center p-6">
							<span className="text-4xl font-semibold">
								<FileUploader onUpload={handleFileUpload} />
							</span>
							<Button
								onClick={() => {
									handleUpload();
								}}
							>
								upload
							</Button>
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
