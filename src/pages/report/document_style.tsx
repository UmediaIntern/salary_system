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
        // box container (border)
        box: {
            position: 'absolute',   // 絕對定位，對 Page 做定位
            top: 0,                 // 離上邊距 0
            left: 0,                // 離左邊距 0
            borderWidth: 1,
            borderColor: 'black',
            padding: 5,
            width: 130,            // 寬度自訂 (單位為 pt，72pt = 1 inch)
            height: 35,            // 高度自訂
            fontSize: 10,
            // color: "gray",
        },
        period: {
            position: 'absolute',
            top: 0,
            left: 0,
            fontSize: 10,
            padding: 2,
            fontFamily: "light",
        },
        printDate: {
            position: 'absolute',
            top: 15,
            left: 0,
            fontSize: 10,
            padding: 2,
            fontFamily: "light",
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

