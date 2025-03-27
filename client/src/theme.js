import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
    },
    secondary: {
      main: "#dc004e",
      light: "#e33371",
      dark: "#9a0036",
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    info: {
      main: "#FFC107",
      light: "#FFD54F",
      dark: "#FFA000",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        containedPrimary: {
          boxShadow: "0 4px 6px rgba(25, 118, 210, 0.25)",
          "&:hover": {
            boxShadow: "0 6px 10px rgba(25, 118, 210, 0.3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "16px",
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "box-shadow 0.3s ease",
            "&:hover": {
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            },
            "&.Mui-focused": {
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        },
        elevation3: {
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorDefault: {
          backgroundColor: "#ffffff",
        },
      },
    },
  },
});

export default theme;
