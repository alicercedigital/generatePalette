interface IHexToRgb {
    (hex: string): string;
}
interface IColorComplete {
    DEFAULT: string;
    text: string;
    light: {
        DEFAULT: string;
        text: string;
    };
    dark: {
        DEFAULT: string;
        text: string;
    };
}
declare const hexToRgb: IHexToRgb;
declare const generatePalette: ({ colors, lightTextColor, darkTextColor, }: {
    colors: {
        [x: string]: string;
    };
    lightTextColor?: string | undefined;
    darkTextColor?: string | undefined;
}) => {
    [colorName: string]: IColorComplete;
};
export { generatePalette, hexToRgb };
