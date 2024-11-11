import React from 'react';

import {
    Box,
    CircularProgress,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { DataStateContext } from '@app/store/contexts';
import { useSoilTextureData } from '@app/utils/hooks';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import { theme } from '@app/theme';
import SoilMoistureDepthWithATMData from '@app/components/childComponents/SoilMoistureDepthWithATMData';
import SoilTypeTable from './SoilTypeTable';

const SoilTypeTableWithLoading = withLoading(SoilTypeTable);
const SoilTypeTableWithErrorHandling = withErrorHandling(SoilTypeTableWithLoading);

interface SeedSelect {
    label: string;
    value: boolean;
}

interface YeildData {
    [key: string]: {
        // crop
        [key: string]: {
            // year
            byLine: {
                [key: string]: number; // line : avg val
            };
            heighestAvgYield: number;
            byLineReplicates: {
                [key: string]: {
                    // line
                    [key: number]: number; // replicate : val
                };
            };
            planting_date: string;
            harvest_date: string;
        };
    };
}

interface ChartData {
    [key: string]: number | string;
}

const DRSYieldCard = styled(Paper)({
    ...theme.typography.body2,
    backgroundColor: 'white',
    height: '392px',
    width: '433px',
    padding: '32px',
    borderRadius: '24px'
});

const DRSYieldDisplay = styled(Paper)({
    ...theme.typography.body2,
    backgroundColor: 'white',
    height: '106px',
    width: '172.5px',
    padding: '16px 24px 16px 24px',
    borderRadius: '12px',
    border: '1px solid #1D58A71F'
});

const DroughtResistantSeedYield: React.FC<{ drsYieldData: DRSYieldData[] | null }> = ({
    drsYieldData
}): JSX.Element => {
    const { selectedField } = React.useContext(DataStateContext);
    const [soilData, soilLoading, soilError] = useSoilTextureData(selectedField?.coordinates);

    const yearsSelectDefault = ['2022'];

    const cropSelectDefault = ['Corn'];

    const seedSelectDefault = [
        {
            label: 'Seed 1',
            value: true
        },
        {
            label: 'Seed 2',
            value: true
        }
    ];
    const [yearsSelect, setYearsSelect] = React.useState<string[]>(yearsSelectDefault);
    const [cropSelect, setCropSelect] = React.useState<string[]>(cropSelectDefault);
    const [yieldData, setYieldData] = React.useState<YeildData>({});

    const [selectedYear, setSelectedYear] = React.useState<string>(yearsSelectDefault[0]);
    const [selectedSeed, setSelectedSeed] = React.useState<SeedSelect[]>(seedSelectDefault);
    const [selectedCrop, setSelectedCrop] = React.useState<string>('');

    const [seedYieldChartData, setSeedYieldChartData] = React.useState<ChartData[]>([]);

    React.useEffect(() => {
        if (drsYieldData) {
            // TODO: add crop info to backend
            const crops = ['Corn'];
            setCropSelect(crops);
            setSelectedCrop(crops[0]);

            const years = Array.from(new Set(drsYieldData.map((data) => data.planting_date.split('-')[0])));
            years.sort();
            setYearsSelect(years);
            setSelectedYear(years[0]);

            const seeds = Array.from(
                new Set(
                    drsYieldData
                        .filter((data) => data.planting_date.split('-')[0] === years[0])
                        .map((data) => data.line)
                )
            );
            setSelectedSeed(seeds.map((seed) => ({ label: seed, value: true })));

            const yieldDataTemp: YeildData = {};
            yieldDataTemp[crops[0]] = {};
            let largestYeild = 0;

            years.forEach((year) => {
                const filteredData = drsYieldData.filter((data) => data.planting_date.split('-')[0] === year);
                const avgByLineArr: { [key: string]: number[] } = {};
                const avgByLine: { [key: string]: number } = {};
                const byLineReplicates: { [key: string]: { [key: number]: number } } = {};

                filteredData.forEach((data) => {
                    if (avgByLineArr[data.line] === undefined) {
                        avgByLineArr[data.line] = [data.crop_yield];
                    } else {
                        avgByLineArr[data.line].push(data.crop_yield);
                    }

                    if (byLineReplicates[data.line] === undefined) {
                        byLineReplicates[data.line] = {
                            [data.replicate]: data.crop_yield
                        };
                    } else {
                        byLineReplicates[data.line][data.replicate] = data.crop_yield;
                    }
                });

                Object.keys(avgByLineArr).forEach((line) => {
                    avgByLine[line] = avgByLineArr[line].reduce((a, b) => a + b, 0) / avgByLineArr[line].length;
                    avgByLine[line] = Math.ceil(avgByLine[line]);
                    if (avgByLine[line] >= largestYeild) {
                        largestYeild = avgByLine[line];
                    }
                });

                yieldDataTemp[crops[0]][year] = {
                    byLine: avgByLine,
                    heighestAvgYield: largestYeild,
                    byLineReplicates,
                    planting_date: filteredData[0].planting_date,
                    harvest_date: filteredData[0].harvest_date
                };
            });

            setYieldData(yieldDataTemp);
        }
    }, [drsYieldData]);

    React.useEffect(() => {
        if (yieldData[selectedCrop] !== undefined) {
            const seedYieldChartDataTemp: ChartData[] = [
                {
                    name: '',
                    value: 0
                }
            ];
            selectedSeed.forEach((seed) => {
                if (seed.value) {
                    seedYieldChartDataTemp.push({
                        name: seed.label,
                        value: yieldData[selectedCrop][selectedYear].byLine[seed.label]
                    });
                }
            });
            setSeedYieldChartData(seedYieldChartDataTemp);
        }
    }, [yieldData, selectedCrop, selectedYear, selectedSeed]);

    const valueFormatter = (value: number | null) => `${value} bu/A`;

    return (
        <Container disableGutters>
            <Container
                sx={{
                    backgroundColor: '#F8FAFC',
                    padding: '32px',
                    height: '70vh',
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
                        Drought-resistant Seed Yields
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
                                    const seeds = Array.from(
                                        new Set(
                                            drsYieldData
                                                ?.filter((data) => data.planting_date.split('-')[0] === e.target.value)
                                                .map((data) => data.line)
                                        )
                                    );
                                    setSelectedSeed(seeds.map((seed) => ({ label: seed, value: true })));
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
                        <FormControl>
                            <InputLabel id="crop-and-seeds-select-label">Choose a Crop and Seed</InputLabel>
                            <Select
                                labelId="crop-and-seeds-select-label"
                                id="crop-and-seeds-select"
                                value={selectedCrop}
                                label="Choose a Crop and Seed"
                                onChange={(e) => setSelectedCrop(e.target.value)}
                                sx={{
                                    width: '200px'
                                }}
                            >
                                {cropSelect.map((crop) => (
                                    <MenuItem key={crop} value={crop}>
                                        {crop}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormGroup row>
                            {selectedSeed.map((seed) => {
                                return (
                                    <FormControlLabel
                                        key={seed.label}
                                        control={
                                            <Checkbox
                                                checked={seed.value}
                                                onChange={(e) => {
                                                    const newSelectedSeed = selectedSeed.map((selected) => {
                                                        if (selected.label === seed.label) {
                                                            return {
                                                                ...selected,
                                                                value: e.target.checked
                                                            };
                                                        }
                                                        return selected;
                                                    });
                                                    setSelectedSeed(newSelectedSeed);
                                                }}
                                            />
                                        }
                                        label={seed.label}
                                    />
                                );
                            })}
                        </FormGroup>
                    </Stack>
                </Box>
                <Box
                    sx={{
                        mt: 3
                    }}
                >
                    <Stack direction="row" spacing={5}>
                        <DRSYieldCard elevation={0}>
                            <Box justifyContent="space-between" alignItems="center" display="flex" flexDirection="row">
                                <Box alignItems="center" display="flex" flexDirection="row">
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            font: 'Poppins',
                                            fontWeight: 400,
                                            fontSize: '16px',
                                            lineHeight: '25.6px',
                                            letterSpacing: '0.15px',
                                            marginRight: '5px',
                                            color: theme.palette.text.primary
                                        }}
                                    >
                                        Yield
                                    </Typography>
                                    <IconButton size="small" aria-label="info">
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            font: 'Inter',
                                            fontWeight: 400,
                                            fontSize: '12px',
                                            lineHeight: '14.52px',
                                            color: '#1D58A7'
                                        }}
                                    >
                                        Learn Replicates Yields
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                                <Stack flexWrap="wrap" direction="row" spacing={{ xs: 1, sm: 2, md: 3 }}>
                                    {yieldData[selectedCrop] !== undefined ? (
                                        selectedSeed.map((seed) => {
                                            if (seed.value) {
                                                return (
                                                    <DRSYieldDisplay key={seed.label} elevation={0}>
                                                        <Box
                                                            alignItems="center"
                                                            justifyContent="space-between"
                                                            display="flex"
                                                            flexDirection="row"
                                                        >
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
                                                                {seed.label}
                                                            </Typography>
                                                            {yieldData[selectedCrop][selectedYear].byLine[
                                                                seed.label
                                                            ] ===
                                                            yieldData[selectedCrop][selectedYear].heighestAvgYield ? (
                                                                /* eslint-disable-next-line react/jsx-indent */
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
                                                                    🏆
                                                                </Typography>
                                                            ) : null}
                                                        </Box>
                                                        <Box alignItems="baseline" display="flex" flexDirection="row">
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    font: 'Poppins',
                                                                    fontWeight: 600,
                                                                    fontSize: '36px',
                                                                    lineHeight: '54px',
                                                                    letterSpacing: '0.15px',
                                                                    color: theme.palette.text.primary
                                                                }}
                                                            >
                                                                {
                                                                    yieldData[selectedCrop][selectedYear].byLine[
                                                                        seed.label
                                                                    ]
                                                                }
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    font: 'Roboto',
                                                                    fontWeight: 400,
                                                                    fontSize: '12px',
                                                                    lineHeight: '19.92px',
                                                                    letterSpacing: '0.4px',
                                                                    color: theme.palette.text.secondary,
                                                                    ml: 1
                                                                }}
                                                            >
                                                                bu/A
                                                            </Typography>
                                                        </Box>
                                                    </DRSYieldDisplay>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <Box display="flex" justifyContent="center" justifyItems="center">
                                            <CircularProgress />
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                            <Box>
                                {seedYieldChartData.length !== 0 ? (
                                    <BarChart
                                        dataset={seedYieldChartData}
                                        yAxis={[{ scaleType: 'band', dataKey: 'name', label: 'Seed name' }]}
                                        xAxis={[{ label: 'bu/A' }]}
                                        series={[{ dataKey: 'value', valueFormatter, color: '#f28e2c' }]}
                                        grid={{ vertical: true, horizontal: true }}
                                        layout="horizontal"
                                        height={200}
                                        width={369}
                                        margin={{ left: 100 }}
                                        sx={{
                                            [`& .${chartsGridClasses.line}`]: {
                                                strokeDasharray: '5 3',
                                                strokeWidth: 2
                                            },
                                            [`.${axisClasses.left} .${axisClasses.label}`]: {
                                                // Move the y-axis label with CSS
                                                transform: 'translateX(-45px)'
                                            }
                                        }}
                                    />
                                ) : (
                                    <Box display="flex" justifyContent="center" justifyItems="center">
                                        <CircularProgress />
                                    </Box>
                                )}
                            </Box>
                        </DRSYieldCard>
                        <DRSYieldCard elevation={0}>
                            <SoilTypeTableWithErrorHandling
                                soilData={soilData}
                                isLoading={soilLoading}
                                error={soilError}
                            />
                        </DRSYieldCard>
                    </Stack>
                </Box>
            </Container>
            <SoilMoistureDepthWithATMData
                selectedYear={selectedYear}
                sectionHeader="Water Data for Drought-resistant Performances"
            />
        </Container>
    );
};

export default DroughtResistantSeedYield;
