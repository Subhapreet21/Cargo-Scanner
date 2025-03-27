import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Grid,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff, Person, Lock } from "@mui/icons-material";
import { login } from "../services/api";
import theme from "../theme";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/productQRCodeGenerator");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ username, password });

      if (response.data) {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/productQRCodeGenerator");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Grid
          container
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Grid item xs={12} sm={12} md={6} component={Box} p={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                color="primary"
                gutterBottom
                fontWeight="bold"
              >
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={4}>
                Login to access your Cargo Scanner dashboard
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ width: "100%" }}
              >
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.2 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                    >
                      Create one now
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            sx={{
              backgroundColor: "primary.main",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              p: 4,
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: "80%" }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Cargo Tracking & Management System
              </Typography>
              <Typography variant="body1">
                Efficiently track and manage your products with our QR
                code-based system.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    p: 2,
                    m: 1,
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: "120px",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    100%
                  </Typography>
                  <Typography variant="body2">Secure</Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    p: 2,
                    m: 1,
                    borderRadius: 2,
                    textAlign: "center",
                    minWidth: "120px",
                  }}
                >
                  <Typography variant="h5" fontWeight="bold">
                    Fast
                  </Typography>
                  <Typography variant="body2">Processing</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
