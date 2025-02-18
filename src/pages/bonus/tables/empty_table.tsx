import { useState } from "react";
import { type BonusTableEnum } from "../bonus_tables";
import { Button } from "~/components/ui/button";
import { EmptyCreate } from "./empty_create";
import { getSchema } from "../schemas/get_schemas";

export function EmptyTable({ err_msg, selectedTableType }: { err_msg: string, selectedTableType: BonusTableEnum }) {
	const [alertOpen, setAlertOpen] = useState(true);
	return (
		<>
			<div className="flex grow items-center justify-center">
				<div className="text-center">
					<p>{err_msg}</p>
					<Button
						variant={"ghost"}
						onClick={() => setAlertOpen(true)}
					>
						Create
					</Button>
				</div>
				<EmptyCreate
					formSchema={getSchema(selectedTableType)}
					onClose={() => undefined}
					selectedTableType={selectedTableType}
					err_msg={err_msg}
					alertOpen={alertOpen}
					setAlertOpen={setAlertOpen}
				/>
			</div>
		</>
	);
}
