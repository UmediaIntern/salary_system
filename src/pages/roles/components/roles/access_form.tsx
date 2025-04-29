import { Save } from "lucide-react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Switch } from "~/components/ui/switch";
import { onPromise } from "~/utils/on_promise";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	type AccessFEType,
	updateAccessAPI,
} from "~/server/api/types/access_page_type";
import { type z } from "zod";
import { type PropsWithChildren, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { api } from "~/utils/api";
import { useRouter } from "next/router";

const accessiblePagesFormSchema = updateAccessAPI;
const fieldKey = accessiblePagesFormSchema.keyof();
type FormFieldKeyType = z.infer<typeof fieldKey>;

export function AccessForm({ selectedRole }: { selectedRole: AccessFEType }) {
	const form = useForm<z.infer<typeof accessiblePagesFormSchema>>({
		resolver: zodResolver(accessiblePagesFormSchema),
	});

	const { reset, watch } = form;
	const [isChange, setIsChange] = useState(false);

	const ctx = api.useUtils();
	const updateAccess = api.access.updateAccess.useMutation({
		onSuccess: () => {
			void ctx.access.invalidate();
		}
	});

	useEffect(() => {
		reset(selectedRole);
	}, [reset, selectedRole]);

	useEffect(() => {
		const { unsubscribe } = watch((value) => {
			let change = false;
			Object.entries(value).forEach(([key, value]) => {
				if (selectedRole?.hasOwnProperty(key)) {
					if (
						selectedRole[
							key as z.infer<typeof fieldKey>
						].toString() !== value.toString()
					) {
						change = true;
					}
				}
			});
			setIsChange(change);
		});
		return () => unsubscribe();
	}, [selectedRole, watch]);


  const router = useRouter();

  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (isChange) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = (url: string) => {
      if (isChange && !confirm('You have unsaved changes, do you really want to leave?')) {
        // Cancel route change
        router.events.emit('routeChangeError');
        throw 'Route change aborted';
      }
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [isChange, router]);

	const onSubmit = (values: z.infer<typeof accessiblePagesFormSchema>) => {
		console.log("Submitted values:", values);
		setIsChange(false);
		updateAccess.mutate(values);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={onPromise<void>(form.handleSubmit(onSubmit))}
				className="w-full space-y-6"
			>
				<div>
					<h3 className="mb-4 text-2xl font-bold">Pages</h3>
					<div className="space-y-4">
						<FormSwitchFieldComp form={form} name="functions" />
						<FormSwitchFieldComp form={form} name="synchronize" />

						<FormSwitchFieldComp form={form} name="employees">
							<FormSwitchFieldComp
								form={form}
								name="employees_write"
							/>
							<FormField
								key={"employees_r_lv"}
								control={form.control}
								name={"employees_r_lv"}
								render={({ field }) => (
									<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
										<div className="min-w-[300px] space-y-0.5">
											<FormLabel>Username</FormLabel>
											<FormDescription>
												This is your public display
												name.
											</FormDescription>
										</div>
										<FormControl>
											<Input
												className="max-w-[100px]"
												placeholder="shadcn"
												type="number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp form={form} name="parameters">
							<FormSwitchFieldComp
								form={form}
								name="parameters_write"
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp form={form} name="bonus" />

						<FormSwitchFieldComp form={form} name="calendar">
							<FormSwitchFieldComp
								form={form}
								name="calendar_write"
							/>
						</FormSwitchFieldComp>

						<FormSwitchFieldComp disabled form={form} name="settings" />
						<FormSwitchFieldComp form={form} name="roles" />
						<FormSwitchFieldComp form={form} name="report" />
					</div>
				</div>
				<div className="flex w-full flex-row justify-end">
					<Button className="ml-auto" disabled={!isChange}>
						<Save />
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}

interface FormSwitchFieldCompProps {
	form: UseFormReturn<z.infer<typeof accessiblePagesFormSchema>>;
	name: FormFieldKeyType;
	disabled?: boolean;
}
function FormSwitchFieldComp({
	children,
	form,
	name,
	disabled = false,
}: PropsWithChildren<FormSwitchFieldCompProps>) {
	return (
		<FormField
			key={name}
			control={form.control}
			name={name}
			render={({ field }) => (
				<FormItem className="flex flex-col rounded-lg border p-3 shadow-sm">
					<FormItemComp label={name}>
						<Switch
							disabled={disabled}
							checked={field.value === true}
							onCheckedChange={field.onChange}
						/>
					</FormItemComp>
					{field.value && children}
				</FormItem>
			)}
		/>
	);
}

function FormItemComp({
	label,
	children,
}: PropsWithChildren<{ label: string }>) {
	return (
		<div className="flex flex-row items-center justify-between">
			<FormDescComp label={label} />
			<FormControl>{children}</FormControl>
		</div>
	);
}

function FormDescComp({ label }: { label: string }) {
	return (
		<div className="space-y-0.5">
			<FormLabel>{label}</FormLabel>
			<FormDescription>
				Access the functions in the
				{label} page.
			</FormDescription>
		</div>
	);
}
