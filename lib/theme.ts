import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  colors: {
    brand: {
      orange: "#f15a22",
      blue: "#003B70",
      purple: "#7b42f6",
      yellow: "#fbbf24",
      cream: "#fbf9f6",
    },
  },
  fonts: {
    heading: "inherit",
    body: "inherit",
  },
  styles: {
    global: {
      body: {
        bg: "brand.cream",
        color: "brand.blue",
      },
    },
  },
});
