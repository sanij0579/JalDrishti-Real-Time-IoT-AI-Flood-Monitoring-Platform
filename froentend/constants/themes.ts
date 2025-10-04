// theme.ts
import { lightColors, darkColors, festivalColors, socialImpactColors,redBackgroundColors } from "./colors";
import { fonts } from "./fonts";
import { sizes } from "./sizes";

export const themes = {
  light: { colors: lightColors, fonts, sizes },
  dark: { colors: darkColors, fonts, sizes },
  festival: { colors: festivalColors, fonts, sizes },
  socialImpact: { colors: socialImpactColors, fonts, sizes }, 
  redBackground: { colors: redBackgroundColors, fonts, sizes }, // 🎯 adde// 🌍 New theme
};