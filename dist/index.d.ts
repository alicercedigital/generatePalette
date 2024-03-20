interface IHexToRgb {
    (hex: string): string;
}
declare const hexToRgb: IHexToRgb;
declare const generateColor: ({ color, lightTextColor, darkTextColor, }: {
    color: string;
    lightTextColor: string;
    darkTextColor: string;
}) => {
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
};
interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
    [key: string]: V | RecursiveKeyValuePair<K, V>;
}
declare const generatePalette: <T extends {
    [colorName: string]: string;
}>({ colors, lightTextColor, darkTextColor, }: {
    colors: T;
    lightTextColor?: string | undefined;
    darkTextColor?: string | undefined;
}) => { [colorName in keyof T]: RecursiveKeyValuePair<string, string>; };
export { generatePalette, generateColor, hexToRgb };
