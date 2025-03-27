import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../services/api";
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  QrCode as QrCodeIcon,
  Inventory,
  Phone,
  CalendarMonth,
  Category,
  Download,
  Share,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { useFormik } from "formik";
import * as yup from "yup";
import { QRCodeSVG } from "qrcode.react";
import theme from "../theme";

const productTypes = [
  "Electronics",
  "Clothing",
  "Food & Beverages",
  "Pharmaceuticals",
  "Automotive",
  "Furniture",
  "Books",
  "Cosmetics",
  "Toys",
  "Other",
];

const productMaterials = [
  "Plastic",
  "Metal",
  "Glass",
  "Paper",
  "Wood",
  "Textile",
  "Ceramic",
  "Rubber",
  "Composite",
  "Other",
];

const validationSchema = yup.object({
  name: yup.string().required("Product name is required"),
  productType: yup.string().required("Product type is required"),
  validity: yup.string().required("Validity date is required"),
  phoneNumber: yup
    .string()
    .matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, "Phone number is not valid")
    .required("Contact phone is required"),
  productMaterial: yup.string().required("Product material is required"),
});

const ProductQRCodeGenerator = () => {
  const [qrData, setQrData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setProductsLoading(false);
    }
  };

  const handleShowQR = (product) => {
    setSelectedProduct(product);
    setQrDialogOpen(true);
  };

  const handleEdit = (product) => {
    console.log("Editing product:", product);

    if (!product || (!product._id && !product.id)) {
      console.error("Invalid product data:", product);
      return;
    }

    setSelectedProduct({ ...product, _id: product._id || product.id });
    setEditMode(true);
    formik.setValues({
      name: product.name || "",
      productType: product.productType || "",
      validity: product.validity || "",
      phoneNumber: product.phoneNumber || "",
      productMaterial: product.productMaterial || "",
    });
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      if (!selectedProduct || !selectedProduct.id) {
        throw new Error("Product ID is required to delete a product.");
      }
      await deleteProduct(selectedProduct.id);

      setSnackbarMessage("Product deleted successfully!");
      setSnackbarOpen(true);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. Please try again.");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      productType: "",
      validity: "",
      phoneNumber: "",
      productMaterial: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);

        console.log("Selected Product for update:", selectedProduct);

        if (editMode && selectedProduct) {
          if (!selectedProduct._id) {
            throw new Error("Product ID is required to update a product.");
          }

          const updatedProduct = await updateProduct(
            selectedProduct._id,
            values
          );

          setSnackbarMessage("Product updated successfully!");
          setEditMode(false);
          setSelectedProduct(null);

          setQrData({
            ...values,
            id: updatedProduct.data.id || updatedProduct.data._id,
          });

          formik.resetForm();
        } else {
          const newProduct = await addProduct(values);
          setSnackbarMessage("Product created and QR code generated!");
          setQrData({
            ...values,
            id: newProduct.data.id || newProduct.data._id,
          });
        }

        setSnackbarOpen(true);
        fetchProducts();

        if (!editMode) {
          formik.resetForm();
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to process product. Please try again."
        );
        console.error("Product operation error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDownload = () => {
    const svgElement = document.getElementById("qr-code-svg");

    if (!svgElement) {
      console.error("SVG element not found");
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${qrData.name.replace(/\s+/g, "_")}_QRCode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  const handleShare = () => {
    if (!qrData) {
      console.error("No QR data available to share");
      return;
    }

    const productInfo = `
Product: ${qrData.name}
Type: ${qrData.productType}
Material: ${qrData.productMaterial}
Valid until: ${qrData.validity}
Contact: ${qrData.phoneNumber}
`;

    if (navigator.share) {
      navigator
        .share({
          title: `QR Code for ${qrData.name}`,
          text: productInfo,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(productInfo)
        .then(() => {
          setSnackbarMessage("Product details copied to clipboard!");
          setSnackbarOpen(true);
        })
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  const handleDialogDownload = () => {
    const svgElement = document.getElementById("dialog-qr-code-svg");

    if (!svgElement) {
      console.error("SVG element not found");
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${selectedProduct.name.replace(/\s+/g, "_")}_QRCode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgString)}`;
  };

  const handleDialogShare = () => {
    if (!selectedProduct) {
      console.error("No product data available to share");
      return;
    }

    const productInfo = `
        Product: ${selectedProduct.name}
        Type: ${selectedProduct.productType}
        Material: ${selectedProduct.productMaterial}
        Valid until: ${formatDate(selectedProduct.validity)}
        Contact: ${selectedProduct.phoneNumber}`;

    if (navigator.share) {
      navigator
        .share({
          title: `QR Code for ${selectedProduct.name}`,
          text: productInfo,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(productInfo)
        .then(() => {
          setSnackbarMessage("Product details copied to clipboard!");
          setSnackbarOpen(true);
        })
        .catch((err) => console.error("Failed to copy:", err));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="primary"
            gutterBottom
            fontWeight="bold"
          >
            <QrCodeIcon
              sx={{ mr: 1, fontSize: "inherit", verticalAlign: "middle" }}
            />
            Product QR Code Generator
          </Typography>
          <Typography
            variant="body1"
            align="center"
            color="text.secondary"
            paragraph
          >
            Fill in the product details below to generate a unique QR code
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box component="form" onSubmit={formik.handleSubmit}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Product Information
                </Typography>

                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  label="Product Name"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />

                <TextField
                  fullWidth
                  id="productType"
                  name="productType"
                  select
                  label="Product Type"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Category color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.productType}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.productType &&
                    Boolean(formik.errors.productType)
                  }
                  helperText={
                    formik.touched.productType && formik.errors.productType
                  }
                >
                  {productTypes.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  id="validity"
                  name="validity"
                  label="Validity"
                  type="date"
                  variant="outlined"
                  margin="normal"
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
                  value={formik.values.validity}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.validity && Boolean(formik.errors.validity)
                  }
                  helperText={formik.touched.validity && formik.errors.validity}
                />

                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Contact Phone Number"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />

                <TextField
                  fullWidth
                  id="productMaterial"
                  name="productMaterial"
                  select
                  label="Product Material"
                  variant="outlined"
                  margin="normal"
                  value={formik.values.productMaterial}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.productMaterial &&
                    Boolean(formik.errors.productMaterial)
                  }
                  helperText={
                    formik.touched.productMaterial &&
                    formik.errors.productMaterial
                  }
                >
                  {productMaterials.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, py: 1.2 }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : editMode ? (
                    "Edit Product"
                  ) : (
                    "Generate QR Code"
                  )}
                </Button>

                {editMode && (
                  <Button
                    fullWidth
                    variant="outlined"
                    color="secondary"
                    sx={{ mb: 2, py: 1.2 }}
                    onClick={() => {
                      formik.resetForm();
                      setEditMode(false);
                      setSelectedProduct(null);
                    }}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "90%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 3,
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  border: "1px dashed",
                  borderColor: "divider",
                }}
              >
                {qrData ? (
                  <>
                    <Typography
                      variant="h6"
                      color="primary"
                      gutterBottom
                      align="center"
                    >
                      QR Code for {qrData.name}
                    </Typography>

                    <Box
                      id="qr-code-canvas"
                      sx={{
                        p: 3,
                        bgcolor: "white",
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        mb: 3,
                      }}
                    >
                      <QRCodeSVG
                        id="qr-code-svg"
                        value={JSON.stringify(qrData)}
                        size={200}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: "https://cdn-icons-png.flaticon.com/512/4134/4134334.png",
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                      />
                    </Box>

                    <Box sx={{ width: "100%", mb: 2 }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="primary"
                            startIcon={<Download />}
                            onClick={handleDownload}
                          >
                            Download
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            startIcon={<Share />}
                            onClick={handleShare}
                          >
                            Share
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ width: "100%", mt: 1, mb: 2 }} />

                    <Box sx={{ width: "100%" }}>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        Product Details:
                      </Typography>
                      <Typography variant="body2">
                        <strong>Type:</strong> {qrData.productType}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Material:</strong> {qrData.productMaterial}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Valid until:</strong> {qrData.validity}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Contact:</strong> {qrData.phoneNumber}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: "center" }}>
                    <QrCodeIcon
                      sx={{ fontSize: 100, color: "text.disabled", mb: 2 }}
                    />
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      No QR Code Generated Yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fill in the product information and click "Generate QR
                      Code" to create a unique QR code.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mt: 4 }}>
          <Typography
            variant="h5"
            color="primary"
            gutterBottom
            fontWeight="bold"
          >
            <Inventory sx={{ mr: 1, verticalAlign: "middle" }} />
            Your Products
          </Typography>

          {productsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : products.length > 0 ? (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "rgba(25, 118, 210, 0.05)" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Valid Until
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id || product._id} hover>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.productType}</TableCell>
                      <TableCell>{product.productMaterial}</TableCell>
                      <TableCell>{formatDate(product.validity)}</TableCell>
                      <TableCell>{product.phoneNumber}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Tooltip title="Show QR Code">
                            <IconButton
                              color="primary"
                              onClick={() => handleShowQR(product)}
                              size="small"
                            >
                              <QrCodeIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Product">
                            <IconButton
                              color="secondary"
                              onClick={() => handleEdit(product)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(product)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", p: 3 }}>
              <Typography color="text.secondary">
                No products found. Create your first product using the form
                above.
              </Typography>
            </Box>
          )}
        </Paper>

        <Dialog
          open={qrDialogOpen}
          onClose={() => setQrDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
            QR Code for {selectedProduct?.name}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, pb: 2, textAlign: "center" }}>
            {selectedProduct && (
              <>
                <Box
                  sx={{
                    p: 3,
                    bgcolor: "white",
                    borderRadius: 2,
                    display: "inline-block",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    mb: 3,
                  }}
                >
                  <QRCodeSVG
                    id="dialog-qr-code-svg"
                    value={JSON.stringify(selectedProduct)}
                    size={240}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "https://cdn-icons-png.flaticon.com/512/4134/4134334.png",
                      x: undefined,
                      y: undefined,
                      height: 48,
                      width: 48,
                      excavate: true,
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  align="left"
                  gutterBottom
                >
                  Product Details:
                </Typography>
                <Box sx={{ textAlign: "left", mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Name:</strong> {selectedProduct.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Type:</strong> {selectedProduct.productType}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Material:</strong> {selectedProduct.productMaterial}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Valid until:</strong>{" "}
                    {formatDate(selectedProduct.validity)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Contact:</strong> {selectedProduct.phoneNumber}
                  </Typography>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDialogDownload}
            >
              Download
            </Button>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Share />}
              onClick={handleDialogShare}
            >
              Share
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
          aria-describedby="delete-dialog-description"
        >
          <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete the product "
              {selectedProduct?.name}"? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} autoFocus>
              Cancel
            </Button>
            <Button color="error" onClick={confirmDelete} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          message={
            snackbarMessage ||
            (qrData
              ? "QR code downloaded successfully!"
              : "Product details copied to clipboard!")
          }
        />
      </Container>
    </ThemeProvider>
  );
};

export default ProductQRCodeGenerator;
