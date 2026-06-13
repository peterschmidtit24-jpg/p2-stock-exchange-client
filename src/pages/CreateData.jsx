import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

// it creates a new data set of a company and its stock data
function CreateData() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    stockId: "",
    companyId: "",
    currentPrice: "",
    priceChange: "",
    priceChangePercent: "",
    volume: "",
    marketCap: "",
    companyName: "",
    image: "",
    branch: "",
    location: "",
    lastRevenue: "",
    lastRevenueDate: "",
    lastEarnings: "",
    lastEarningsDate: "",
    buyRatings: "",
    holdRatings: "",
    sellRatings: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      const companyId = formData.companyId.trim().toUpperCase() || `COMP${Date.now()}`;
      const stockId = formData.stockId.trim().toUpperCase() || `STK${Date.now()}`;

      const newStockData = {
        id: stockId,
        companyId,
        currentPrice: Number(formData.currentPrice) || 0,
        priceChange: Number(formData.priceChange) || 0,
        priceChangePercent: Number(formData.priceChangePercent) || 0,
        volume: Number(formData.volume) || 0,
        marketCap: Number(formData.marketCap) || 0,

        company: {
          id: companyId,
          name: formData.companyName.trim() || "New Company",
          image: formData.image.trim() || "/assets/google-color-icon.svg",
          branch: formData.branch.trim() || "Unknown",
          location: formData.location.trim() || "Unknown",
          lastRevenue: Number(formData.lastRevenue) || 0,
          lastRevenueDate: formData.lastRevenueDate || "2024-01-01",
          lastEarnings: Number(formData.lastEarnings) || 0,
          lastEarningsDate: formData.lastEarningsDate || "2024-01-01",
          analystRatings: {
            buy: Number(formData.buyRatings) || 0,
            hold: Number(formData.holdRatings) || 0,
            sell: Number(formData.sellRatings) || 0,
          },
        },
      };

      const { company, ...stock } = newStockData;

      // update the DB on the server
      await axios.post(`${API_BASE_URL}/companies`, company);
      await axios.post(`${API_BASE_URL}/stocks`, stock);

      navigate("/");
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  }

  // the form with material UI for entring the new stock data
  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 3,
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="h5" sx={{ mb: 3 }}>
        Create stock data
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

        <TextField
          label="Stock symbol"
          name="stockId"
          value={formData.stockId}
          onChange={handleChange}
          placeholder="e.g. MSFT"
        />

        <TextField
          label="Company ID"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          placeholder="e.g. CDEF"
        />

        <TextField
          label="Current price"
          name="currentPrice"
          type="number"
          value={formData.currentPrice}
          onChange={handleChange}
        />

        <TextField
          label="Price change"
          name="priceChange"
          type="number"
          value={formData.priceChange}
          onChange={handleChange}
        />

        <TextField
          label="Price change percent"
          name="priceChangePercent"
          type="number"
          value={formData.priceChangePercent}
          onChange={handleChange}
        />

        <TextField
          label="Volume"
          name="volume"
          type="number"
          value={formData.volume}
          onChange={handleChange}
        />

        <TextField
          label="Market cap"
          name="marketCap"
          type="number"
          value={formData.marketCap}
          onChange={handleChange}
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Company data
        </Typography>

        <TextField
          label="Company name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="e.g. Microsoft Corporation"
        />

        <TextField
          label="Image path"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="/assets/windows-10-icon.svg"
        />

        <TextField
          label="Branch"
          name="branch"
          value={formData.branch}
          onChange={handleChange}
          placeholder="e.g. Technology"
        />

        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. USA"
        />

        <TextField
          label="Last revenue"
          name="lastRevenue"
          type="number"
          value={formData.lastRevenue}
          onChange={handleChange}
        />

        <TextField
          label="Last revenue date"
          name="lastRevenueDate"
          type="date"
          value={formData.lastRevenueDate}
          onChange={handleChange}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Last earnings"
          name="lastEarnings"
          type="number"
          value={formData.lastEarnings}
          onChange={handleChange}
        />

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

        <TextField
          label="Buy ratings"
          name="buyRatings"
          type="number"
          value={formData.buyRatings}
          onChange={handleChange}
        />

        <TextField
          label="Hold ratings"
          name="holdRatings"
          type="number"
          value={formData.holdRatings}
          onChange={handleChange}
        />

        <TextField
          label="Sell ratings"
          name="sellRatings"
          type="number"
          value={formData.sellRatings}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={isSaving}
          startIcon={isSaving ? <CircularProgress color="inherit" size={20} /> : null}
          sx={{
            mt: 2,
            alignSelf: "flex-start",
          }}
        >
          {isSaving ? "Saving..." : "Save data"}
        </Button>
      </Box>
    </Box>
  );
}

export default CreateData;
