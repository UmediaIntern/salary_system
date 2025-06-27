import { UploadIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import { toast } from "sonner";
import Dropzone, {
	type DropzoneProps,
	type FileRejection,
} from "react-dropzone";
import { cn } from "~/lib/utils";
import { MB } from "~/lib/utils/define";

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
}

export function FileUploader(props: FileUploaderProps) {
	const {
		accept = {
			"text/csv": [".csv"],
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
				[".xlsx"],
		},
		maxSize = MB(2), 
		maxFileCount = 1,
		multiple = false,
		disabled = false,
		onUpload,
		className,
		...dropzoneProps
	} = props;

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const totalCount = acceptedFiles.length + fileRejections.length

			if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
				toast.error("Cannot upload more than 1 file at a time");
				return;
			}

      if (fileRejections.length !== 0) {
        console.log(`${fileRejections.length} files rejected`);
        toast.error(`Failed: Try to upload ${totalCount} files. ${fileRejections.length} rejected / ${totalCount} total`);

        // TODO: add onReject
        // for (const file of fileRejections) {
        //
        // }
        return;
      }

			onUpload?.(acceptedFiles).catch(() => {
				toast.error("Failed to upload file");
			});
		},
		[multiple, maxFileCount, onUpload]
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
		<div className="h-full overflow-hidden">
			<FileDropZone />
		</div>
	);
}
