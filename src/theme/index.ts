import { extendTheme, theme as base, ThemeConfig, Colors } from "@chakra-ui/react"
import { Table } from "./table"

const colors: Colors = {
  brand: {
    50: "#f3e8fd",
    100: "#dbb9f8",
    200: "#c38bf4",
    300: "#aa5cef",
    400: "#9e45ed",
    500: "#8616e8",
    600: "#7914d1",
    700: "#6b12ba",
    800: "#5e0fa2",
    900: "#500d8b",
    bg: "#280745",
  },
  bg: "#19032d",
  gradients: {
    sherlock: {
      0: "rgba(135, 22, 232, 0.72)",
      1: "hsla(0, 0%, 100%, 0)",
    },
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

const sizes = {
  ...base.sizes,
  container: {
    ...base.sizes.container,
    xs: "600px",
  },
}

export const theme = extendTheme({
  colors,
  fonts,
  config,
  components: {
    Table,
  },
  sizes,
})
