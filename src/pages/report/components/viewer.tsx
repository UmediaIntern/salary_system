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

export const Viewer = ({
    Document: Document
}: {
    Document: () => JSX.Element
}) => (
    <PDFViewer width="100%" height="600">
        <Document />
    </PDFViewer>
);