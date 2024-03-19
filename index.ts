import pSBC from "shade-blend-color";

interface IHexToRgb {
  (hex: string): string;
}

interface IGetRgb {
  (hexValue: string): number;
}

interface IGetSRgb {
  (hexValue: string): number;
}

interface IGetLuminance {
  (hexColor: string): number;
}

interface IGetContrast {
  (foreground: string, background: string): number;
}

interface IGetTextColor {
  (bgColor: string, lightTextColor: string, darkTextColor: string): string;
}

interface IParams {
  color: string;
  lightTextColor: string;
  darkTextColor: string;
}

interface IGenerateVariantColors {
  (params: IParams): {
    base: { color: string; text: string };
    light: { color: string; text: string };
    dark: { color: string; text: string };
  };
}
interface IColorComplete {
  DEFAULT: string;
  text: string;
  light: { DEFAULT: string; text: string };
  dark: { DEFAULT: string; text: string };
}


const getRgb: IGetRgb = (hexValue) =>
  parseInt(hexValue, 16) || Number(hexValue);

const getSRgb: IGetSRgb = (hexValue) => {
  const rgb = getRgb(hexValue) / 255;
  return rgb <= 0.03928 ? rgb / 12.92 : ((rgb + 0.055) / 1.055) ** 2.4;
};

const getLuminance: IGetLuminance = (hexColor) =>
  0.2126 * getSRgb(hexColor.substr(1, 2)) +
  0.7152 * getSRgb(hexColor.substr(3, 2)) +
  0.0722 * getSRgb(hexColor.substr(-2));

const getContrast: IGetContrast = (foreground, background) => {
  const L1 = getLuminance(foreground);
  const L2 = getLuminance(background);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};

const getTextColor: IGetTextColor = (
  bgColor,
  lightTextColor,
  darkTextColor
) => {
  const whiteContrast = getContrast(bgColor, lightTextColor);
  const blackContrast = getContrast(bgColor, darkTextColor);
  return whiteContrast > blackContrast ? lightTextColor : darkTextColor;
};

const hexToRgb: IHexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r},${g},${b})`;
};

const generateVariantColors: IGenerateVariantColors = ({
  color,
  lightTextColor,
  darkTextColor,
}) => {
  const lightColor = pSBC(0.2, color);
  const darkColor = pSBC(-0.5, color);

  if (!lightColor || !darkColor) {
    throw new Error("pSBC failed to generate a color for light or dark.");
  }

  return {
    base: {
      color,
      text: getTextColor(color, lightTextColor, darkTextColor),
    },
    light: {
      color: lightColor,
      text: getTextColor(lightColor, lightTextColor, darkTextColor),
    },
    dark: {
      color: darkColor,
      text: getTextColor(darkColor, lightTextColor, darkTextColor),
    },
  };
};

const generateColor = ({
  color,
  lightTextColor = "#FFFFFF",
  darkTextColor = "#000000",
}: {
  color: string;
  lightTextColor: string;
  darkTextColor: string;
}) => {
  if (!/^#([A-Fa-f0-9]{6})$/.test(color)) {
    throw new Error(
      "Color must be a 6-character hex. Ex: #ffffff, Not: " + String(color)
    );
  }

  if (!/^#([A-Fa-f0-9]{6})$/.test(lightTextColor)) {
    throw new Error(
      "lightTextColor must be a 6-character hex. Ex: #ffffff, Not: " +
        String(lightTextColor)
    );
  }

  if (!/^#([A-Fa-f0-9]{6})$/.test(darkTextColor)) {
    throw new Error(
      "darkTextColor must be a 6-character hex. Ex: #ffffff, Not: " +
        String(darkTextColor)
    );
  }

  const { base, light, dark } = generateVariantColors({
    color,
    lightTextColor,
    darkTextColor,
  });
  return {
    DEFAULT: base.color,
    text: base.text,
    light: {
      DEFAULT: light.color,
      text: light.text,
    },
    dark: {
      DEFAULT: dark.color,
      text: dark.text,
    },
  } satisfies RecursiveKeyValuePair
};

interface RecursiveKeyValuePair<K extends keyof any = string, V = string> {
  [key: string]: V | RecursiveKeyValuePair<K, V>;
}

const generatePalette = <T extends { [colorName: string]: string }>({
  colors,
  lightTextColor = "#ffffff",
  darkTextColor = "#000000",
}: {
  colors: T;
  lightTextColor?: string;
  darkTextColor?: string;
}) => {
  type IPalette = { [colorName in keyof T]: RecursiveKeyValuePair };

  const palette: IPalette = {} as any;

  for (const key in colors) {
    palette[key] = generateColor({
      color: colors[key],
      darkTextColor,
      lightTextColor,
    }) 
  }

  return palette;
};

export { generatePalette, generateColor, hexToRgb };
