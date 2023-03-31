import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Container, Typography, Button} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import MenuIcon from "@mui/icons-material/Menu";

export default function Header(props) {
  const { header, connect, } = props;

  return (
    <div>
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                        }}
                    >
                        ISP
                    </Typography>

                    {
                        header.isUser
                        &&
                        <Typography
                        variant="h7"
                        noWrap
                        component="a"
                        href="/profile"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                            profile
                        </Typography>
                    }

                    {
                        header.isUser
                        &&
                        <Typography
                        variant="h7"
                        noWrap
                        component="a"
                        href="/invest"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                            invest
                        </Typography>
                    }

                    {
                        header.isDev
                        &&
                        <Typography
                        variant="h7"
                        noWrap
                        component="a"
                        href="/dev"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                            dev
                        </Typography>
                    }
                    {
                        header.isAdmin
                        &&
                        <Typography
                        variant="h7"
                        noWrap
                        component="a"
                        href="/admin"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                        >
                            admin
                        </Typography>
                    }


                    <div style={{ marginLeft: "auto" }}>
                        {header.buttonContent!=null ? (
                        <div>
                            <Typography variant="body1" color="inherit">
                            Welcome, {header.buttonContent.slice(-4)}!
                            </Typography>
                            <Button color="inherit" onClick={connect}>
                            Logout
                            </Button>
                        </div>
                        ) : (
                        <Button color="inherit" onClick={connect}>
                            Connect
                        </Button>
                        )}
                    </div>
                </Toolbar>
            </Container>
        </AppBar>
    </div>
  );
}
