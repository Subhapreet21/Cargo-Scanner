import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductQRCodeGenerator from "./components/ProductQRCodeGenerator";
import ProductAnalysis from "./components/ProductAnalysis";
import Navbar from "./components/Navbar";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/productQRCodeGenerator"
          element={<PrivateRoute element={<ProductQRCodeGenerator />} />}
        />
        <Route
          path="/productAnalysis"
          element={<PrivateRoute element={<ProductAnalysis />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
