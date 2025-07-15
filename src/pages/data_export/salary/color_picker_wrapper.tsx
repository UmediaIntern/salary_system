import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import ColorPicker from "@rc-component/color-picker";
import "@rc-component/color-picker/assets/index.css";

interface ColorRGB {
	r: number;
	g: number;
	b: number;
}

function floatToHexColor({ r, g, b }: ColorRGB) {
	// Ensure RGB values are within the valid range [0, 255]
	r = Math.min(255, Math.max(0, Math.round(r)));
	g = Math.min(255, Math.max(0, Math.round(g)));
	b = Math.min(255, Math.max(0, Math.round(b)));

	// Convert to hexadecimal and format as a CSS color string
	const hexR = r.toString(16).padStart(2, "0");
	const hexG = g.toString(16).padStart(2, "0");
	const hexB = b.toString(16).padStart(2, "0");

	return `#${hexR}${hexG}${hexB}`;
}

interface ColorPickerWrapperProps {
	initialColor: string;
	setFinalColor: (newColor: string) => void;
}

export function ColorPickerWrapper({
	initialColor,
	setFinalColor,
}: ColorPickerWrapperProps) {
	const [color, setColor] = useState(initialColor);

	useEffect(() => {
		setColor(initialColor);
	}, [initialColor]);

	return (
		<div className="flex flex-col items-center">
			<ColorPicker
				defaultValue={initialColor}
				// defaultValue={"#000099"}
				value={color}
				onChange={(c) => {
					setColor(floatToHexColor({ r: c.r, g: c.g, b: c.b }));
				}}
			/>
			<Button
				variant="outline"
				className="w-full"
				onClick={() => setFinalColor(color)}
			>
				Confirm
			</Button>
		</div>
	);
}
