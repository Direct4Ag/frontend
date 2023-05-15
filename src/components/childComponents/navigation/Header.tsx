import React from 'react';
import { Link } from 'react-router-dom';

import AgricultureIcon from '@mui/icons-material/Agriculture';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import logoBWUIUC from './logo_bw_uiuc.png';
import logoColorUIUC from './logo_color_uiuc.png';
import logo from './images/logo.png';

const pages = [{ pg: 'Explore', url: '/explore' }];

const Header = (): JSX.Element => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <>
            <AppBar position="static" sx={(theme) => ({ backgroundColor: theme.palette.default.light })}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <AgricultureIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'black' }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontWeight: 400,
                                fontSize: '1.2em',
                                letterSpacing: '.1rem',
                                color: 'black',
                                textDecoration: 'none'
                            }}
                        >
                            Direct4Ag
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon sx={{ color: 'black', zIndex: 1 }} />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left'
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left'
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' }
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page.pg} onClick={handleCloseNavMenu}>
                                        <Typography
                                            textAlign="center"
                                            component={Link}
                                            to={page.url}
                                            sx={{
                                                fontWeight: 400,
                                                fontSize: '1rem',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            {page.pg}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <AgricultureIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'black' }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component={Link}
                            to="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontWeight: 400,
                                fontSize: '1em',
                                letterSpacing: '.1rem',
                                color: 'black',
                                textDecoration: 'none'
                            }}
                        >
                            Direct4Ag
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                            {pages.map((page) => (
                                <Button
                                    key={page.pg}
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        my: 2,
                                        color: 'black',
                                        display: 'block'
                                    }}
                                >
                                    <Typography
                                        textAlign="center"
                                        component={Link}
                                        to={page.url}
                                        sx={{
                                            color: 'black',
                                            fontWeight: 400,
                                            fontSize: '1.2rem',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        {page.pg}
                                    </Typography>
                                </Button>
                            ))}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
};

export default Header;
