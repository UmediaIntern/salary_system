import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { useCallback, useState } from "react";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { useRouter } from "next/router";
import { toast } from "~/components/ui/use-toast";
import { signIn } from "next-auth/react";

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n, locales } from '~/components/lang_config'
import { useTranslation } from "next-i18next";


const LoginFormSchema = z.object({
	userid: z.string(),
	password: z.string().min(1, { message: "others.enter_password" }),
});

export default function Login() {
	const [forgetPwd, setForgetPwd] = useState(false);

	const router = useRouter();

	const { t } = useTranslation(["common"]);

	const form = useForm<z.infer<typeof LoginFormSchema>>({
		resolver: zodResolver(LoginFormSchema),
		defaultValues: {
			userid: "",
			password: "",
		},
	});

	const onSubmit = useCallback(
		async (data: z.infer<typeof LoginFormSchema>) => {
			const res = await signIn("credentials", {
				username: data.userid,
				password: data.password,
				callbackUrl: "/",
				redirect: false,
			});

			if (!res?.ok) {
				console.log(`error ${res?.error}`);
				toast({
					title: "Error",
					description: (
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-scroll">
							<code className="text-white">
								{res?.error}
							</code>
						</pre>
					),
				});
			} else {
				void router.push("/");
			}
		},
		[router]
	);

	return (
		<PerpageLayout pageTitle="login">
			<div className="mt-[15vh] flex justify-center align-middle">
				{!forgetPwd ? (
					<Card className="w-[400px]">
						<Form {...form}>
							<form
								onSubmit={(event) =>
									void form.handleSubmit(onSubmit)(event)
								}
							>
								<CardHeader>
									<div className="justify-center">
										<CardTitle>{t("others.login")}</CardTitle>
									</div>
								</CardHeader>
								<CardContent className="space-y-2">
									<FormField
										control={form.control}
										name="userid"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t("others.user_id")}</FormLabel>
												<FormControl>
													<Input
														placeholder={t("others.user_id")}
														{...field}
													/>
												</FormControl>
												<FormDescription>
													{t("others.your_employee_id")}
												</FormDescription>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>{t("others.password")}</FormLabel>
												<FormControl>
													<Input
														placeholder={t("others.password")}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="pt-4 text-right">
										<button
											type="button"
											onClick={() => setForgetPwd(true)}
											className="text-sm text-muted-foreground"
										>
											{t("others.reset_password")}
										</button>
									</div>
								</CardContent>
								<CardFooter className="justify-center">
									<Button
										disabled={form.formState.isSubmitting}
										type="submit"
									>
										{t("button.login")}
									</Button>
								</CardFooter>
							</form>
						</Form>
					</Card>
				) : (
					<Card className="w-[400px]">
						<CardHeader>
							<div className="justify-center">
								<CardTitle>{t("others.reset_password")}</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label htmlFor="name">{t("others.user_id")}</Label>
								<Input id="userid" placeholder={t("others.user_id")} />
							</div>
							<div className="pt-4 text-right">
								<button
									onClick={() => setForgetPwd(false)}
									className="text-sm text-muted-foreground"
								>
									{t("button.login")}
								</button>
							</div>
						</CardContent>
						<CardFooter className="justify-center">
							<Button>{t("others.reset_password")}</Button>
						</CardFooter>
					</Card>
				)}
			</div>
		</PerpageLayout>
	);
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return ({props: {
    ...(await serverSideTranslations(locale, ["common", "nav"], i18n, locales)),
  }});
};

