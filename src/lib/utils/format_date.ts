export function formatDate(
	type: "day" | "hour",
	dateValue: Date | string | null
) {
	if (dateValue === "" || dateValue === null) return dateValue;
	const date = typeof dateValue === "string" ? new Date(dateValue) : dateValue;
	switch (type) {
		case "day":
			return formatDateString(type, date.toISOString());
		case "hour":
			return formatDateString(type, date.toISOString());
		default:
			throw new Error("No Implement Error");
	}
}

function formatDateString(type: string, isoString: string): string {
	const date = new Date(isoString);

	let formattedDate: string;
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	if (type === "hour") {
		const hour = String(date.getHours()).padStart(2, '0');
		const minute = String(date.getMinutes()).padStart(2, '0');
		const second = String(date.getSeconds()).padStart(2, '0');
		formattedDate = `${year}年${month}月${day}日 ${hour}點${minute}分${second}秒`;
	} else if (type === "day") {
		formattedDate = `${year}年${month}月${day}日`;
	} else {
		formattedDate = date.toLocaleString("zh-Hans-TW");
	}

	// const formattedDate = date.toLocaleString("en", options as any);
	return formattedDate;
}
