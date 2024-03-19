interface IHexToRgb {
    (hex: string): string;
}
interface IParams {
    color: string;
    lightTextColor: string;
    darkTextColor: string;
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
interface IGenerateColorPalette {
    (params: IParams): IColorComplete;
}
declare const hexToRgb: IHexToRgb;
declare const generateColor: IGenerateColorPalette;
declare const generatePalette: <T extends {
    [colorName: string]: string;
}>({ colors, lightTextColor, darkTextColor, }: {
    colors: T;
    lightTextColor?: string | undefined;
    darkTextColor?: string | undefined;
}) => { [colorName in keyof T]: IColorComplete; };
export { generatePalette, generateColor, hexToRgb };
