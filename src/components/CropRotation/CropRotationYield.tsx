import React from 'react';
import { useParams } from 'react-router-dom';

import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    Container,
    Typography,
    Stack,
    FormControl,
    Select,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    MenuItem
} from '@mui/material';

import { DatasetType } from '@mui/x-charts/models/seriesType/config';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { AllSeriesType, AxisConfig } from '@mui/x-charts';

import { useCropRotationYieldData, useNitrateConcentrationData, useWeatherData } from '@app/utils/hooks';

import { DataStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';

interface CropYeildInfo {
    crop: string;
    cropYield: {
        xLabels: string[];
        values: number[];
    };
}

interface CropInfoTable {
    [key: string]: {
        plantingDate: string;
        harvestDate: string;
        seedingRate: string;
        totalFertilizer: string;
    }[];
}

interface CropFertilizerInfoTable {
    [key: string]: {
        year: string;
        fertilizer: {
            fertilizerApplicationDate: string;
            fertilizerRate: string;
            fertilizerType: string;
            fertilizerMethod: string;
        }[];
    }[];
}

const CropRotationYield = (): JSX.Element => {
    const { selectedField, selectedResearch } = React.useContext(DataStateContext);
    const { research_id } = useParams<{ research_id: string }>();
    const [cropRotationYieldData, cropRotationYieldDataLoading, cropRotationYieldDataError] = useCropRotationYieldData(
        selectedResearch ? selectedResearch.id : research_id
    );

    const [yearsSelect, setYearsSelect] = React.useState<string[]>(['']);

    const [selectedYear, setSelectedYear] = React.useState<string>('');

    const [nitrateConcentrationData, nitrateConcentrationDataLoading, nitrateConcentrationDataError] =
        useNitrateConcentrationData(selectedYear, selectedField?.id);
    const [weatherData, weatherDataLoading, weatherDataLoadError] = useWeatherData(selectedYear, selectedField?.id);

    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);
    const [series, setSeries] = React.useState<AllSeriesType[]>([]);
    const [nitrateDataFound, setNitrateDataFound] = React.useState<boolean>(false);

    const [cropYieldDataset, setCropYieldDataset] = React.useState<CropYeildInfo[]>([]);
    const [cropInfoTable, setCropInfoTable] = React.useState<CropInfoTable>({});
    const [cropFertilizerInfoTable, setCropFertilizerInfoTable] = React.useState<CropFertilizerInfoTable>({});

    const cropInfoTableHeaders = ['Planting Date', 'Harvest Date', 'Seeding Rate', 'Total Fertilizer'];
    const cropFertilizerInfoTableHeaders = [
        'Year',
        'Fertilizer Application Date',
        'Fertilizer Rate',
        'Fertilizer Type',
        'Fertilizer Method'
    ];

    React.useEffect(() => {
        if (cropRotationYieldData) {
            let years = Array.from(new Set(cropRotationYieldData.map((data) => data.planting_date.split('-')[0])));
            // TODO: remove this when everything is fixed
            years.push('2023');
            console.log(cropRotationYieldData);

            let crops = Array.from(new Set(cropRotationYieldData.map((data) => data.crop)));
            let tempDataset: CropYeildInfo[] = [];
            let tempCropInfoTable: CropInfoTable = {};
            let tempCropFertilizerInfoTable: CropFertilizerInfoTable = {};
            crops.forEach((crop) => {
                let cropData = cropRotationYieldData.filter((data) => data.crop === crop);
                let years = Array.from(new Set(cropData.map((data) => data.planting_date.split('-')[0]))).sort();
                let values = new Array<number>(years.length).fill(0);
                tempCropInfoTable[crop] = new Array(years.length).fill({});
                tempCropFertilizerInfoTable[crop] = new Array(years.length);
                console.log(tempCropFertilizerInfoTable);
                cropData.forEach((data) => {
                    const index = years.indexOf(data.planting_date.split('-')[0]);
                    values[index] = data.crop_yield;
                    tempCropInfoTable[crop][index] = {
                        plantingDate: data.planting_date,
                        harvestDate: data.harvest_date,
                        seedingRate: `${data.seeding_rate} ${data.seeding_rate_unit}`,
                        totalFertilizer: `${data.total_fertilizer_applied} ${data.total_fertilizer_applied_unit}`
                    };
                    console.log(index, years[index]);
                    tempCropFertilizerInfoTable[crop][index] = {
                        year: years[index],
                        fertilizer: data.fertilizers.map((fertilizer) => {
                            return {
                                fertilizerApplicationDate: fertilizer.fertilizer_date,
                                fertilizerRate: `${fertilizer.fertilizer_rate} ${fertilizer.fertilizer_rate_unit}`,
                                fertilizerType: fertilizer.fertilizer_type,
                                fertilizerMethod: fertilizer.fertilizer_application_description
                            };
                        })
                    };
                    console.log(tempCropFertilizerInfoTable);
                });
                tempDataset.push({
                    crop: crop,
                    cropYield: {
                        xLabels: years,
                        values: values
                    }
                });
            });
            console.log(tempCropFertilizerInfoTable);
            setCropInfoTable(tempCropInfoTable);
            setCropFertilizerInfoTable(tempCropFertilizerInfoTable);
            setCropYieldDataset(tempDataset);
            setYearsSelect(years);
            setSelectedYear(years[0]);
        }
    }, [cropRotationYieldData]);

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

    React.useEffect(() => {
        if (nitrateConcentrationData?.nitrate_concentration_data.length !== 0) {
            const monthSet = new Set<number>();
            nitrateConcentrationData?.nitrate_concentration_data.forEach((data) => {
                monthSet.add(data.month);
            });
            const monthSortedArray = Array.from(monthSet).sort((a, b) => a - b);
            setAvailableMonths(monthSortedArray);
            setSelectedMonth(monthSortedArray[0]);
            setNitrateDataFound(true);
        } else {
            //fallback to default months
            setNitrateDataFound(false);
            setAvailableMonths(months.map((_, idx) => idx + 1));
            setSelectedMonth(1);
        }
    }, [nitrateConcentrationData]);

    const getMonthName = (monthNumber: number): string => {
        // Adjust for zero-based index (subtract 1 from the month number)
        return months[monthNumber - 1];
    };

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const xAxisValueFormatter = (value: string) => `${new Date(value).toLocaleDateString('en-US', options)}`;

    const [xAxisLabels, setXAxisLabels] = React.useState<string[]>([]);
    const [compositionWeatherData, setCompositionWeatherData] = React.useState<DatasetType>([]);

    React.useEffect(() => {
        if (selectedMonth !== null && selectedYear !== null && weatherData && nitrateConcentrationData) {
            let xAxisLabelsTemp = new Set<string>();
            if (nitrateConcentrationData.nitrate_concentration_data.length === 0) {
                // JavaScript months are 0-indexed (0 = January, 11 = December)
                let date = new Date(parseInt(selectedYear), selectedMonth - 1, 0).getDate(); // Get last day of the previous month (from month + 1)

                // Generate an array from 1 to the number of days in the month
                let days = Array.from({ length: date }, (_, k) => k + 1);

                days.forEach((day) => {
                    xAxisLabelsTemp.add(
                        `${selectedYear}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}-${
                            day < 10 ? `0${day}` : day
                        }`
                    );
                });
            } else {
                nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
                    if (data.month === selectedMonth && data.year === parseInt(selectedYear)) {
                        xAxisLabelsTemp.add(data.label);
                    }
                });
            }
            const xAxisLabelsSortedArray = Array.from(xAxisLabelsTemp).sort();
            // set xAxis State value
            setXAxisLabels(xAxisLabelsSortedArray);

            const seriesTemp: AllSeriesType[] = [];
            const avgPrecipitationData = getWeatherYAxisData(weatherData.precipitation, xAxisLabelsSortedArray);
            seriesTemp.push({
                type: 'bar',
                data: avgPrecipitationData,
                label: 'Precipitation',
                valueFormatter: (value: number | null) => `${value} mm`,
                color: '#28D0DE',
                yAxisKey: 'avg-precipitation'
            });

            if (nitrateConcentrationData.nitrate_concentration_data.length !== 0) {
                let nitrateConcLinePlotData: number[] = [];
                nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
                    if (data.month === selectedMonth) {
                        const index = xAxisLabelsSortedArray.indexOf(data.label);
                        nitrateConcLinePlotData[index] = data.average;
                    }
                });

                seriesTemp.push({
                    type: 'line',
                    data: nitrateConcLinePlotData,
                    label: 'Nitrate Concentration',
                    valueFormatter: (value: number | null) => `${value} mg/L`,
                    color: '#FFA500',
                    yAxisKey: 'nitrate-concentration'
                });
            }

            setSeries(seriesTemp);

            const dataset: DatasetType = [];
            const avgAirTempData = getWeatherYAxisData(weatherData.avg_air_temp, xAxisLabelsSortedArray);
            const avgVpdData = getWeatherYAxisData(weatherData.avg_vpd, xAxisLabelsSortedArray);
            xAxisLabelsSortedArray.forEach((label, idx) => {
                dataset.push({
                    avgAirTemp: avgAirTempData[idx],
                    avgVpd: avgVpdData[idx],
                    day: label
                });
            });
            setCompositionWeatherData(dataset);
        }
    }, [selectedYear, selectedMonth, weatherData, nitrateConcentrationData]);

    const getWeatherYAxisData = (data: GeostreamsData[], xAxisLabels: string[]) => {
        if (data && xAxisLabels.length !== 0) {
            const yAxisData = new Array<number>(xAxisLabels.length).fill(0);
            data.forEach((data) => {
                if (data.month === selectedMonth) {
                    const index = xAxisLabels.indexOf(data.label);
                    if (index !== -1) {
                        yAxisData[index] = data.average;
                    }
                }
            });
            return yAxisData;
        }
        return [];
    };

    const weatherDataSeries: AllSeriesType[] = [
        {
            type: 'line',
            dataKey: 'avgAirTemp',
            color: '#fe5f55',
            label: 'Average Air Temp',
            yAxisKey: 'avg-air-temp',
            valueFormatter: (value: number | null) => `${value} °F`
        },
        {
            type: 'line',
            dataKey: 'avgVpd',
            color: '#76b7b2',
            label: 'Average Vapor Pressure Deficit',
            yAxisKey: 'avg-vpd',
            valueFormatter: (value: number | null) => `${value} kPa`
        }
    ];

    return (
        <Box sx={{ marginLeft: '20px' }}>
            <Box sx={{ my: '10px' }}>
                <Typography
                    variant="h6"
                    sx={{
                        font: 'Poppins',
                        fontWeight: 700,
                        fontSize: '20px',
                        lineHeight: '32px',
                        letterSpacing: '0.15px',
                        color: theme.palette.text.primary
                    }}
                >
                    Crop Rotation
                </Typography>
            </Box>
            {cropRotationYieldDataLoading ? (
                <Box display="flex" justifyContent="center" justifyItems="center" sx={{ height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : cropRotationYieldDataError === null ? (
                <Container disableGutters>
                    <Box sx={{ mt: '20px' }}>
                        {cropYieldDataset.map((cropData) => {
                            return (
                                <>
                                    <Box sx={{ mb: '20px' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                font: 'Poppins',
                                                fontWeight: 700,
                                                fontSize: '20px',
                                                lineHeight: '32px',
                                                letterSpacing: '0.15px',
                                                color: theme.palette.text.primary
                                            }}
                                        >
                                            {cropData.crop} Yield
                                        </Typography>
                                        <ResponsiveChartContainer
                                            height={380}
                                            series={[
                                                {
                                                    type: 'bar',
                                                    data: cropData.cropYield.values,
                                                    label: 'Crop Yield',
                                                    valueFormatter: (value: number | null) =>
                                                        `${value} ${
                                                            cropData.cropYield.values[0] > 1
                                                                ? 'bushels/acre'
                                                                : 'bushel/acre'
                                                        }`,
                                                    color: '#FF5F05'
                                                }
                                            ]}
                                            xAxis={[
                                                {
                                                    scaleType: 'band',
                                                    data: cropData.cropYield.xLabels,
                                                    // valueFormatter: xAxisValueFormatter,
                                                    label: 'Year',
                                                    categoryGapRatio: 0.7
                                                } as AxisConfig<'band'>
                                            ]}
                                            yAxis={[{ id: 'crop-yield', label: 'Yield bushels/acre' }]}
                                            sx={{
                                                [`.${axisClasses.left} .${axisClasses.label}`]: {
                                                    // Move the y-axis label with CSS
                                                    transform: 'translateX(-6px)'
                                                }
                                            }}
                                        >
                                            <BarPlot />
                                            <MarkPlot />
                                            <ChartsTooltip trigger="axis" />
                                            <ChartsAxisHighlight x="line" />
                                            <ChartsXAxis categoryGapRatio={0.7} />
                                            <ChartsYAxis axisId="crop-yield" position="left" />
                                            <ChartsLegend />
                                            <ChartsGrid horizontal />
                                        </ResponsiveChartContainer>
                                    </Box>
                                    <Box sx={{ mb: '20px', padding: '24px' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                font: 'Poppins',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '28px',
                                                letterSpacing: '0.15px',
                                                color: theme.palette.text.primary,
                                                mb: '10px'
                                            }}
                                        >
                                            Crop Information
                                        </Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="crop info table">
                                                <TableHead>
                                                    <TableRow>
                                                        {cropInfoTableHeaders.map((header) => (
                                                            <TableCell key={header} align="center">
                                                                {header}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cropInfoTable[cropData.crop].map((row) => (
                                                        <TableRow key={row.plantingDate}>
                                                            <TableCell align="center">{row.plantingDate}</TableCell>
                                                            <TableCell align="center">{row.harvestDate}</TableCell>
                                                            <TableCell align="center">{row.seedingRate}</TableCell>
                                                            <TableCell align="center">{row.totalFertilizer}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                    <Box sx={{ mb: '20px', padding: '24px' }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                font: 'Poppins',
                                                fontWeight: 500,
                                                fontSize: '16px',
                                                lineHeight: '28px',
                                                letterSpacing: '0.15px',
                                                color: theme.palette.text.primary,
                                                mb: '10px'
                                            }}
                                        >
                                            Crop Fertilizer Information
                                        </Typography>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 650 }} aria-label="crop fertilizer info table">
                                                <TableHead>
                                                    <TableRow>
                                                        {cropFertilizerInfoTableHeaders.map((header) => (
                                                            <TableCell key={header} align="center">
                                                                {header}
                                                            </TableCell>
                                                        ))}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {cropFertilizerInfoTable[cropData.crop].map((row) => {
                                                        return row.fertilizer.map((fertilizer, index) => (
                                                            <TableRow key={row.year}>
                                                                {index === 0 ? (
                                                                    <TableCell
                                                                        rowSpan={row.fertilizer.length}
                                                                        align="center"
                                                                    >
                                                                        {row.year}
                                                                    </TableCell>
                                                                ) : null}
                                                                <TableCell align="center">
                                                                    {fertilizer.fertilizerApplicationDate}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {fertilizer.fertilizerRate}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {fertilizer.fertilizerType}
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    {fertilizer.fertilizerMethod}
                                                                </TableCell>
                                                            </TableRow>
                                                        ));
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </>
                            );
                        })}
                    </Box>
                    <Box sx={{ my: '40px' }}>
                        <Typography
                            variant="h6"
                            sx={{
                                font: 'Poppins',
                                fontWeight: 700,
                                fontSize: '20px',
                                lineHeight: '32px',
                                letterSpacing: '0.15px',
                                color: theme.palette.text.primary
                            }}
                        >
                            Nitrogen Loss
                        </Typography>
                    </Box>
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
                                <MenuItem value={year}>Year {year}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ marginTop: '20px' }}>
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
                                {availableMonths.length !== 0 ? (
                                    availableMonths.map((monthNum) => {
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
                                ) : (
                                    <Box display="flex" justifyContent="center" justifyItems="center">
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
                                            No Months Available
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                    <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                        {!nitrateDataFound ? (
                            <Box sx={{ my: '10px' }}>
                                <Alert severity="info">
                                    No Nitrate Concentration data found for the selected year and month.
                                </Alert>
                            </Box>
                        ) : null}
                        {weatherDataLoading && nitrateConcentrationDataLoading ? (
                            <Box display="flex" justifyContent="center" justifyItems="center">
                                <CircularProgress />
                            </Box>
                        ) : weatherDataLoadError === null && nitrateConcentrationDataError === null ? (
                            nitrateDataFound ? (
                                <ResponsiveChartContainer
                                    height={380}
                                    series={series}
                                    xAxis={[
                                        {
                                            scaleType: 'band',
                                            data: xAxisLabels,
                                            valueFormatter: xAxisValueFormatter,
                                            label: 'Date'
                                        }
                                    ]}
                                    yAxis={[
                                        { id: 'nitrate-concentration', label: 'Nitrate Concentration (mg/L)' },
                                        { id: 'avg-precipitation', label: 'Precipitation (mm)' }
                                    ]}
                                >
                                    <BarPlot />
                                    <MarkPlot />
                                    <ChartsTooltip trigger="axis" />
                                    <ChartsAxisHighlight x="line" />
                                    <ChartsXAxis />
                                    <ChartsYAxis axisId="nitrate-concentration" position="right" />
                                    <LinePlot />
                                    <LineHighlightPlot />
                                    <ChartsYAxis axisId="avg-precipitation" position="left" />
                                    <ChartsLegend />
                                    <ChartsGrid horizontal />
                                </ResponsiveChartContainer>
                            ) : (
                                <ResponsiveChartContainer
                                    height={380}
                                    series={series}
                                    xAxis={[
                                        {
                                            scaleType: 'band',
                                            data: xAxisLabels,
                                            valueFormatter: xAxisValueFormatter,
                                            label: 'Date'
                                        }
                                    ]}
                                    yAxis={[{ id: 'avg-precipitation', label: 'Precipitation (mm)' }]}
                                >
                                    <BarPlot />
                                    <MarkPlot />
                                    <ChartsTooltip trigger="axis" />
                                    <ChartsAxisHighlight x="line" />
                                    <ChartsXAxis />
                                    <ChartsYAxis axisId="avg-precipitation" position="left" />
                                    <ChartsLegend />
                                    <ChartsGrid horizontal />
                                </ResponsiveChartContainer>
                            )
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
                                {weatherDataLoadError === null ? nitrateConcentrationDataError : weatherDataLoadError}
                            </Typography>
                        )}
                        {weatherDataLoading ? (
                            <Box display="flex" justifyContent="center" justifyItems="center">
                                <CircularProgress />
                            </Box>
                        ) : weatherDataLoadError === null ? (
                            <ResponsiveChartContainer
                                height={380}
                                dataset={compositionWeatherData}
                                series={weatherDataSeries}
                                xAxis={[
                                    {
                                        scaleType: 'band',
                                        data: xAxisLabels,
                                        valueFormatter: xAxisValueFormatter,
                                        label: 'Date'
                                    }
                                ]}
                                yAxis={[
                                    { id: 'avg-air-temp', label: 'Temperature (°F)' },
                                    { id: 'avg-vpd', label: 'Vapor Pressure Deficit (kPa)' }
                                ]}
                            >
                                <ChartsGrid horizontal />
                                <LinePlot />
                                <MarkPlot />
                                <LineHighlightPlot />
                                <ChartsTooltip trigger="axis" />
                                <ChartsAxisHighlight x="line" />
                                <ChartsXAxis />
                                <ChartsYAxis axisId="avg-air-temp" position="right" />
                                <ChartsYAxis axisId="avg-vpd" position="left" />
                                <ChartsLegend />
                            </ResponsiveChartContainer>
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
                                {weatherDataLoadError}
                            </Typography>
                        )}
                    </Box>
                </Container>
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
                    {cropRotationYieldDataError}
                </Typography>
            )}
        </Box>
    );
};

export default CropRotationYield;
