import { extendTheme } from "@chakra-ui/react";

/*
        --primary-100:#3F51B5;
    --primary-200:#757de8;
    --primary-300:#dedeff;
    --accent-100:#FF4081;
    --accent-200:#ffe4ff;
    --text-100:#212121;
    --text-200:#484848;
    --bg-100:#F5F5F5;
    --bg-200:#ebebeb;
    --bg-300:#c2c2c2;
      
      
*/
const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },

  colors: {
    frenchRose: {
      50: "#fef1f6",
      100: "#fee5ef",
      200: "#ffcae1",
      300: "#ff9fc6",
      400: "#ff639f",
      500: "#ff4081",
      600: "#f01253",
      700: "#d1053b",
      800: "#ad0731",
      900: "#8f0c2d",
      950: "#580014",
    },

    bg: {
      100: "#f8f9fa",
      200: "#ebebeb",
      300: "#c2c2c2",
      400: "#2f2e41",
    },

    ceruleanBlue: {
      50: "#f2f5fc",
      100: "#e1e8f8",
      200: "#cbd8f2",
      300: "#a6bfea",
      400: "#7c9dde",
      500: "#5d7dd4",
      600: "#4963c7",
      700: "#3f51b5",
      800: "#394494",
      900: "#323d76",
      950: "#222749",
    },
  },
});

export default theme;
