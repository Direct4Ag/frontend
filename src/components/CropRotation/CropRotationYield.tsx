import React, { useId } from 'react';

import {
    Alert,
    Box,
    Chip,
    Container,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';

import { DatasetType } from '@mui/x-charts/models/seriesType/config';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { AllSeriesType, AxisConfig } from '@mui/x-charts';

import { useNitrateConcentrationData, useWeatherData, useAvailableYears } from '@app/utils/hooks';
import SoilMoistureByDepthGraph from '@app/components/childComponents/SoilMoistureByDepthGraph';
import AirTempAndVPDPlot from '@app/components/childComponents/AirTempAndVPDPlot';
import YearsSelect from '@app/components/childComponents/YearsSelect';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';

import { DataStateContext } from '@app/store/contexts';
import { theme } from '@app/theme';

const SoilMoistureByDepthGraphWithLoading = withLoading(SoilMoistureByDepthGraph);
const SoilMoistureByDepthGraphWithErrorHandling = withErrorHandling(SoilMoistureByDepthGraphWithLoading);

const AirTempAndVPDPlotWithLoading = withLoading(AirTempAndVPDPlot);
const AirTempAndVPDPlotWithErrorHandling = withErrorHandling(AirTempAndVPDPlotWithLoading);

const YearSelectWithLoading = withLoading(YearsSelect);
const YearSelectWithErrorHandling = withErrorHandling(YearSelectWithLoading);

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

const CropRotationYield: React.FC<{ cropRotationYieldData: CropRotationYieldData[] | null }> = ({
    cropRotationYieldData
}): JSX.Element => {
    const { selectedField } = React.useContext(DataStateContext);

    const [selectedYear, setSelectedYear] = React.useState<string>('');

    const [years, yearsLoading, yearsError] = useAvailableYears(selectedField?.id);

    const [nitrateConcentrationData, nitrateConcentrationDataLoading, nitrateConcentrationDataError] =
        useNitrateConcentrationData(selectedYear, selectedField?.id);
    const [weatherData, weatherDataLoading, weatherDataLoadError] = useWeatherData(selectedYear, selectedField?.id);

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

    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(1);
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
        if (years) {
            setSelectedYear(years[0]);
        }
    }, [years]);

    React.useEffect(() => {
        if (weatherData) {
            const monthsArr = Array.from(new Set(weatherData.avg_air_temp.map((data) => data.month)));
            setAvailableMonths(monthsArr.sort((a, b) => a - b));
        }
    }, [weatherData]);

    React.useEffect(() => {
        if (cropRotationYieldData) {
            const crops = Array.from(new Set(cropRotationYieldData.map((data) => data.crop)));
            const tempDataset: CropYeildInfo[] = [];
            const tempCropInfoTable: CropInfoTable = {};
            const tempCropFertilizerInfoTable: CropFertilizerInfoTable = {};
            crops.forEach((crop) => {
                const cropData = cropRotationYieldData.filter((data) => data.crop === crop);
                const yearsArr = Array.from(new Set(cropData.map((data) => data.planting_date.split('-')[0]))).sort();
                const values = new Array<number>(yearsArr.length).fill(0);
                tempCropInfoTable[crop] = new Array(yearsArr.length).fill({});
                tempCropFertilizerInfoTable[crop] = new Array(yearsArr.length);
                cropData.forEach((data) => {
                    const index = yearsArr.indexOf(data.planting_date.split('-')[0]);
                    values[index] = data.crop_yield;
                    tempCropInfoTable[crop][index] = {
                        plantingDate: data.planting_date,
                        harvestDate: data.harvest_date,
                        seedingRate: `${data.seeding_rate} ${data.seeding_rate_unit}`,
                        totalFertilizer: `${data.total_fertilizer_applied} ${data.total_fertilizer_applied_unit}`
                    };
                    tempCropFertilizerInfoTable[crop][index] = {
                        year: yearsArr[index],
                        fertilizer: data.fertilizers.map((fertilizer) => {
                            return {
                                fertilizerApplicationDate: fertilizer.fertilizer_date,
                                fertilizerRate: `${fertilizer.fertilizer_rate} ${fertilizer.fertilizer_rate_unit}`,
                                fertilizerType: fertilizer.fertilizer_type,
                                fertilizerMethod: fertilizer.fertilizer_application_description
                            };
                        })
                    };
                });
                tempDataset.push({
                    crop,
                    cropYield: {
                        xLabels: yearsArr,
                        values
                    }
                });
            });
            setCropInfoTable(tempCropInfoTable);
            setCropFertilizerInfoTable(tempCropFertilizerInfoTable);
            setCropYieldDataset(tempDataset);
        }
    }, [cropRotationYieldData]);

    React.useEffect(() => {
        if (nitrateConcentrationData?.nitrate_concentration_data.length !== 0) {
            setNitrateDataFound(true);
        } else {
            // fallback to default months
            setNitrateDataFound(false);
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
            const xAxisLabelsTemp = new Set<string>();
            // if (nitrateConcentrationData.nitrate_concentration_data.length === 0) {

            // } else {
            //     nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
            //         if (data.month === selectedMonth && data.year === parseInt(selectedYear, 10)) {
            //             xAxisLabelsTemp.add(data.label);
            //         }
            //     });
            // }
            // JavaScript months are 0-indexed (0 = January, 11 = December)
            const date = new Date(parseInt(selectedYear, 10), selectedMonth - 1, 0).getDate(); // Get last day of the previous month (from month + 1)

            // Generate an array from 1 to the number of days in the month
            const days = Array.from({ length: date }, (_, k) => k + 1);

            days.forEach((day) => {
                xAxisLabelsTemp.add(
                    `${selectedYear}-${selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth}-${
                        day < 10 ? `0${day}` : day
                    }`
                );
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

            if (nitrateConcentrationData.nitrate_concentration_data.length !== 0) {
                // const nitrateConcLinePlotData: number[] = [];
                const yAxisData = new Array<number | null>(xAxisLabelsSortedArray.length).fill(null);
                nitrateConcentrationData.nitrate_concentration_data.forEach((data) => {
                    if (data.month === selectedMonth) {
                        const index = xAxisLabelsSortedArray.indexOf(data.label);
                        if (index !== -1) {
                            // nitrateConcLinePlotData[index] = data.average;
                            yAxisData[index] = data.average;
                        }
                    }
                });

                if (yAxisData.every((val) => val === null)) {
                    setNitrateDataFound(false);
                } else {
                    setNitrateDataFound(true);
                    seriesTemp.push({
                        type: 'line',
                        // data: nitrateConcLinePlotData,
                        data: yAxisData,
                        label: 'Nitrate Concentration',
                        valueFormatter: (value: number | null) => (value !== null ? `${value} mg/L` : 'No data'),
                        color: '#FFA500',
                        yAxisKey: 'nitrate-concentration'
                    });
                }
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

    const getWeatherYAxisData = (data: GeostreamsData[], xAxisLabelsArr: string[]) => {
        if (data && xAxisLabelsArr.length !== 0) {
            const yAxisData = new Array<number>(xAxisLabelsArr.length).fill(0);
            data.forEach((dataVal) => {
                if (dataVal.month === selectedMonth) {
                    const index = xAxisLabelsArr.indexOf(dataVal.label);
                    if (index !== -1) {
                        yAxisData[index] = dataVal.average;
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

    const rowId = useId();

    return (
        <Container>
            <Box sx={{ my: '10px' }}>
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
                    Crop Rotation
                </Typography>
            </Box>
            <Box sx={{ mt: '20px' }}>
                {cropYieldDataset.map((cropData) => {
                    return (
                        <Box key={cropData.crop}>
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
                                                    cropData.cropYield.values[0] > 1 ? 'bushels/acre' : 'bushel/acre'
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
                                                    // eslint-disable-next-line react/no-array-index-key
                                                    <TableRow key={`${rowId}-${index}`}>
                                                        {index === 0 ? (
                                                            <TableCell rowSpan={row.fertilizer.length} align="center">
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
                        </Box>
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
            <YearSelectWithErrorHandling
                error={yearsError}
                isLoading={yearsLoading}
                yearsSelect={years}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
            />
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
                <SoilMoistureByDepthGraphWithErrorHandling
                    error={weatherDataLoadError || nitrateConcentrationDataError}
                    isLoading={weatherDataLoading && nitrateConcentrationDataLoading}
                    series={series}
                    xAxisLabels={xAxisLabels}
                    valueFormatter={xAxisValueFormatter}
                    yAxis={
                        nitrateDataFound
                            ? [
                                  { id: 'nitrate-concentration', label: 'Nitrate Concentration (mg/L)' },
                                  { id: 'avg-precipitation', label: 'Precipitation (mm)' }
                              ]
                            : [{ id: 'avg-precipitation', label: 'Precipitation (mm)' }]
                    }
                />
                <AirTempAndVPDPlotWithErrorHandling
                    error={weatherDataLoadError}
                    isLoading={weatherDataLoading}
                    dataset={compositionWeatherData}
                    series={weatherDataSeries}
                    xAxisLabels={xAxisLabels}
                    valueFormatter={xAxisValueFormatter}
                />
            </Box>
        </Container>
    );
};

export default CropRotationYield;
