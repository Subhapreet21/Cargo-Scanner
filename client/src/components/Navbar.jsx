import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import {
  QrCodeRounded,
  Analytics,
  Logout,
  Radar,
  Login,
  PersonAdd,
} from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const authToken = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "primary.main",
        color: "white",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Radar sx={{ color: "white", mr: 1 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: "bold",
              flexGrow: 1,
              color: "white",
            }}
          >
            Cargo Scanner
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {authToken ? (
          isMobile ? (
            <>
              <IconButton
                onClick={() => navigate("/productQRCodeGenerator")}
                sx={{
                  mr: 1,
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                <QrCodeRounded />
              </IconButton>

              <IconButton
                onClick={() => navigate("/productAnalysis")}
                sx={{
                  mr: 1,
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                <Analytics />
              </IconButton>

              <IconButton
                onClick={handleLogout}
                sx={{
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                <Logout />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/productQRCodeGenerator")}
                startIcon={<QrCodeRounded />}
                sx={{
                  mr: 2,
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                Generate QR
              </Button>

              <Button
                onClick={() => navigate("/productAnalysis")}
                startIcon={<Analytics />}
                sx={{
                  mr: 2,
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                Analytics
              </Button>

              <Button
                onClick={handleLogout}
                startIcon={<Logout />}
                sx={{
                  color: "white",
                  "&:hover": { color: "#FFFF00" },
                }}
              >
                Logout
              </Button>
            </>
          )
        ) : isMobile ? (
          <>
            <IconButton
              onClick={() => navigate("/login")}
              sx={{
                mr: 1,
                color: "white",
                "&:hover": { color: "#FFFF00" },
              }}
            >
              <Login />
            </IconButton>

            <IconButton
              onClick={() => navigate("/register")}
              sx={{
                color: "white",
                "&:hover": { color: "#FFFF00" },
              }}
            >
              <PersonAdd />
            </IconButton>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/login")}
              startIcon={<Login />}
              sx={{
                mr: 2,
                color: "white",
                "&:hover": { color: "#FFFF00" },
              }}
            >
              Login
            </Button>

            <Button
              onClick={() => navigate("/register")}
              startIcon={<PersonAdd />}
              sx={{
                color: "white",
                "&:hover": { color: "#FFFF00" },
              }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
