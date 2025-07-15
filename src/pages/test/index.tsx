// S123alary
import { NextPageWithLayout } from "../_app";
import { ReactElement } from "react";
import { RootLayout } from "~/components/layout/root_layout";
import { PerpageLayoutNav } from "~/components/layout/perpage_layout_nav";
import { Header } from "~/components/header";

import {
	Document,
	Page,
	Text,
	View,
	StyleSheet,
	PDFDownloadLink,
	PDFViewer,
	Font,
} from "@react-pdf/renderer";

import lightFont from "./fonts/LXGWWenKaiMonoTC-Light.ttf";
import boldFont from "./fonts/LXGWWenKaiMonoTC-Regular.ttf";

Font.register({
	family: "bold",
	src: boldFont,
});

Font.register({
	family: "light",
	src: lightFont,
});

const styles = StyleSheet.create({
	page: {
		padding: 20,
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
		fontFamily: "bold",
	},
	text: {
		fontSize: 12,
		textAlign: "left",
		fontFamily: "light",
		marginBottom: 10,
	},
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	column: {
		padding: 5,
		width: "24%", // 确保兩列之間有間隔
	},
});

const MyDocument = () => (
	<Document title="TEST">
		<Page style={styles.page}>
			<View>
                {/* TITLE */}
				<Text style={styles.title}>林暄皓好強</Text>
				<View style={styles.container}>
                    {/* Column 1 */}
					<View style={styles.column}>
						<Text style={styles.text}>Howard真的好猛</Text>
						<Text style={styles.text}>Howard跟鬼一樣</Text>
					</View>
                    {/* Column 2 */}
					<View style={styles.column}>
						<Text style={styles.text}>Howard人生勝利組</Text>
						<Text style={styles.text}>Howard世界第一</Text>
					</View>
                    {/* Column 3 */}
					<View style={styles.column}>
						<Text style={styles.text}>Howard真的好猛</Text>
						<Text style={styles.text}>Howard跟鬼一樣</Text>
					</View>
                    {/* Column 4 */}
					<View style={styles.column}>
						<Text style={styles.text}>Howard人生勝利組</Text>
						<Text style={styles.text}>Howard世界第一</Text>
					</View>
				</View>
			</View>
		</Page>
	</Document>
);

const Viewer = () => (
	<PDFViewer width="100%" height="600">
		<MyDocument />
	</PDFViewer>
);

const TEST: NextPageWithLayout = () => {
	return (
		<>
			{/* <PDFDownloadLink document={<MyDocument />} fileName="sample.pdf">
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink> */}
			<Viewer />
		</>
	);
};

TEST.getLayout = function getLayout(page: ReactElement) {
	return (
		<RootLayout>
			<PerpageLayoutNav pageTitle="Test">
				<div className="flex h-screen flex-col">
					<Header title={"薪資底稿測試"} showOptions />
					<div className="m-8 h-0 grow rounded-md border-2">
						{page}
					</div>
				</div>
			</PerpageLayoutNav>
		</RootLayout>
	);
};

export default TEST;
