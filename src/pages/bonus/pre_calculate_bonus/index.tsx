import { RootLayout } from "~/components/layout/root_layout";
import { type NextPageWithLayout } from "../../_app";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";
import { ReactElement, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { bonusTypeEnum, BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import dataTableContext from "../components/context/data_table_context";
import DataTableContextProvider from "../components/context/data_table_context_provider";
import { ProgressBar } from "~/components/functions/progress_bar";
import { Button } from "~/components/ui/button";
import BonusFilter from "./bonus_filter";
import BonusBudget from "./bonus_budget";
import BonusExcelExport from "./bonus_excel_export";


type BonusStepPage = {
    title: string;
    page: ReactElement;
};

const BonusHomePageContent = () => {
    const { t } = useTranslation(['common', 'nav']);
    const { selectedBonusType, setSelectedBonusType } = useContext(dataTableContext);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const pageList: BonusStepPage[] = [
        {
            title: t("others.bonus_filter"),
            page: (
                <BonusFilter />
            ),
        },
        {
            title: t("others.bonus_budget"),
            page: (
                <BonusBudget />
            ),
        },
        {
            title: t("others.bonus_excel_export"),
            page: (
                <BonusExcelExport />
            ),
        },
    ];
    const titles: string[] = pageList.map((page) => page.title);

    return (
        <div className="flex h-full flex-col">
            <Header title={t("bonus", { ns: "nav" })} showOptions className="mb-4" />
            <div className="flex flex-row items-start">
                <div className="ml-4 h-full min-w-[140px]">
                    <Select
                        defaultValue={selectedBonusType}
                        onValueChange={(chosen) => {
                            setSelectedBonusType(chosen as BonusTypeEnumType);
                            setSelectedIndex(0);
                        }}
                    >
                        <SelectTrigger className="h-full w-full">
                            <SelectValue placeholder={t("others.select_period")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>{t('others.period')}</SelectLabel>
                                {Object.values(bonusTypeEnum.Enum).map((bonus_type) => {
                                    return (
                                        <SelectItem
                                            key={bonus_type}
                                            value={bonus_type}
                                        >
                                            {t(`table.${bonus_type}`)}
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grow mx-4">
                    <ProgressBar labels={titles} selectedIndex={selectedIndex} />
                </div>
            </div>
            <div className="m-4 flex grow min-h-0">
                {pageList[selectedIndex]?.page ?? <></>}
            </div>
            <div className="mx-4 mb-4 flex justify-between">
                {selectedIndex != 0 ? <Button onClick={() => setSelectedIndex(selectedIndex - 1)}>
                    {t("button.previous_step")}
                </Button> : <div></div>}
                {selectedIndex != titles.length - 1 ? <Button onClick={() => setSelectedIndex(selectedIndex + 1)}>
                    {t("button.next_step")}
                </Button> : <div></div>}
            </div>
        </div>
    );
};

const BonusHomePage: NextPageWithLayout = () => {
    return (
        <DataTableContextProvider>
            <BonusHomePageContent />
        </DataTableContextProvider>
    );
};

BonusHomePage.getLayout = function getLayout(page: React.ReactElement) {
    return (
        <RootLayout>
            <PerpageLayoutNav pageTitle="Bonus">{page}</PerpageLayoutNav>
        </RootLayout>
    );
};

export default BonusHomePage;

export const getStaticProps = async ({ locale }: { locale: string }) => {
    return ({
        props: {
            ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
        }
    });
};
