import {
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, Form } from "~/components/ui/form";
import { useTranslation } from "react-i18next";
import { Input } from "~/components/ui/input";

interface CalculateBudgetDialogProps {
    onSubmit: (budget: number) => void;
}

const calculateBudgetDialogSchema = z.object({
    budget: z.coerce.number().min(0),
});

export function CalculateBudgetDialog({ onSubmit: submit }: CalculateBudgetDialogProps) {
    const { t } = useTranslation(["common"]);

    const form = useForm<z.infer<typeof calculateBudgetDialogSchema>>({
        resolver: zodResolver(calculateBudgetDialogSchema)
    });

    const onSubmit = (data: z.infer<typeof calculateBudgetDialogSchema>) => {
        submit(data.budget);
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{t("form.calculate_budget.title")}</DialogTitle>
                <DialogDescription>
                    {t("form.calculate_budget.description")}
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                            <Input
                                type="number"
                                placeholder={t("form.calculate_budget.placeholder")}
                                {...field}
                            />
                        )}
                    />
                    <DialogFooter className="pt-4">
                        <Button type="submit">{t("button.confirm")}</Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}