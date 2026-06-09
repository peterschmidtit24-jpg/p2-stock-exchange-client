import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";

const API_BASE_URL = "http://localhost:5002";

function UpdateData() {
  const location = useLocation();
  const navigate = useNavigate();
  const { company, stock } = location.state || {};

  const [formData, setFormData] = useState({
    stockId: stock?.id || "",
    companyId: stock?.companyId || company?.id || "",
    currentPrice: stock?.currentPrice || "",
    priceChange: stock?.priceChange || "",
    priceChangePercent: stock?.priceChangePercent || "",
    volume: stock?.volume || "",
    marketCap: stock?.marketCap || "",
    companyName: company?.name || "",
    image: company?.image || "",
    branch: company?.branch || "",
    location: company?.location || "",
    lastRevenue: company?.lastRevenue || "",
    lastRevenueDate: company?.lastRevenueDate || "",
    lastEarnings: company?.lastEarnings || "",
    lastEarningsDate: company?.lastEarningsDate || "",
    buyRatings: company?.analystRatings?.buy || "",
    holdRatings: company?.analystRatings?.hold || "",
    sellRatings: company?.analystRatings?.sell || "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleCancel() {
    console.log("Cancel update clicked", {
      company,
      stock,
    });
    navigate("/");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const updatedCompany = {
      id: formData.companyId,
      name: formData.companyName,
      image: formData.image,
      branch: formData.branch,
      location: formData.location,
      lastRevenue: Number(formData.lastRevenue) || 0,
      lastRevenueDate: formData.lastRevenueDate,
      lastEarnings: Number(formData.lastEarnings) || 0,
      lastEarningsDate: formData.lastEarningsDate,
      analystRatings: {
        buy: Number(formData.buyRatings) || 0,
        hold: Number(formData.holdRatings) || 0,
        sell: Number(formData.sellRatings) || 0,
      },
    };

    const updatedStock = {
      id: formData.stockId,
      companyId: updatedCompany.id,
      currentPrice: Number(formData.currentPrice) || 0,
      priceChange: Number(formData.priceChange) || 0,
      priceChangePercent: Number(formData.priceChangePercent) || 0,
      volume: Number(formData.volume) || 0,
      marketCap: Number(formData.marketCap) || 0,
    };

    console.log("Submit update clicked", {
      company: updatedCompany,
      stock: updatedStock,
    });

    await axios.put(`${API_BASE_URL}/companies/${company.id}`, updatedCompany);
    await axios.put(`${API_BASE_URL}/stocks/${stock.id}`, updatedStock);

    navigate("/");
  }

  if (!company || !stock) {
    return (
      <Box sx={{ minHeight: "100vh", p: 3, backgroundColor: "background.default" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          No stock data selected
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to market
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Update stock data
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 500,
        }}
      >
        <Typography variant="h6">Stock data</Typography>

        <TextField label="Stock symbol" name="stockId" value={formData.stockId} onChange={handleChange} />
        <TextField label="Company ID" name="companyId" value={formData.companyId} onChange={handleChange} />
        <TextField label="Current price" name="currentPrice" type="number" value={formData.currentPrice} onChange={handleChange} />
        <TextField label="Price change" name="priceChange" type="number" value={formData.priceChange} onChange={handleChange} />
        <TextField label="Price change percent" name="priceChangePercent" type="number" value={formData.priceChangePercent} onChange={handleChange} />
        <TextField label="Volume" name="volume" type="number" value={formData.volume} onChange={handleChange} />
        <TextField label="Market cap" name="marketCap" type="number" value={formData.marketCap} onChange={handleChange} />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Company data
        </Typography>

        <TextField label="Company name" name="companyName" value={formData.companyName} onChange={handleChange} />
        <TextField label="Image path" name="image" value={formData.image} onChange={handleChange} />
        <TextField label="Branch" name="branch" value={formData.branch} onChange={handleChange} />
        <TextField label="Location" name="location" value={formData.location} onChange={handleChange} />
        <TextField label="Last revenue" name="lastRevenue" type="number" value={formData.lastRevenue} onChange={handleChange} />
        <TextField
          label="Last revenue date"
          name="lastRevenueDate"
          type="date"
          value={formData.lastRevenueDate}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField label="Last earnings" name="lastEarnings" type="number" value={formData.lastEarnings} onChange={handleChange} />
        <TextField
          label="Last earnings date"
          name="lastEarningsDate"
          type="date"
          value={formData.lastEarningsDate}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Analyst ratings
        </Typography>

        <TextField label="Buy ratings" name="buyRatings" type="number" value={formData.buyRatings} onChange={handleChange} />
        <TextField label="Hold ratings" name="holdRatings" type="number" value={formData.holdRatings} onChange={handleChange} />
        <TextField label="Sell ratings" name="sellRatings" type="number" value={formData.sellRatings} onChange={handleChange} />

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button type="submit" variant="contained">
            Submit changes
          </Button>
          <Button type="button" variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default UpdateData;
