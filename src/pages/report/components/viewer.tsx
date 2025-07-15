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
import { useEffect, useState } from "react";

export const Viewer = ({
    Document: Document,
    columns: columns
}: {
    Document: () => JSX.Element,
    columns: number
}) => {

    const [currentColumns, setCurrentColumns] = useState<number>(4);
    useEffect(() => {
        setCurrentColumns(columns);
    }, [columns]);

    return <>
        <PDFViewer width="100%" height="600">
            <Document />
        </PDFViewer>
    </>
};