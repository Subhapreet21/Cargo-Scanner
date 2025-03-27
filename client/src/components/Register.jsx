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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { register } from "../services/api";
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Phone,
  Home,
  CalendarMonth,
  Work,
} from "@mui/icons-material";
import { useFormik } from "formik";
import * as yup from "yup";
import theme from "../theme";

const phoneRegExp = /^(\+\d{1,3}[- ]?)?\d{10}$/;

const validationSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username should be of minimum 3 characters length")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password should be of minimum 6 characters length")
    .required("Password is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  role: yup.string().required("Role is required"),
  mobileNumber: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Mobile number is required"),
  address: yup.string().required("Address is required"),
  dob: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/productQRCodeGenerator");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      email: "",
      role: "",
      mobileNumber: "",
      address: "",
      dob: "",
      gender: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        const response = await register(values);

        setSuccess(true);
        console.log("Registration successful:", response.data);

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Registration failed. Please try again."
        );
        console.error("Registration error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  if (success) {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" sx={{ pt: 8, pb: 6 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Registration successful! Redirecting to login...
              </Alert>
              <CircularProgress size={40} sx={{ mt: 3 }} />
            </Box>
          </Paper>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Grid
          container
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, overflow: "hidden" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={5}
            sx={{
              backgroundColor: "primary.main",
              display: { xs: "none", md: "flex" },
              position: "relative",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              p: 4,
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                textAlign: "center",
                maxWidth: "90%",
              }}
            >
              <Typography
                variant="h4"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Join Our Cargo Management Network
              </Typography>
              <Typography variant="body1" paragraph>
                Create an account to start tracking your products, generating QR
                codes, and analyzing your shipment data in real-time.
              </Typography>
              <Box
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  p: 3,
                  borderRadius: 2,
                  mt: 3,
                }}
              >
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  Benefits of Registration
                </Typography>
                <Typography
                  variant="body2"
                  align="left"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  ✓ Generate unlimited QR codes for products
                </Typography>
                <Typography
                  variant="body2"
                  align="left"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  ✓ Track products throughout the supply chain
                </Typography>
                <Typography
                  variant="body2"
                  align="left"
                  paragraph
                  sx={{ mb: 1 }}
                >
                  ✓ Access detailed analytics and reports
                </Typography>
                <Typography variant="body2" align="left">
                  ✓ Secure authentication and data management
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: "rgba(25, 118, 210, 0.2)",
                zIndex: 0,
                backgroundImage:
                  "radial-gradient(circle at 70% 80%, rgba(255,255,255,0.2) 0%, rgba(25,118,210,0) 50%)",
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={7} component={Box} p={4}>
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
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Fill in your details to register for Cargo Scanner
              </Typography>

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                sx={{ width: "100%" }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="username"
                      name="username"
                      label="Username"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.username &&
                        Boolean(formik.errors.username)
                      }
                      helperText={
                        formik.touched.username && formik.errors.username
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.email && Boolean(formik.errors.email)
                      }
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={formik.touched.role && Boolean(formik.errors.role)}
                    >
                      <InputLabel id="role-label">Role</InputLabel>
                      <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        label="Role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        startAdornment={
                          <InputAdornment position="start">
                            <Work color="primary" />
                          </InputAdornment>
                        }
                      >
                        <MenuItem value="admin">Administrator</MenuItem>
                        <MenuItem value="manager">Manager</MenuItem>
                        <MenuItem value="employee">Employee</MenuItem>
                        <MenuItem value="customer">Customer</MenuItem>
                      </Select>
                      {formik.touched.role && formik.errors.role && (
                        <FormHelperText>{formik.errors.role}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="mobileNumber"
                      name="mobileNumber"
                      label="Mobile Number"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.mobileNumber}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.mobileNumber &&
                        Boolean(formik.errors.mobileNumber)
                      }
                      helperText={
                        formik.touched.mobileNumber &&
                        formik.errors.mobileNumber
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      label="Address"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Home color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.address && Boolean(formik.errors.address)
                      }
                      helperText={
                        formik.touched.address && formik.errors.address
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="dob"
                      name="dob"
                      label="Date of Birth"
                      type="date"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth color="primary" />
                          </InputAdornment>
                        ),
                      }}
                      value={formik.values.dob}
                      onChange={formik.handleChange}
                      error={formik.touched.dob && Boolean(formik.errors.dob)}
                      helperText={formik.touched.dob && formik.errors.dob}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl
                      fullWidth
                      variant="outlined"
                      error={
                        formik.touched.gender && Boolean(formik.errors.gender)
                      }
                    >
                      <InputLabel id="gender-label">Gender</InputLabel>
                      <Select
                        labelId="gender-label"
                        id="gender"
                        name="gender"
                        label="Gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                        <MenuItem value="prefer_not_to_say">
                          Prefer not to say
                        </MenuItem>
                      </Select>
                      {formik.touched.gender && formik.errors.gender && (
                        <FormHelperText>{formik.errors.gender}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </Grid>
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
                    "Register"
                  )}
                </Button>
                <Box sx={{ textAlign: "center", mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      style={{
                        color: theme.palette.primary.main,
                        textDecoration: "none",
                      }}
                    >
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
