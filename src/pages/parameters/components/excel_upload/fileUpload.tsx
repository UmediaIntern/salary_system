import { UploadIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";

import { toast } from "sonner";

import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";

import { cn } from "~/lib/utils";

import ExcelJS from "exceljs";

export function composeEventHandlers<E>(
	originalEventHandler?: (event: E) => void,
	ourEventHandler?: (event: E) => void,
	{ checkForDefaultPrevented = true } = {}
) {
	return function handleEvent(event: E) {
		originalEventHandler?.(event);

		if (
			checkForDefaultPrevented === false ||
			!(event as unknown as Event).defaultPrevented
		) {
			return ourEventHandler?.(event);
		}
	};
}

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * Value of the uploader.
	 * @type File[]
	 * @default undefined
	 * @example value={files}
	 */
	value?: File[];

	/**
	 * Function to be called when the value changes.
	 * @type (files: File[]) => void
	 * @default undefined
	 * @example onValueChange={(files) => setFiles(files)}
	 */
	onValueChange?: (files: File[]) => void;

	/**
	 * Function to be called when files are uploaded.
	 * @type (files: File[]) => Promise<void>
	 * @default undefined
	 * @example onUpload={(files) => uploadFiles(files)}
	 */
	onUpload?: (file: File[]) => Promise<void>;

	/**
	 * Progress of the uploaded files.
	 * @type Record<string, number> | undefined
	 * @default undefined
	 * @example progresses={{ "file1.png": 50 }}
	 */
	progresses?: Record<string, number>;

	/**
	 * Accepted file types for the uploader.
	 * @type { [key: string]: string[]}
	 * @default
	 * ```ts
	 * { "image/*": [] }
	 * ```
	 * @example accept={["image/png", "image/jpeg"]}
	 */
	accept?: DropzoneProps["accept"];

	/**
	 * Maximum file size for the uploader.
	 * @type number | undefined
	 * @default 1024 * 1024 * 2 // 2MB
	 * @example maxSize={1024 * 1024 * 2} // 2MB
	 */
	maxSize?: DropzoneProps["maxSize"];

	/**
	 * Maximum number of files for the uploader.
	 * @type number | undefined
	 * @default 1
	 * @example maxFileCount={4}
	 */
	maxFileCount?: DropzoneProps["maxFiles"];

	/**
	 * Whether the uploader should accept multiple files.
	 * @type boolean
	 * @default false
	 * @example multiple
	 */
	multiple?: boolean;

	/**
	 * Whether the uploader is disabled.
	 * @type boolean
	 * @default false
	 * @example disabled
	 */
	disabled?: boolean;

	/* Handle files */
	files: File[];
	setFiles: (files: File[]) => void;

	/* 2D array data */
	data: any[][];
	setData: (data: any[][]) => void;
}

export function FileUploader(props: FileUploaderProps) {
	const {
		value: valueProp,
		onValueChange,
		onUpload,
		progresses,
		accept = {
			"text/csv": [".csv"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
		},
		maxSize = 1024 * 1024 * 2,
		maxFileCount = 1,
		multiple = false,
		disabled = false,
		files,
		setFiles,
		data,
		setData,
		className,
		...dropzoneProps
	} = props;

	const ExtractData = async (file: File) => {
		if (!file) return;
		try {
			// Read the file as ArrayBuffer
			const arrayBuffer = await file.arrayBuffer();

			// Create a new workbook
			const workbook = new ExcelJS.Workbook();
			await workbook.xlsx.load(arrayBuffer);

			// Access the first sheet
			const sheet = workbook.worksheets[0];
			const rows: any[][] = [];

			// Extract data from the sheet
			sheet!.eachRow({ includeEmpty: true }, (row: any) => {
				rows.push(row.values);
			});

			const newRows = rows.slice(1).map((row, index) => {
				row = row.slice(2);
				return {
					salary_start: row[0],
					salary_end: row[1],
					dependent: row[2],
					tax_amount: row[3],
				};
			});

			// call api if needed
			// createAPI.mutate(newRows)

			// Update state with the extracted data
			setData(rows);
		} catch (error) {
			console.error("Error processing file");
		}
	};

	const onDrop = useCallback(
		(acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
			if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
				toast.error("Cannot upload more than 1 file at a time");
				return;
			}

			setFiles(acceptedFiles);

			acceptedFiles.forEach((file) => {
				ExtractData(file);
			});
		},
		[]
	);

	function FileDropZone() {
		return (
			<>
				<Dropzone
					onDrop={onDrop}
					accept={accept}
					maxSize={maxSize}
					maxFiles={maxFileCount}
					multiple={maxFileCount > 1 || multiple}
					//   disabled={isDisabled}
				>
					{({ getRootProps, getInputProps, isDragActive }) => (
						<div
							{...getRootProps()}
							className={cn(
								"group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
								"ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
								isDragActive && "border-muted-foreground/50",
								disabled && "pointer-events-none opacity-60",
								className
							)}
							{...dropzoneProps}
						>
							<input {...getInputProps()} />
							{isDragActive ? (
								<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
									<div className="rounded-full border border-dashed p-3">
										<UploadIcon
											className="size-7 text-muted-foreground"
											aria-hidden="true"
										/>
									</div>
									<p className="font-medium text-muted-foreground">
										Drop the files here
									</p>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center gap-4 sm:px-5">
									<div className="rounded-full border border-dashed p-3">
										<UploadIcon
											className="size-7 text-muted-foreground"
											aria-hidden="true"
										/>
									</div>
									<div className="flex flex-col gap-px">
										<p className="font-medium text-muted-foreground">
											Drag & drop files here, or click to
											select files
										</p>
										{/* <p className="text-sm text-muted-foreground/70">
											You can upload
											{maxFileCount > 1
												? ` ${
														maxFileCount ===
														Infinity
															? "multiple"
															: maxFileCount
												  }
						files (up to ${formatBytes(maxSize)} each)`
												: ` a file with ${formatBytes(
														maxSize
												  )}`}
										</p> */}
									</div>
								</div>
							)}
						</div>
					)}
				</Dropzone>
			</>
		);
	}

	return (
		<div className="relative flex flex-col gap-6 overflow-hidden">
			{<FileDropZone />}
		</div>
	);
}
