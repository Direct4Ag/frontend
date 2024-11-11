import React from 'react';

// import { useParams } from 'react-router-dom'

import { Box, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import SoilMoistureDepthWithATMData from '@app/components/childComponents/SoilMoistureDepthWithATMData';

import { theme } from '@app/theme';

const IrrigationStrategiesPage = () => {
    const generateYears = (startYear: number = 2023): string[] => {
        const currentYear = new Date().getFullYear();
        const years: string[] = [];
        for (let i = startYear; i <= currentYear; i++) {
            years.push(i.toString());
        }
        return years;
    };

    const yearsSelectDefault = ['2023'];
    const [yearsSelect, setYearsSelect] = React.useState<string[]>(yearsSelectDefault);
    const [selectedYear, setSelectedYear] = React.useState<string>(yearsSelectDefault[0]);

    React.useEffect(() => {
        setYearsSelect(generateYears());
    }, []);

    return (
        <Container disableGutters>
            <Container
                sx={{
                    backgroundColor: '#F8FAFC',
                    padding: '32px',
                    width: '100%'
                }}
            >
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            font: 'Poppins',
                            fontWeight: 700,
                            fontSize: '20px',
                            lineHeight: '32px',
                            letterSpacing: '0.15px',
                            color: theme.palette.text.primary,
                            textTransform: 'capitalize'
                        }}
                    >
                        Irrigation Strategies
                    </Typography>
                </Box>
                <Box
                    sx={{
                        mt: 4
                    }}
                >
                    <Stack direction="row" spacing={3}>
                        <FormControl>
                            <InputLabel id="year-select-label">Choose a Year</InputLabel>
                            <Select
                                labelId="year-select-label"
                                id="year-select"
                                value={selectedYear}
                                label="Choose a Year"
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                }}
                                sx={{
                                    width: '200px'
                                }}
                            >
                                {yearsSelect.map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Box>
            </Container>
            <SoilMoistureDepthWithATMData selectedYear={selectedYear} sectionHeader="Soil Moisture by Depth" />
        </Container>
    );
};

export default IrrigationStrategiesPage;
