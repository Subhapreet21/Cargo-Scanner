import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Analytics,
  Inventory,
  CalendarMonth,
  Category,
  Search,
  FilterList,
} from "@mui/icons-material";
import axios from "axios";
import Navbar from "./Navbar";
import theme from "../theme";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#1976d2",
  "#dc004e",
  "#ff9800",
  "#4caf50",
  "#9c27b0",
  "#795548",
];

const ProductAnalysis = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterMaterial, setFilterMaterial] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get("http://localhost:5000/api/products");
        console.log("API Response:", response.data);

        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setProducts([]);
          setError("Unexpected API response format.");
        }
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productTypes = ["all", ...new Set(products.map((p) => p.productType))];
  const productMaterials = [
    "all",
    ...new Set(products.map((p) => p.productMaterial)),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === "all" || product.productType === filterType;
    const matchesMaterial =
      filterMaterial === "all" || product.productMaterial === filterMaterial;

    return matchesSearch && matchesType && matchesMaterial;
  });

  const typeData = Array.from(
    filteredProducts.reduce((acc, product) => {
      acc.set(product.productType, (acc.get(product.productType) || 0) + 1);
      return acc;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  const materialData = Array.from(
    filteredProducts.reduce((acc, product) => {
      acc.set(
        product.productMaterial,
        (acc.get(product.productMaterial) || 0) + 1
      );
      return acc;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  const monthData = Array.from(
    filteredProducts.reduce((acc, product) => {
      const month = new Date(product.createdAt).toLocaleString("default", {
        month: "short",
      });
      acc.set(month, (acc.get(month) || 0) + 1);
      return acc;
    }, new Map()),
    ([name, count]) => ({ name, count })
  );

  const validityData = Array.from(
    filteredProducts.reduce((acc, product) => {
      if (!product.validity) return acc;

      const validityDate = new Date(product.validity);
      const currentDate = new Date();
      const monthsDiff = Math.floor(
        (validityDate.getTime() - currentDate.getTime()) /
          (1000 * 60 * 60 * 24 * 30)
      );

      let range = "Expired";
      if (monthsDiff >= 0 && monthsDiff < 3) {
        range = "0-3 months";
      } else if (monthsDiff >= 3 && monthsDiff < 6) {
        range = "3-6 months";
      } else if (monthsDiff >= 6 && monthsDiff < 12) {
        range = "6-12 months";
      } else if (monthsDiff >= 12) {
        range = "> 1 year";
      }

      acc.set(range, (acc.get(range) || 0) + 1);
      return acc;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  const materialSet = new Set(filteredProducts.map((p) => p.productMaterial));

  const typeMaterialData = [];
  filteredProducts.forEach((product) => {
    const existingEntry = typeMaterialData.find(
      (entry) =>
        entry.type === product.productType &&
        entry.material === product.productMaterial
    );

    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      typeMaterialData.push({
        type: product.productType,
        material: product.productMaterial,
        count: 1,
      });
    }
  });

  // Prepare data for scatter plot view
  const scatterData = typeMaterialData.map((item) => ({
    x: item.type,
    y: item.material,
    z: item.count,
  }));

  const validityScatterData = filteredProducts
    .filter((product) => product.validity)
    .map((product) => {
      const validityDate = new Date(product.validity);
      const currentDate = new Date();
      const daysToExpire = Math.floor(
        (validityDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      return {
        name: product.name,
        daysToExpire: daysToExpire,
        type: product.productType,
      };
    });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ mt: 10, textAlign: "center" }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading product data...
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <div id="root" inert={loading}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
          <Typography
            component="h1"
            variant="h4"
            align="center"
            color="primary"
            gutterBottom
            fontWeight="bold"
          >
            <Analytics
              sx={{ mr: 1, fontSize: "inherit", verticalAlign: "middle" }}
            />
            Product Analytics Dashboard
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {error}
            </Alert>
          )}

          {/* Filters Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Grid
              container
              spacing={3}
              alignItems="stretch"
              justifyContent="space-between"
            >
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Search Products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ height: "100%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ height: "100%" }}
                >
                  <InputLabel id="type-filter-label">Filter by Type</InputLabel>
                  <Select
                    labelId="type-filter-label"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    label="Filter by Type"
                    startAdornment={
                      <InputAdornment position="start">
                        <Category />
                      </InputAdornment>
                    }
                  >
                    {productTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type === "all" ? "All Types" : type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ height: "100%" }}
                >
                  <InputLabel id="material-filter-label">
                    Filter by Material
                  </InputLabel>
                  <Select
                    labelId="material-filter-label"
                    value={filterMaterial}
                    onChange={(e) => setFilterMaterial(e.target.value)}
                    label="Filter by Material"
                    startAdornment={
                      <InputAdornment position="start">
                        <FilterList />
                      </InputAdornment>
                    }
                  >
                    {productMaterials.map((material) => (
                      <MenuItem key={material} value={material}>
                        {material === "all" ? "All Materials" : material}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Total Products
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                  >
                    {products.length}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <Inventory color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Different products tracked
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Product Types
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                  >
                    {typeData.length}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <Category color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Unique categories registered
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Materials Used
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                  >
                    {materialData.length}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <Category color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Different material types
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>
                    Current Filter Results
                  </Typography>
                  <Typography
                    variant="h3"
                    component="div"
                    color="primary"
                    fontWeight="bold"
                  >
                    {filteredProducts.length}
                  </Typography>
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <FilterList color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      Products matching criteria
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Section */}
          {products.length > 0 ? (
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ p: 3, borderRadius: 2, height: "100%" }}
                  elevation={2}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Products by Type
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={typeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {typeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ p: 3, borderRadius: 2, height: "100%" }}
                  elevation={2}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Products by Material
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={materialData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          interval={0}
                          height={70}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Products" fill="#1976d2" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ p: 3, borderRadius: 2, height: "100%" }}
                  elevation={2}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Product Validity Distribution
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={validityData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Products" fill="#4caf50">
                          {validityData.map((entry, index) => {
                            let color = "#4caf50";
                            if (entry.name === "Expired") {
                              color = "#f44336";
                            } else if (entry.name === "0-3 months") {
                              color = "#ff9800";
                            }
                            return <Cell key={`cell-${index}`} fill={color} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{ p: 3, borderRadius: 2, height: "100%" }}
                  elevation={2}
                >
                  <Typography variant="h6" color="primary" gutterBottom>
                    Type-Material Relationship
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      {typeMaterialData.length > 0 ? (
                        <BarChart
                          data={typeMaterialData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="type"
                            angle={-45}
                            textAnchor="end"
                            interval={0}
                            height={70}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name, props) => [
                              `${value} products`,
                              props.payload.material,
                            ]}
                            labelFormatter={(label) => `Type: ${label}`}
                          />
                          <Legend />
                          <Bar
                            dataKey="count"
                            name="Count"
                            fill="#9c27b0"
                            minPointSize={3}
                          >
                            {typeMaterialData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  COLORS[
                                    materialSet.size > 0
                                      ? Array.from(materialSet).indexOf(
                                          entry.material
                                        ) % COLORS.length
                                      : index % COLORS.length
                                  ]
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textAlign: "center", mt: 10 }}
                        >
                          Not enough data to display this chart
                        </Typography>
                      )}
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Product Validity Scatter Plot
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ height: 500 }}>
                    {" "}
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 40, left: 100 }}
                      >
                        <CartesianGrid />
                        <XAxis
                          type="number"
                          dataKey="daysToExpire"
                          name="Days to Expire"
                          label={{
                            value: "Days to Expire",
                            position: "insideBottom",
                            offset: -10,
                          }}
                        />
                        <YAxis
                          type="category"
                          dataKey="type"
                          name="Product Type"
                          label={{
                            value: "Product Type",
                            angle: -90,
                            position: "insideLeft",
                            dx: -40,
                            dy: 10,
                          }}
                        />
                        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                        <Scatter
                          name="Products"
                          data={validityScatterData}
                          fill="#8884d8"
                        >
                          {validityScatterData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : null}

          {/* Product Table */}
          <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                <Inventory sx={{ mr: 1, verticalAlign: "middle" }} />
                Product List
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </Typography>
            </Box>

            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: "rgba(25, 118, 210, 0.05)" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Material</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Valid Until
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>{product.id}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.productType}</TableCell>
                        <TableCell>{product.productMaterial}</TableCell>
                        <TableCell>{formatDate(product.validity)}</TableCell>
                        <TableCell>{product.phoneNumber}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                        No products match your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </ThemeProvider>
    </div>
  );
};

export default ProductAnalysis;
