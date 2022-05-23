import { extendTheme, theme as base, ThemeConfig, Colors } from "@chakra-ui/react"

const colors: Colors = {
  brand: {
    50: "#f2e7fc",
    100: "#dcc3f8",
    200: "#c59bf4",
    300: "#ad6ef1",
    400: "#9a48ed",
    500: "#8616e8",
    600: "#7b0ee2",
    700: "#6c00d9",
    800: "#5d00d4",
    900: "#4300cc",
    bg: "#8716e84d",
  },
}

const fonts = {
  heading: `Inter, ${base.fonts?.heading}`,
  body: `Inter, ${base.fonts?.body}`,
}

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}

export const theme = extendTheme({ colors, fonts, config })
