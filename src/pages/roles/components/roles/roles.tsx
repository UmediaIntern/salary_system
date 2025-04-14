import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { CircleFadingPlus } from "lucide-react";
import { api } from "~/utils/api";
import { useQueryHandle } from "~/components/query_boundary/query_handle";

export function Roles() {
    const allRoles = api.access.getAllAccess.useQuery()
    const {isPending, content, data} = useQueryHandle(allRoles)

    return (
		<div className="flex h-full flex-row">
			<Card className="h-full w-1/5">
				<CardHeader className="flex flex-row items-center">
					<div>
						<CardTitle>Roles</CardTitle>
						<CardDescription>Roles access</CardDescription>
					</div>
					<Button variant="outline" className="ml-auto">
						<CircleFadingPlus />
						Create
					</Button>
				</CardHeader>
				<CardContent>
                    {isPending ? content : (
                        data.map((access) => (<div key={access.id}>{access.role}</div>))
                    )}
                </CardContent>
			</Card>
		</div>
	);
}
