import React from 'react';

import {
    Box,
    Checkbox,
    Chip,
    Container,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { BarChart, BarPlot } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { chartsGridClasses } from '@mui/x-charts/ChartsGrid';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

import {
    // DataActionDispatcherContext,
    DataStateContext
} from '@app/store/contexts';

import { useSoilTextureData, useDRSYieldData, useDepthSoilMoistureData, useWeatherData } from '@app/utils/hooks';

import { theme } from '@app/theme';

interface SeedSelect {
    label: string;
    value: boolean;
}

interface ShowSoilDepthData {
    [key: string]: boolean;
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

interface LabelMap {
    [key: string]: string;
}

interface ChartData {
    [key: string]: number | string;
}

const DRSYieldCard = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    backgroundColor: 'white',
    height: '392px',
    width: '433px',
    padding: '32px',
    borderRadius: '24px'
}));

const DRSYieldDisplay = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    backgroundColor: 'white',
    height: '106px',
    width: '172.5px',
    padding: '16px 24px 16px 24px',
    borderRadius: '12px',
    border: '1px solid #1D58A71F'
}));

const DepthSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
        'color': theme.palette.primary.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main
    }
}));

const DroughtResistantSeedYield = (): JSX.Element => {
    const { selectedField, selectedResearch } = React.useContext(DataStateContext);
    // const dataActionDispatcher = React.useContext(DataActionDispatcherContext);
    const soilData = useSoilTextureData(selectedField?.coordinates);
    const drsYieldData = useDRSYieldData(selectedResearch?.id);

    const yearsSelectDefault = ['2021', '2022'];

    const cropSelectDefault = ['Crop 1', 'Crop 2'];

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

    const rowOrder = ['depth_bottom', 'claytotal_r', 'silttotal_r', 'sandtotal_r'];
    const rowNameMap: LabelMap = {
        depth_bottom: 'Depth',
        claytotal_r: 'Clay',
        silttotal_r: 'Silt',
        sandtotal_r: 'Sand'
    };

    const soilDepthData = useDepthSoilMoistureData(selectedYear, selectedField?.id);
    const weatherData = useWeatherData(selectedYear, selectedField?.id);
    const [showSoilDepthData, setShowSoilDepthData] = React.useState<ShowSoilDepthData | null>(null);
    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

    let colors = ['#FFC220', '#2ADE96', '#FF3855', '#273BE2', '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'];

    React.useEffect(() => {
        if (drsYieldData) {
            // TODO: add crop info to backend
            const crops = ['Corn'];
            setCropSelect(crops);
            setSelectedCrop(crops[0]);

            const years = Array.from(new Set(drsYieldData.map((data) => data.planting_date.split('-')[0])));
            setYearsSelect(years);
            setSelectedYear(years[0]);

            let seeds = Array.from(
                new Set(
                    drsYieldData
                        .filter((data) => data.planting_date.split('-')[0] === years[0])
                        .map((data) => data.line)
                )
            );
            setSelectedSeed(seeds.map((seed) => ({ label: seed, value: true })));

            let yieldDataTemp: YeildData = {};
            yieldDataTemp[crops[0]] = {};
            let largestYeild = 0;

            years.forEach((year) => {
                let filteredData = drsYieldData.filter((data) => data.planting_date.split('-')[0] === year);
                let avgByLineArr: { [key: string]: number[] } = {};
                let avgByLine: { [key: string]: number } = {};
                let byLineReplicates: { [key: string]: { [key: number]: number } } = {};

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

                for (const line in avgByLineArr) {
                    avgByLine[line] = avgByLineArr[line].reduce((a, b) => a + b, 0) / avgByLineArr[line].length;
                    avgByLine[line] = Math.ceil(avgByLine[line]);
                    if (avgByLine[line] >= largestYeild) {
                        largestYeild = avgByLine[line];
                    }
                }

                yieldDataTemp[crops[0]][year] = {
                    byLine: avgByLine,
                    heighestAvgYield: largestYeild,
                    byLineReplicates: byLineReplicates,
                    planting_date: filteredData[0].planting_date,
                    harvest_date: filteredData[0].harvest_date
                };
            });

            setYieldData(yieldDataTemp);
        }
    }, [drsYieldData]);

    React.useEffect(() => {
        if (yieldData[selectedCrop] !== undefined) {
            let seedYieldChartDataTemp: ChartData[] = [
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

    React.useEffect(() => {
        if (soilDepthData) {
            let monthSet = new Set<number>();
            let soilDepthDataTemp: ShowSoilDepthData = {};
            Object.keys(soilDepthData).forEach((depth) => {
                soilDepthDataTemp[depth] = true;
                soilDepthData[depth].data.forEach((data) => {
                    monthSet.add(data.month);
                });
            });
            let monthSortedArray = Array.from(monthSet).sort((a, b) => a - b);
            setAvailableMonths(monthSortedArray);
            setSelectedMonth(monthSortedArray[0]);
            setShowSoilDepthData(soilDepthDataTemp);
        }
    }, [soilDepthData]);

    const valueFormatter = (value: number | null) => `${value} lb/acre`;
    const options = { day: 'numeric' };
    const soilMoistureValueFormatter = (value: string | number, axis: string) =>
        axis === 'y'
            ? `${Math.round((value as number) * 1000) / 1000} %`
            : `Day ${new Date(value).toLocaleDateString('en-US', options as any)}`;

    const getMonthName = (monthNumber: number): string => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        // Adjust for zero-based index (subtract 1 from the month number)
        return months[monthNumber - 1];
    };

    const getXAxisLabels = (): string[] => {
        if (soilDepthData && showSoilDepthData) {
            let xAxisLabels = new Set<string>();
            Object.keys(soilDepthData).forEach((depth) => {
                if (showSoilDepthData[depth]) {
                    soilDepthData[depth].data.forEach((data) => {
                        if (data.month === selectedMonth && data.year === parseInt(selectedYear)) {
                            xAxisLabels.add(data.label);
                        }
                    });
                }
            });
            let xAxisLabelsSortedArray = Array.from(xAxisLabels).sort();
            return xAxisLabelsSortedArray;
        }
        return [];
    };

    const getYAxisData = (depth: string, xAxisLabels: string[]): number[] => {
        if (soilDepthData && showSoilDepthData && xAxisLabels.length !== 0) {
            let yAxisData = new Array<number>(getXAxisLabels().length).fill(0);
            soilDepthData[depth].data.forEach((data) => {
                if (data.month === selectedMonth) {
                    let index = xAxisLabels.indexOf(data.label);
                    yAxisData[index] = data.average;
                }
            });
            return yAxisData;
        }
        return [];
    };

    const getLineSeries = () => {
        let series: any = [];
        if (soilDepthData && showSoilDepthData) {
            Object.keys(showSoilDepthData)
                .sort((a, b) => parseInt(a.replace('cm', '')) - parseInt(b.replace('cm', '')))
                .forEach((depth, idx) => {
                    if (showSoilDepthData[depth]) {
                        let xLabels = getXAxisLabels();
                        let data = getYAxisData(depth, xLabels);
                        series.push({
                            type: 'line',
                            data: data,
                            label: depth,
                            valueFormatter: (value: number) => soilMoistureValueFormatter(value, 'y'),
                            color: colors[idx % colors.length]
                        });
                    }
                });
        }
        return series;
    };

    const getWeatherYAxisData = (data: GeostreamsData[], xAxisLabels: string[]) => {
        if (data && xAxisLabels.length !== 0) {
            let yAxisData = new Array<number>(xAxisLabels.length).fill(0);
            data.forEach((data) => {
                if (data.month === selectedMonth) {
                    let index = xAxisLabels.indexOf(data.label);
                    yAxisData[index] = data.average;
                }
            });
            return yAxisData;
        }
        return [];
    };

    const getCompositionWeatherData = () => {
        let dataset: any = [];
        if (weatherData) {
            let xAxisLabels = getXAxisLabels();
            let avgAirTempData = getWeatherYAxisData(weatherData.avg_air_temp, xAxisLabels);
            let avgPrecipitationData = getWeatherYAxisData(weatherData.precipitation, xAxisLabels);
            xAxisLabels.forEach((label, idx) => {
                dataset.push({
                    avgAirTemp: avgAirTempData[idx],
                    avgPrecipitation: avgPrecipitationData[idx],
                    day: label
                });
            });
        }
        return dataset;
    };
    let weatherDataSeries: any = [
        {
            type: 'line',
            dataKey: 'avgAirTemp',
            color: '#fe5f55',
            label: 'Average Air Temp',
            yAxisKey: 'avg-air-temp',
            valueFormatter: (value: number) => `${value} °F`
        },
        {
            type: 'bar',
            dataKey: 'avgPrecipitation',
            color: '#28D0DE',
            label: 'Precipitation',
            yAxisKey: 'avg-precipitation',
            valueFormatter: (value: number) => `${value} mm`
        }
    ];

    const getVPDData = () => {
        let dataset: any = [];
        if (weatherData) {
            let xAxisLabels = getXAxisLabels();
            let avgVpdData = getWeatherYAxisData(weatherData.avg_vpd, xAxisLabels);
            xAxisLabels.forEach((label, idx) => {
                dataset.push({
                    avgVpd: avgVpdData[idx],
                    day: label
                });
            });
            return dataset;
        }
        return [];
    };
    let vpdDataSeries: any = [
        {
            type: 'line',
            dataKey: 'avgVpd',
            color: '#76b7b2',
            label: 'Average Vapor Pressure Deficit',
            yAxisKey: 'avg-vpd',
            valueFormatter: (value: number) => `${value} kPa`
        }
    ];

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
                                    let seeds = Array.from(
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
                                    <MenuItem value={year}>Year {year}</MenuItem>
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
                                    <MenuItem value={crop}>{crop}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormGroup row>
                            {selectedSeed.map((seed) => {
                                return (
                                    <FormControlLabel
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
                                    {yieldData[selectedCrop] !== undefined
                                        ? selectedSeed.map((seed) => {
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
                                                                  lb/acre
                                                              </Typography>
                                                          </Box>
                                                      </DRSYieldDisplay>
                                                  );
                                              }
                                              return null;
                                          })
                                        : null}
                                </Stack>
                            </Box>
                            <Box>
                                <BarChart
                                    dataset={seedYieldChartData}
                                    yAxis={[{ scaleType: 'band', dataKey: 'name', label: 'Seed name' }]}
                                    xAxis={[{ label: 'lb/acre' }]}
                                    series={[{ dataKey: 'value', valueFormatter, color: '#f28e2c' }]}
                                    grid={{ vertical: true, horizontal: true }}
                                    layout="horizontal"
                                    height={200}
                                    width={369}
                                    margin={{ left: 100 }}
                                    sx={{
                                        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3', strokeWidth: 2 },
                                        [`.${axisClasses.left} .${axisClasses.label}`]: {
                                            // Move the y-axis label with CSS
                                            transform: 'translateX(-45px)'
                                        }
                                    }}
                                />
                            </Box>
                        </DRSYieldCard>
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
                                        Soil Type
                                    </Typography>
                                    <IconButton size="small" aria-label="info">
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ mb: '17.5px' }}>
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
                                    {soilData ? soilData[0].taxgrtgroup : 'Unknown'}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box
                                sx={{ mt: '17.5px' }}
                                justifyContent="space-between"
                                alignItems="center"
                                display="flex"
                                flexDirection="row"
                            >
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
                                        Soil Texture
                                    </Typography>
                                    <IconButton size="small" aria-label="info">
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ mb: '10px' }}>
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
                                    {soilData ? soilData[0].taxpartsize : 'Unknown'}
                                </Typography>
                            </Box>
                            <Divider />
                            <TableContainer>
                                <Table size="small" aria-label="Soil Texture Info Table">
                                    <TableBody>
                                        {soilData ? (
                                            rowOrder.map((row) => {
                                                return (
                                                    <TableRow key={row}>
                                                        <TableCell>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    font: 'Roboto',
                                                                    fontWeight: 500,
                                                                    fontSize: '12px',
                                                                    lineHeight: '20px',
                                                                    letterSpacing: '0.14px',
                                                                    color: theme.palette.text.primary,
                                                                    textTransform: 'capitalize'
                                                                }}
                                                            >
                                                                {rowNameMap[row]}
                                                            </Typography>
                                                        </TableCell>
                                                        {soilData.map((data) => {
                                                            return (
                                                                <TableCell>
                                                                    <Typography
                                                                        variant="caption"
                                                                        sx={{
                                                                            font: 'Roboto',
                                                                            fontWeight: 400,
                                                                            fontSize: '12px',
                                                                            lineHeight: '19.92px',
                                                                            letterSpacing: '0.4px',
                                                                            color: theme.palette.text.primary
                                                                        }}
                                                                    >
                                                                        {Math.ceil(
                                                                            parseFloat(data[row] as string) / 2.54
                                                                        )}{' '}
                                                                        {row === 'depth_bottom' ? 'inches' : '%'}
                                                                    </Typography>
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
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
                                                No data available
                                            </Typography>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </DRSYieldCard>
                    </Stack>
                </Box>
            </Container>
            <Container>
                <Box sx={{ marginTop: '40px', marginBottom: '30px' }}>
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
                        Water Data for Drought-resistant Performances
                    </Typography>
                </Box>
                <Box>
                    <Box sx={{ marginBottom: '30px' }}>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                font: 'Roboto',
                                fontWeight: 500,
                                fontSize: '14px',
                                lineHeight: '24px',
                                letterSpacing: '0.1px',
                                color: theme.palette.text.primary,
                                marginBottom: '10px'
                            }}
                        >
                            Choose a Month
                        </Typography>
                        <Stack direction="row" flexWrap="wrap" useFlexGap spacing={2}>
                            {availableMonths.length !== 0
                                ? availableMonths.map((monthNum) => {
                                      return (
                                          <Chip
                                              key={monthNum}
                                              label={getMonthName(monthNum)}
                                              sx={{
                                                  'backgroundColor':
                                                      selectedMonth === monthNum
                                                          ? theme.palette.default.btnLightBackground
                                                          : theme.palette.primary.light,
                                                  'color': theme.palette.default.chipTextColor,
                                                  '&&:hover': {
                                                      backgroundColor: theme.palette.default.btnLightBackground
                                                  },
                                                  '&&:focus': {
                                                      backgroundColor: theme.palette.default.btnLightBackground
                                                  }
                                              }}
                                              variant="filled"
                                              onClick={() => {
                                                  setSelectedMonth(monthNum);
                                              }}
                                          />
                                      );
                                  })
                                : null}
                        </Stack>
                    </Box>
                </Box>
                <Box>
                    <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                        <ResponsiveChartContainer
                            height={400}
                            dataset={getVPDData()}
                            series={vpdDataSeries}
                            xAxis={[
                                {
                                    scaleType: 'point',
                                    data: getXAxisLabels(),
                                    valueFormatter: (value: string) => soilMoistureValueFormatter(value, 'x'),
                                    label: 'Day'
                                }
                            ]}
                            yAxis={[{ id: 'avg-vpd', label: 'Vapor Pressure Deficit (kPa)' }]}
                        >
                            <ChartsGrid horizontal />
                            <LinePlot />
                            <MarkPlot />
                            <LineHighlightPlot />
                            <ChartsTooltip trigger="axis" />
                            <ChartsAxisHighlight x="line" />
                            <ChartsXAxis />
                            <ChartsYAxis axisId="avg-vpd" position="left" />
                            <ChartsLegend />
                        </ResponsiveChartContainer>
                    </Box>
                    <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                        <ResponsiveChartContainer
                            height={400}
                            dataset={getCompositionWeatherData()}
                            series={weatherDataSeries}
                            xAxis={[
                                {
                                    scaleType: 'band',
                                    data: getXAxisLabels(),
                                    valueFormatter: (value: string) => soilMoistureValueFormatter(value, 'x'),
                                    label: 'Day'
                                }
                            ]}
                            yAxis={[
                                { id: 'avg-air-temp', label: 'Temperature (°F)' },
                                { id: 'avg-precipitation', label: 'Precipitation (mm)' }
                            ]}
                        >
                            <ChartsGrid horizontal />
                            <BarPlot />
                            <LinePlot />
                            <MarkPlot />
                            <LineHighlightPlot />
                            <ChartsTooltip trigger="axis" />
                            <ChartsAxisHighlight x="line" />
                            <ChartsXAxis />
                            <ChartsYAxis axisId="avg-air-temp" position="right" />
                            <ChartsYAxis axisId="avg-precipitation" position="left" />
                            <ChartsLegend />
                        </ResponsiveChartContainer>
                    </Box>
                    <Box alignItems="center" justifyContent="space-between" display="flex" flexDirection="row">
                        <Box>
                            <Typography
                                variant="caption"
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
                                Soil Moisture
                            </Typography>
                        </Box>
                        <Box alignItems="center" justifyContent="space-between" display="flex" flexDirection="row">
                            {showSoilDepthData !== null
                                ? Object.keys(showSoilDepthData)
                                      .sort((a, b) => parseInt(a.replace('cm', '')) - parseInt(b.replace('cm', '')))
                                      .map((depthValue) => {
                                          return (
                                              <FormControlLabel
                                                  control={
                                                      <DepthSwitch
                                                          checked={showSoilDepthData[depthValue]}
                                                          onChange={(e) => {
                                                              setShowSoilDepthData({
                                                                  ...showSoilDepthData,
                                                                  [depthValue]: e.target.checked
                                                              });
                                                          }}
                                                      />
                                                  }
                                                  label={`Depth ${depthValue}`}
                                              />
                                          );
                                      })
                                : null}
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                        <ResponsiveChartContainer
                            height={400}
                            series={getLineSeries()}
                            xAxis={[
                                {
                                    scaleType: 'point',
                                    data: getXAxisLabels(),
                                    valueFormatter: (value: string) => soilMoistureValueFormatter(value, 'x'),
                                    label: 'Day'
                                }
                            ]}
                            yAxis={[{ label: 'Soil Moisture (%)' }]}
                        >
                            <LinePlot />
                            <MarkPlot />
                            <LineHighlightPlot />
                            <ChartsTooltip trigger="axis" />
                            <ChartsAxisHighlight x="line" />
                            <ChartsXAxis />
                            <ChartsYAxis />
                            <ChartsLegend />
                            <ChartsGrid horizontal />
                        </ResponsiveChartContainer>
                    </Box>
                </Box>
            </Container>
        </Container>
    );
};

export default DroughtResistantSeedYield;
