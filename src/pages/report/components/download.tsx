// Hooks
import { useState } from "react";
// Translations
import { TFunction } from "i18next";
// UI
import { Button } from "~/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";


export const DownloadComponent = ({
    Document: Document,
    filename: filename,
    t,
}: {
    Document: () => JSX.Element,
    filename: string
    t: TFunction<[string], undefined>
}) => {
    const [loading, setLoading] = useState(false);
    return <>
        <Button variant={"outline"} disabled={loading}>
            <PDFDownloadLink document={<Document />} fileName={filename}>
                {/* t([`table.${cell.content}`, `others.${cell.content}`, `TODO.${cell.content}`]) */}
                {({ loading }) => {
                    setLoading(loading);
                    return t([`TODO.${(loading ? "generating_PDF" : "download_PDF")}`])
                }}
            </PDFDownloadLink>
        </Button>
    </>
}