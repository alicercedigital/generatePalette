import pSBC from "shade-blend-color";
var getRgb = function (hexValue) {
    return parseInt(hexValue, 16) || Number(hexValue);
};
var getSRgb = function (hexValue) {
    var rgb = getRgb(hexValue) / 255;
    return rgb <= 0.03928 ? rgb / 12.92 : Math.pow(((rgb + 0.055) / 1.055), 2.4);
};
var getLuminance = function (hexColor) {
    return 0.2126 * getSRgb(hexColor.substr(1, 2)) +
        0.7152 * getSRgb(hexColor.substr(3, 2)) +
        0.0722 * getSRgb(hexColor.substr(-2));
};
var getContrast = function (foreground, background) {
    var L1 = getLuminance(foreground);
    var L2 = getLuminance(background);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
var getTextColor = function (bgColor, lightTextColor, darkTextColor) {
    var whiteContrast = getContrast(bgColor, lightTextColor);
    var blackContrast = getContrast(bgColor, darkTextColor);
    return whiteContrast > blackContrast ? lightTextColor : darkTextColor;
};
var hexToRgb = function (hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
};
var generateVariantColors = function (_a) {
    var color = _a.color, lightTextColor = _a.lightTextColor, darkTextColor = _a.darkTextColor;
    var lightColor = pSBC(0.2, color);
    var darkColor = pSBC(-0.5, color);
    if (!lightColor || !darkColor) {
        throw new Error("pSBC failed to generate a color for light or dark.");
    }
    return {
        base: {
            color: color,
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
var generateColor = function (params) {
    if (!/^#([A-Fa-f0-9]{6})$/.test(params.color)) {
        throw new Error("Color must be a 6-character hex. Ex: #ffffff, Not: " +
            String(params.color));
    }
    if (!/^#([A-Fa-f0-9]{6})$/.test(params.lightTextColor)) {
        throw new Error("lightTextColor must be a 6-character hex. Ex: #ffffff, Not: " +
            String(params.lightTextColor));
    }
    if (!/^#([A-Fa-f0-9]{6})$/.test(params.darkTextColor)) {
        throw new Error("darkTextColor must be a 6-character hex. Ex: #ffffff, Not: " +
            String(params.darkTextColor));
    }
    var _a = generateVariantColors(params), base = _a.base, light = _a.light, dark = _a.dark;
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
    };
};
var generatePalette = function (_a) {
    var colors = _a.colors, _b = _a.lightTextColor, lightTextColor = _b === void 0 ? "#ffffff" : _b, _c = _a.darkTextColor, darkTextColor = _c === void 0 ? "#000000" : _c;
    var palette = {};
    for (var key in colors) {
        palette[key] = generateColor({
            color: colors[key],
            darkTextColor: darkTextColor,
            lightTextColor: lightTextColor,
        });
    }
    return palette;
};
export { generatePalette, hexToRgb };
