import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// it creates a new data set of a company and its stock data
function CreateData() {
  const [formData, setFormData] = useState({
    companyId: "",
    companyName: "",
    location: "",
    stockId: "",
    currentPrice: "",
    volume: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Form data:", formData);

    // Later:
    // 1. POST company data to /companies
    // 2. POST stock data to /stocks
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
        <Typography variant="h6">Company data</Typography>

        <TextField
          label="Company ID"
          name="companyId"
          value={formData.companyId}
          onChange={handleChange}
          placeholder="e.g. JKLM"
          required
        />

        <TextField
          label="Company name"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="e.g. Sony Group Corporation"
          required
        />

        <TextField
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Japan"
          required
        />

        <Typography variant="h6" sx={{ mt: 2 }}>
          Stock data
        </Typography>

        <TextField
          label="Stock symbol"
          name="stockId"
          value={formData.stockId}
          onChange={handleChange}
          placeholder="e.g. SONY"
          required
        />

        <TextField
          label="Current price"
          name="currentPrice"
          type="number"
          value={formData.currentPrice}
          onChange={handleChange}
          required
        />

        <TextField
          label="Volume"
          name="volume"
          type="number"
          value={formData.volume}
          onChange={handleChange}
          required
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            alignSelf: "flex-start",
          }}
        >
          Save data
        </Button>
      </Box>
    </Box>
  );
}

export default CreateData;
