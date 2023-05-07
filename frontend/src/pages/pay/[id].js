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
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Image from "next/image";

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
        jengaLink 🔗
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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

const theme = createTheme();
export async function getServerSideProps({ params }) {
  let response = await postData("http://localhost:3010/getmeprod",{"pid": params.id})

  return {
    props: {
      metaProduct: {
        id: params.id || "",
      },
      apiProd : response
    },
  };
}


export default function Payment({metaProduct,apiProd}) {
  const [alignment, setAlignment] = React.useState("NGN");

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [email,setEmail] = useState("")
  const [telegram,setTelegram] = useState("")
  const [productName,setProductName] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault();
    let data = await postData("http://localhost:3010/payforprod",
      {
      "pid":metaProduct.id,
      // "nam"
      "email":email,
      "country":alignment,
    })

    alert(JSON.stringify(data))
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
          <br></br>
          <Image width={150} height={200} src="https://plus.unsplash.com/premium_photo-1669930982752-7abd60298885?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1530&q=80"></Image>
          <Typography component="h1" variant="h5">
            💸 Payment for ({apiProd.productName})
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              helperText="Please enter your prefered name" 
              fullWidth
              value={productName}
              onChange={(e)=>{
                setProductName(e.target.value)
              }}
              id="demo-helper-text-misaligned"
              label="Name"
            />
            {/* <h1>{metaProduct.id}</h1> */}

            <TextField
              helperText="Please enter your email address"
              margin="normal"
              required
              value={email}
              onChange={(e)=>{
                setEmail(e.target.value)
              }}
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              helperText="Please enter your telegram username"
              fullWidth
              value={telegram}
              onChange={(e)=>{
                setTelegram(e.target.value)
              }}
              id="demo-helper-text-misaligned"
              label="telegram username"
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
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Pay
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
