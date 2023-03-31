import React from "react";
import Image from "next/image";
import { Container,Typography } from "@mui/material";

const Custom403 = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
      <Image src="/403.png" alt="403 error" width={400} height={400} />
      <Typography variant="h2" color="primary" sx={{ mt: 4 }}>
        403 : Access Denied
      </Typography>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Sorry, you don't have permission to access this page.
      </Typography>
    </Container>
  );
};

export default Custom403;
