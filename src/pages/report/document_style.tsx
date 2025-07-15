// PDF
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

Font.register({family: "bold", src: boldFont,});
Font.register({family: "light",src: lightFont,});
export const styles = StyleSheet.create({
        page: {
            padding: 15,
        },
        titleContainer: {
            flexDirection: 'row',
            left: "35%",
            justifyContent: 'flex-start',
        },
        title: {
            fontSize: 30,
            fontWeight: "bold",
            textAlign: "left",
            marginBottom: 20,
            fontFamily: "bold",
        },
        groupKey: {
            top: 10,
            fontSize: 15,
            fontWeight: "bold",
            marginRight: 10,
            fontFamily: "bold",
            left: '7%',
        },
        text: {
            fontSize: 11,
            textAlign: "left",
            fontFamily: "light",
            marginBottom: 10,
        },
        container: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
        },
        column2: {
            padding: 5,
            width: "48%", 
        },
        column3: {
            padding: 5,
            width: "33%",
        },
        column4: {
            padding: 1,
            width: "24%",
        },
        column4_2: {
            padding: 2,
            width: "48%",
        },
        rightBottomTextContainer: {
            top: 20,
            flexDirection: 'row',    // 水平排列
            left: "50%",
            justifyContent: 'flex-start', // 左對齊
        },
        rightBottomText: {
            fontFamily: "light",
            fontSize: 25,
            // textAlign: 'left',
            marginBottom: 10,
            marginRight: 5,
        },
        rightBottomSign: {
            fontFamily: "light",
            fontSize: 25,
            // textAlign: 'left',
            textDecoration: 'underline',  // 下劃線
        },
    });

