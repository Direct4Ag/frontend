import React, { FC } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { theme } from '../../../theme';

const drawerWidth = 472;

const howToSection = [
    {
        title: 'How to read precipitation',
        content: 'Some explanation'
    },
    {
        title: 'How to read soil moisture',
        content: 'Some explanation'
    },
    {
        title: 'How we implemented sensors',
        content: 'Some explanation'
    }
];

type Props = {
    selectedResearch: ResearchDetail | null;
    dataType: string;
    pi: string;
    contactInfo: string;
    introduction: string;
    conclusion: string;
};

const ResearchLeftSidebar: FC<Props> = ({
    selectedResearch,
    dataType,
    pi,
    contactInfo,
    introduction,
    conclusion
}): JSX.Element => {
    const selectedFieldDetail = selectedResearch !== null ? selectedResearch.field : null;

    return (
        <>
            <CssBaseline />
            <Stack direction="row">
                <Box
                    sx={{
                        width: drawerWidth,
                        p: '24px',
                        pointerEvents: 'auto',
                        scrollBehavior: 'smooth',
                        background:
                            'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
                    }}
                >
                    <Stack sx={{ marginBottom: 6 }} spacing={2}>
                        <Box>
                            <Button href="/explore" variant="text" startIcon={<ChevronLeftIcon />}>
                                <Typography
                                    sx={{
                                        font: 'Roboto',
                                        fontWeight: 400,
                                        fontSize: '14px',
                                        lineHeight: '20.02px',
                                        color: theme.palette.text.primary
                                    }}
                                    variant="body2"
                                >
                                    Back to Map
                                </Typography>
                            </Button>
                        </Box>
                        <Box>
                            <Typography
                                variant="caption"
                                sx={{
                                    font: 'Roboto',
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    lineHeight: '19.92px',
                                    letterSpacing: '0.4px',
                                    color: theme.palette.text.secondary
                                }}
                            >
                                {selectedFieldDetail?.farm.location_name}
                            </Typography>
                            <Typography
                                variant="h6"
                                sx={{
                                    font: 'Poppins',
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    lineHeight: '32px',
                                    letterSpacing: '0.15px',
                                    color: theme.palette.text.primary
                                }}
                            >
                                {selectedFieldDetail?.farm.farm_name}
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    font: 'Roboto',
                                    fontWeight: 400,
                                    fontSize: '12px',
                                    lineHeight: '19.92px',
                                    letterSpacing: '0.4px',
                                    color: theme.palette.text.secondary
                                }}
                            >
                                {selectedFieldDetail?.field_name}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack sx={{ marginBottom: 3 }} spacing={2}>
                        <Box>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    font: 'Roboto',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    lineHeight: '28px',
                                    letterSpacing: '0.15px',
                                    color: theme.palette.text.primary
                                }}
                            >
                                About the Research
                            </Typography>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        font: 'Roboto',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        lineHeight: '21.98px',
                                        letterSpacing: '0.1px',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    Data Type
                                </Typography>
                                <Typography variant="body2" sx={{ font: 'Roboto' }}>
                                    {dataType}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        font: 'Roboto',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        lineHeight: '21.98px',
                                        letterSpacing: '0.1px',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    PI
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                    {pi}
                                </Typography>
                            </Stack>
                            <Stack direction="row" spacing={2} justifyContent="flex-start">
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        font: 'Roboto',
                                        fontWeight: 500,
                                        fontSize: '14px',
                                        lineHeight: '21.98px',
                                        letterSpacing: '0.1px',
                                        color: theme.palette.text.primary
                                    }}
                                >
                                    Contact Info
                                </Typography>
                                <Typography variant="body2" sx={{ fontSize: '14px' }}>
                                    {contactInfo}
                                </Typography>
                            </Stack>
                        </Box>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    font: 'Roboto',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    lineHeight: '21.98px',
                                    letterSpacing: '0.1px',
                                    color: theme.palette.text.primary
                                }}
                            >
                                Introduction:
                            </Typography>
                            <Typography variant="body2" sx={{ lineHeight: '21.98px' }}>
                                {introduction}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    font: 'Roboto',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    lineHeight: '21.98px',
                                    letterSpacing: '0.1px',
                                    color: theme.palette.text.primary
                                }}
                            >
                                Take-aways / Conclusions:
                            </Typography>
                            <Typography variant="body2" sx={{ letterSpacing: '0.17px' }}>
                                {conclusion}
                            </Typography>
                        </Box>
                    </Stack>
                    <Box sx={{ marginBottom: 8 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            disableElevation
                            sx={{
                                'color': theme.palette.text.primary,
                                'backgroundColor': theme.palette.primary.light,
                                'fontWeight': { xs: 600, md: 800 },
                                'fontSize': { xs: 14, md: 16 },
                                'font': 'Roboto',
                                '&:hover': {
                                    color: theme.palette.default.btnHoverText,
                                    backgroundColor: theme.palette.default.btnLightBackground
                                },
                                'padding': theme.spacing(2)
                            }}
                        >
                            MORE ABOUT THE RESEARCH
                        </Button>
                    </Box>
                    <Stack spacing={2}>
                        {howToSection.map((section) => {
                            return (
                                <Box key={section.title}>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            font: 'Roboto',
                                            fontWeight: 700,
                                            fontSize: '16px',
                                            lineHeight: '28px',
                                            letterSpacing: '0.15px',
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        {section.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                        {section.content}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                </Box>
            </Stack>
        </>
    );
};

export default ResearchLeftSidebar;
