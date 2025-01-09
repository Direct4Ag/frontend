import React from 'react';

import {
    Box,
    Container,
    Divider,
    Grid,
    Stack,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { theme } from '@app/theme';
import BiomassChart from './BiomassChart';
import CNRatioChart from './CNRatioChart';

interface CoverCropInformation {
    [key: string]: {
        crop: string;
        planting_date: string;
        planting_method: string;
        seeting_rate: string;
        termination_date: string;
    };
}

interface CoverCropInfoDataByYear {
    [key: string]: CoverCropData[];
}

const InformationHeading = styled(Typography)({
    font: 'Roboto',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '21.98px',
    letterSpacing: '0.1px',
    color: theme.palette.text.primary
});

const CoverCropYield: React.FC<{ coverCropYieldData: CoverCropYieldData[] | null }> = ({ coverCropYieldData }) => {
    const yearsSelectDefault = ['2022'];
    const [yearsSelect, setYearsSelect] = React.useState<string[]>(yearsSelectDefault);
    const [selectedYear, setSelectedYear] = React.useState<string>(yearsSelectDefault[0]);
    const [coverCropInformation, setCoverCropInformation] = React.useState<CoverCropInformation>({});
    const [coverCropData, setCoverCropData] = React.useState<CoverCropInfoDataByYear>({});

    React.useEffect(() => {
        if (coverCropYieldData) {
            const years: string[] = Array.from(
                new Set(coverCropYieldData.map((data) => data.planting_date.split('-')[0]))
            );
            years.sort();
            setYearsSelect(years);
            setSelectedYear(years[0]);

            const coverCropInfo: CoverCropInformation = {};
            const coverCropDataByYear: CoverCropInfoDataByYear = {};

            coverCropYieldData.forEach((data) => {
                const year = data.planting_date.split('-')[0];
                coverCropInfo[year] = {
                    crop: data.crop,
                    planting_date: data.planting_date,
                    planting_method: data.planting_method,
                    seeting_rate: `${data.seeding_rate} ${data.seeding_rate_unit}`,
                    termination_date: data.termination_date
                };
                coverCropDataByYear[year] = data.cover_crop_data;
            });

            setCoverCropInformation(coverCropInfo);
            setCoverCropData(coverCropDataByYear);
        }
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
                        Accuracy of Cover Crop Model Prediction
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
                <Typography
                    variant="h6"
                    sx={{
                        font: 'Poppins',
                        fontWeight: 700,
                        fontSize: '20px',
                        lineHeight: '32px',
                        letterSpacing: '0.15px',
                        color: theme.palette.text.primary,
                        textTransform: 'capitalize',
                        my: 2
                    }}
                >
                    Cover Crop Information: {coverCropInformation[selectedYear]?.crop}
                </Typography>
                <Box>
                    {coverCropInformation[selectedYear] && (
                        <Grid container alignItems="center">
                            <Grid item xs={6} md={3} lg={3}>
                                <InformationHeading variant="subtitle1">Planting Date:</InformationHeading>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <Typography variant="body2" sx={{ font: 'Roboto' }}>
                                    {coverCropInformation[selectedYear].planting_date}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <InformationHeading variant="subtitle1">Planting Method:</InformationHeading>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <Typography variant="body2" sx={{ font: 'Roboto' }}>
                                    {coverCropInformation[selectedYear].planting_method}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <InformationHeading variant="subtitle1">Termination Date:</InformationHeading>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <Typography variant="body2" sx={{ font: 'Roboto' }}>
                                    {coverCropInformation[selectedYear].termination_date}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <InformationHeading variant="subtitle1">Seeding Rate:</InformationHeading>
                            </Grid>
                            <Grid item xs={6} md={3} lg={3}>
                                <Typography variant="body2" sx={{ font: 'Roboto' }}>
                                    {coverCropInformation[selectedYear].seeting_rate}
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </Box>
                <Divider sx={{ my: 2 }} />
                {coverCropData[selectedYear] && <BiomassChart data={coverCropData[selectedYear]} />}
                {coverCropData[selectedYear] && <CNRatioChart data={coverCropData[selectedYear]} />}
            </Container>
        </Container>
    );
};

export default CoverCropYield;
