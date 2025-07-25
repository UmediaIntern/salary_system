import { type UseQueryResult } from "@tanstack/react-query";
import { type TRPCClientErrorLike } from "@trpc/client";
import { type InferrableClientTypes } from "@trpc/server/unstable-core-do-not-import";
import { LoadingSpinner } from "~/components/loading";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { Position } from "@xyflow/react";

interface QueryHandleDone<TData> {
	data: TData;
	isPending: false;
	content: undefined;
}
interface QueryHandleWait {
	data: undefined;
	isPending: true;
	content: ReactNode;
}

export function useQueryHandle<TData, TError extends InferrableClientTypes>(
	query: Pick<
		UseQueryResult<TData, TRPCClientErrorLike<TError>>,
		"data" | "isPending" | "isError" | "error"
	>,
): QueryHandleDone<TData> | QueryHandleWait {
	const { data, isPending, isError, error } = query;

	const toastIdRef = useRef<string | number | undefined>();

	useEffect(() => {
		if (isPending) {
			toastIdRef.current = toast.loading("Loading…", { position: "bottom-right", duration: 500});
		} else if (toastIdRef.current) {
			toast.success("Load success", { id: toastIdRef.current });
			toastIdRef.current = undefined;
		}
	}, [isPending]);

	if (isPending) {
		return {
			data: undefined,
			isPending: true,
			content: (
				<div className="flex grow items-center justify-center">
					<LoadingSpinner />
				</div>
			),
		};
	}

	if (isError || data === undefined) {
		if (error) toast.error(error.message);
		return {
			data: undefined,
			isPending: true,
			content: <span>Error: {error?.message}</span>,
		};
	}

	return { data: data, isPending: false, content: undefined };
}
