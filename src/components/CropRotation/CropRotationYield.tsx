import React from 'react';
import { useParams } from 'react-router-dom';

import {
    Box,
    Chip,
    CircularProgress,
    Container,
    Typography,
    Stack,
    FormControl,
    Select,
    InputLabel,
    MenuItem
} from '@mui/material';

import { DatasetType } from '@mui/x-charts/models/seriesType/config';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { LinePlot, MarkPlot, LineHighlightPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { AllSeriesType } from '@mui/x-charts';

import { useCropRotationYieldData, useNitrateConcentrationData, useWeatherData } from '@app/utils/hooks';

import { DataStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';

const CropRotationYield = (): JSX.Element => {
    const { selectedField, selectedResearch } = React.useContext(DataStateContext);
    const { research_id } = useParams<{ research_id: string }>();
    const [cropRotationYieldData, cropRotationYieldDataLoading, cropRotationYieldDataError] = useCropRotationYieldData(
        selectedResearch ? selectedResearch.id : research_id
    );

    const yearsSelectDefault = ['2021'];
    const [yearsSelect, setYearsSelect] = React.useState<string[]>(yearsSelectDefault);

    const [selectedYear, setSelectedYear] = React.useState<string>(yearsSelectDefault[0]);

    const [nitrateConcentrationData, nitrateConcentrationDataLoading, nitrateConcentrationDataError] =
        useNitrateConcentrationData(selectedYear, selectedField?.id);
    const [weatherData, weatherDataLoading, weatherDataLoadError] = useWeatherData(selectedYear, selectedField?.id);

    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);
    const [series, setSeries] = React.useState<AllSeriesType[]>([]);

    React.useEffect(() => {
        if (cropRotationYieldData) {
            let years = Array.from(new Set(cropRotationYieldData.map((data) => data.planting_date.split('-')[0])));
            years.push('2023');
            setYearsSelect(years);
            setSelectedYear(years[0]);
        }
    }, [cropRotationYieldData]);

    React.useEffect(() => {
        if (nitrateConcentrationData) {
            const monthSet = new Set<number>();
            nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
                monthSet.add(data.month);
            });
            const monthSortedArray = Array.from(monthSet).sort((a, b) => a - b);
            setAvailableMonths(monthSortedArray);
            setSelectedMonth(monthSortedArray[0]);
        }
    }, [nitrateConcentrationData]);

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

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const xAxisValueFormatter = (value: string) => `${new Date(value).toLocaleDateString('en-US', options)}`;

    const [xAxisLabels, setXAxisLabels] = React.useState<string[]>([]);
    const [compositionWeatherData, setCompositionWeatherData] = React.useState<DatasetType>([]);

    React.useEffect(() => {
        if (selectedMonth !== null && weatherData && nitrateConcentrationData) {
            console.log(weatherData);
            console.log(nitrateConcentrationData);
            const xAxisLabelsTemp = new Set<string>();
            nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
                if (data.month === selectedMonth && data.year === parseInt(selectedYear)) {
                    xAxisLabelsTemp.add(data.label);
                }
            });
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
                    yAxisData[index] = data.average;
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
        <div>
            <h1>Crop Rotation Yield</h1>
            <p>Research ID: {research_id}</p>
            {cropRotationYieldDataLoading ? (
                <Box display="flex" justifyContent="center" justifyItems="center" sx={{ height: '100vh' }}>
                    <CircularProgress />
                </Box>
            ) : cropRotationYieldDataError === null ? (
                <Container disableGutters>
                    <FormControl>
                        <InputLabel id="year-select-label">Choose a Year</InputLabel>
                        <Select
                            labelId="year-select-label"
                            id="year-select"
                            value={selectedYear}
                            label="Choose a Year"
                            onChange={(e) => {
                                console.log(e.target.value);
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
                        {weatherDataLoading && nitrateConcentrationDataLoading ? (
                            <Box display="flex" justifyContent="center" justifyItems="center">
                                <CircularProgress />
                            </Box>
                        ) : weatherDataLoadError === null && nitrateConcentrationDataError === null ? (
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
                                <LinePlot />
                                <BarPlot />
                                <MarkPlot />
                                <LineHighlightPlot />
                                <ChartsTooltip trigger="axis" />
                                <ChartsAxisHighlight x="line" />
                                <ChartsXAxis />
                                <ChartsYAxis axisId="nitrate-concentration" position="right" />
                                <ChartsYAxis axisId="avg-precipitation" position="left" />
                                <ChartsLegend />
                                <ChartsGrid horizontal />
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
        </div>
    );
};

export default CropRotationYield;
