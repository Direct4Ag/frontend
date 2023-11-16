import React from 'react';
import { Link } from 'react-router-dom';

import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowRight as KeyboardArrowRightIcon,
    Menu as MenuIcon
} from '@mui/icons-material';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { HashLink } from 'react-router-hash-link';

import logo from './D4ALogo.png';

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        'borderRadius': 6,
        'marginTop': theme.spacing(1),
        'minWidth': 180,
        'color': theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        'boxShadow':
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0'
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5)
            },
            '&:active': {
                backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
            }
        }
    }
}));

// TODO: replace email id dynamically
const pages = [
    { pg: 'Email Us Questions', url: 'mailto: dir4agteam@illinois.edu' },
    { pg: 'About Us', url: '/aboutus' },
    { pg: 'Explore', url: '/explore' }
];

const areas = [
    { name: 'Cover Cropping', url: '#nitrogencons' },
    { name: 'Crop Rotation', url: '#nitrogencons' },
    { name: 'Draught-resistant Seed Performance', url: '#waterres' },
    { name: 'Irrigation Strategies', url: '#waterres' }
];

const Header = (): JSX.Element => {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorAoIEl, setAnchorAoIEl] = React.useState<null | HTMLElement>(null);

    const open = Boolean(anchorAoIEl);

    const handleOpenAoI = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorAoIEl(event.currentTarget);
    };
    const handleCloseAoI = () => {
        setAnchorAoIEl(null);
    };

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (
        <AppBar position="static" sx={(theme) => ({ backgroundColor: theme.palette.default.main })} elevation={0}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <a href='/'>
                            <img alt="Direct4Ag Logo" src={logo} />
                        </a>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end' }}>
                        {/* <Stack direction="row" spacing={2} sx={{display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end'}}> */}
                        <Button
                            id="aoi-btn"
                            aria-controls={open ? 'aoi-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            sx={(theme) => ({
                                my: 2,
                                mx: 1,
                                color: theme.palette.text.primary,
                                fontSize: theme.typography.pxToRem(14),
                                fontWeight: theme.typography.fontWeightMedium
                            })}
                            variant="text"
                            disableElevation
                            onClick={handleOpenAoI}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            Areas of Interest
                        </Button>
                        <StyledMenu
                            id="aoi-menu"
                            MenuListProps={{
                                'aria-labelledby': 'aoi-btn'
                            }}
                            anchorEl={anchorAoIEl}
                            open={open}
                            onClose={handleCloseAoI}
                        >
                            {areas.map((area) => (
                                <MenuItem key={area.name} onClick={handleCloseAoI} disableRipple>
                                    <HashLink smooth to={area.url} style={{ textDecoration: 'none' }}>
                                        <Typography
                                            textAlign="center"
                                            sx={(theme) => ({
                                                color: theme.palette.text.primary,
                                                fontSize: theme.typography.pxToRem(16),
                                                fontWeight: theme.typography.fontWeightRegular,
                                                textDecoration: 'none'
                                            })}
                                        >
                                            {area.name}
                                        </Typography>
                                    </HashLink>
                                </MenuItem>
                            ))}
                        </StyledMenu>
                        {pages.map((page) => (
                            <Button
                                key={page.pg}
                                onClick={handleCloseNavMenu}
                                sx={{
                                    my: 2,
                                    mx: 1
                                }}
                            >
                                <HashLink smooth to={page.url} style={{ textDecoration: 'none' }}>
                                    <Typography
                                        textAlign="center"
                                        sx={(theme) => ({
                                            color: theme.palette.text.primary,
                                            fontSize: theme.typography.pxToRem(14),
                                            fontWeight: theme.typography.fontWeightMedium,
                                            textDecoration: 'none'
                                        })}
                                    >
                                        {page.pg}
                                    </Typography>
                                </HashLink>
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show menu items"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon sx={(theme) => ({ color: theme.palette.text.primary, zIndex: 1 })} />
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
                            <MenuItem
                                onClick={handleOpenAoI}
                                sx={(theme) => ({
                                    color: theme.palette.text.primary,
                                    fontSize: theme.typography.pxToRem(16),
                                    fontWeight: theme.typography.fontWeightMedium,
                                    textDecoration: 'none'
                                })}
                            >
                                Areas of Interest
                                <KeyboardArrowRightIcon />
                            </MenuItem>
                            {pages.map((page) => (
                                <MenuItem key={page.pg} onClick={handleCloseNavMenu}>
                                    <HashLink smooth to={page.url} style={{ textDecoration: 'none' }}>
                                        <Typography
                                            textAlign="center"
                                            component={Link}
                                            to={page.url}
                                            sx={(theme) => ({
                                                color: theme.palette.text.primary,
                                                fontSize: theme.typography.pxToRem(16),
                                                fontWeight: theme.typography.fontWeightMedium,
                                                textDecoration: 'none'
                                            })}
                                        >
                                            {page.pg}
                                        </Typography>
                                    </HashLink>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <img alt="Direct4Ag Logo" src={logo} />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
