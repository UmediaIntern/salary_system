import { RootLayout } from "~/components/layout/root_layout";
import { api } from "~/utils/api";
import { UserAvatar } from "~/components/user_avatar";
import { ThemeSelector } from "~/components/theme_selector";
import {
	CardFunction,
	CardFunctionIcon,
} from "~/components/functions/card_function";
import type { CardFunctionData } from "~/components/functions/card_function";
import { motion } from "framer-motion";
import { type NextPageWithLayout } from "./_app";
import { PerpageLayout } from "~/components/layout/perpage_layout";
import { IconCoins } from "~/components/icons/svg_icons";
import { Separator } from "~/components/ui/separator";

const function_data: CardFunctionData[] = [
	{
		title: "計算月薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算年薪",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算分紅",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
	{
		title: "計算津貼",
		iconPath: "./icons/coins.svg",
		subscript: "some notes",
	},
];

const container = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.1,
		},
	},
};

const stagger = {
	hidden: { opacity: 0, y: -100 },
	visible: { opacity: 1, y: 0 },
};

const PageHome: NextPageWithLayout = () => {
	// const hello = api.example.hello.useQuery({ text: "from tRPC" });

	return (
		<>
			<div className="my-4 flex">
				<h2 className="text-2xl font-semibold tracking-tight">
					Functions
				</h2>
				<div className="align-bot ml-auto flex items-center space-x-1">
					<ThemeSelector />
					<UserAvatar />
				</div>
			</div>
			<Separator /> <br />
			<motion.div
				className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
				variants={container}
				initial="hidden"
				animate="visible"
			>
				{function_data.map((f_data: CardFunctionData) => (
					<motion.div
						key={f_data.title}
						variants={stagger}
						className="cursor-pointer"
					>
						<CardFunction
							title={f_data.title}
							iconPath={f_data.iconPath}
							subscript={f_data.subscript}
						>
							<CardFunctionIcon className="text-foreground">
								<IconCoins />
							</CardFunctionIcon>
						</CardFunction>
					</motion.div>
				))}
			</motion.div>
		</>
	);
};

PageHome.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<RootLayout>
			<PerpageLayout pageTitle="functions">{page}</PerpageLayout>
		</RootLayout>
	);
};

export default PageHome;
