import { hexToRgb, generatePalette } from "./index"; // adjust the import path based on your project structure

describe("hexToRgb", () => {
  test("converts hex to RGB correctly", () => {
    expect(hexToRgb("#ffffff")).toBe("rgb(255,255,255)");
    expect(hexToRgb("#000000")).toBe("rgb(0,0,0)");
    expect(hexToRgb("#ff0000")).toBe("rgb(255,0,0)");
  });
});

describe("generateColorPalette", () => {
  const params = {
    colors: { primary: "#ff0000" },
    lightTextColor: "#ffffff",
    darkTextColor: "#000000",
  };

  test("generates correct color palette", () => {
    const palette = generatePalette(params);
    console.log(palette);
    expect(palette.primary).toHaveProperty("DEFAULT");
    expect(palette.primary).toHaveProperty("text");
    expect(palette.primary).toHaveProperty("light");
    expect(palette.primary).toHaveProperty("dark");
  });

  test("fails with invalid color format", () => {
    expect(() =>
      generatePalette({ ...params, colors: { primary: "not-a-color" } })
    ).toThrow();
  });

  test("fails with invalid color format for light text", () => {
    expect(() =>
      generatePalette({ ...params, lightTextColor: "not-a-color"})
    ).toThrow();
  });

  test("fails with invalid color format for dark text", () => {
    expect(() =>
      generatePalette({ ...params, darkTextColor: "not-a-color"})
    ).toThrow();
  });

  test("fails with invalid color with less 6 characters", () => {
    expect(() =>
    generatePalette({ ...params, colors: { primary: "#fff" } })
    ).toThrow();
  });
});
