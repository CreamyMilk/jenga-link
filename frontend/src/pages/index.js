import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {ToggleButton} from "@mui/material";
import {ToggleButtonGroup} from "@mui/material";
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        JengaLink 🔗
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Sell() {
  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [desc,setDescription] = useState("")
  const [amount,setAmount] = useState("")
  const [stock,setStock] = useState("")
  const [telegram,setTelegram] = useState("")
  const [link,setLink] = useState("")
  const [alignment, setAlignment] = React.useState("NGN");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}


  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = await postData("http://localhost:3010/onboardme",
    {
      "productName":name,
      "imageURL": desc,
      "price":parseFloat(amount),
      "stock":parseInt(amount),
      "email": email,
      "telegram": telegram,
      "countryCode":alignment
    })

    alert(JSON.stringify(data.CoolURL))
  };


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar alt="Remy Sharp" src="/images/cashless-system.png" />
          <Typography component="h1" variant="h5">
            jengaKash
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              helperText="Please enter your Prefered name"
              fullWidth
              value={name}
              onChange={(e)=>{
                setName(e.target.value)
              }}
              id="demo-helper-text-misaligned"
              label="Name"
            />
            <TextField
              helperText="Please enter your product  description"
              fullWidth
              value={desc}
              onChange={(e)=>{
                setDescription(e.target.value)
              }}
              id="demo-helper-text-misaligned"
              label="description"
            />
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">
                Amount
              </InputLabel>
              <OutlinedInput
                helperText="Please enter your product  price"
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
              value={amount}
              onChange={(e)=>{
                setAmount(e.target.value)
              }}

                label="Amount"
              />
            </FormControl>
            <TextField
              helperText="Please enter your product stock"
              fullWidth
              id="demo-helper-text-misaligned"
              label="stock"
              value={stock}
              onChange={(e)=>{
                setStock(e.target.value)
              }}

            />
            <TextField
              helperText="Please enter your email address"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value)
              }}

              autoFocus
            />
            <TextField
              helperText="Please enter your telegram username"
              fullWidth
              id="demo-helper-text-misaligned"
              label="telegram username"
              value={telegram}
              onChange={(e)=>{
                setTelegram(e.target.value)
              }}
            />

            <ToggleButtonGroup
              color="primary"
              value={alignment}
              exclusive
              onChange={handleChange}
              aria-label="Platform"
            >
              <ToggleButton value="KES">🇰🇪 KES</ToggleButton>
              <ToggleButton value="NGN">🇳🇬 NGN</ToggleButton>
            </ToggleButtonGroup>
{/* 
            <Button variant="contained" component="label">
              Upload product image
              <input hidden accept="image/*" multiple type="file" />
            </Button> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              submit
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
