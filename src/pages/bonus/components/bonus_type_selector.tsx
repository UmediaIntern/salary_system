import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "~/components/ui/select";
import { bonusTypeEnum, BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import dataTableContext from "./context/data_table_context";
import { DatePicker } from "~/components/ui/date-picker";
import { usePeriodContext } from "~/components/context/period_context_provider";

export function BonusTypeSelector({ setSelectedIndex }: { setSelectedIndex: (index: number) => void }) {
    const { t } = useTranslation("common");
    const { selectedBonusType, setSelectedBonusType, selectedIssueDate, setSelectedIssueDate } = useContext(dataTableContext);
    const { selectedPayDate } = usePeriodContext();
    const [tmpBonusType, setTmpBonusType] = useState<BonusTypeEnumType>(selectedBonusType);
    const [tmpIssueDate, setTmpIssueDate] = useState<Date | null>(selectedIssueDate ? selectedIssueDate : selectedPayDate);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("others.bonus_type")}</DialogTitle>
                <DialogDescription>
                    {t("others.select_bonus_type_and_issue_date")}
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center">
                <div className="flex w-full p-2">
                    <div className="flex-1">{t("others.bonus_type")}</div>
                    <div className="flex-1">
                        <Select
                            defaultValue={tmpBonusType}
                            onValueChange={(chosen) => {
                                setTmpBonusType(chosen as BonusTypeEnumType);
                            }}
                        >
                            <SelectTrigger className="h-full w-full">
                                <SelectValue placeholder={t("others.select_bonus_type_and_issue_date")} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{t('others.bonus_type')}</SelectLabel>
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
                </div>
                <div className="flex w-full p-2">
                    <div className="flex-1">
                        {t("table.bonus_issue_date")}
                    </div>
                    <div className="flex-1">
                        <DatePicker
                            date={tmpIssueDate ?? undefined}
                            setDate={(date: Date | undefined) => {
                                setTmpIssueDate(date ?? null);
                            }}
                        />
                    </div>
                </div>
            </div>
            <DialogClose asChild>
                <Button
                    onClick={() => {
                        setSelectedBonusType(tmpBonusType);
                        setSelectedIssueDate(tmpIssueDate);
                        setSelectedIndex(0);
                    }}
                >
                    {t("button.save")}
                </Button>
            </DialogClose>
        </DialogContent>
    );
};
