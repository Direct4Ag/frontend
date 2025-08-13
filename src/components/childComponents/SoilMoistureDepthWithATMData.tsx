import React from 'react';

import { Alert, Box, Chip, Container, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { alpha, styled } from '@mui/material/styles';
import { AllSeriesType } from '@mui/x-charts';
import { DatasetType } from '@mui/x-charts/models/seriesType/config';

import SoilMoistureByDepthGraph from '@app/components/childComponents/SoilMoistureByDepthGraph';
import AirTempAndVPDPlot from '@app/components/childComponents/AirTempAndVPDPlot';
import { DataStateContext } from '@app/store/contexts';
import { useCombinedSensorData } from '@app/utils/hooks';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import { theme } from '@app/theme';

interface ShowSoilDepthData {
    [key: string]: boolean;
}

const colors = ['#FFC220', '#2ADE96', '#FF3855', '#273BE2', '#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'];

const DepthSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
        'color': theme.palette.primary.main,
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.hoverOpacity)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main
    }
});

const SoilMoistureDepthWithATMDataComponent: React.FC<{
    depthSoilMoistureData: DepthSoilMoistureDataWithYear | null;
    weatherData: WeatherData | null;
}> = ({ depthSoilMoistureData, weatherData }) => {
    const [showSoilDepthData, setShowSoilDepthData] = React.useState<ShowSoilDepthData | null>(null);
    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (depthSoilMoistureData !== null) {
            const monthSet = new Set<number>();
            const soilDepthDataTemp: ShowSoilDepthData = {};
            Object.keys(depthSoilMoistureData.data).forEach((depth) => {
                soilDepthDataTemp[depth] = true;
                depthSoilMoistureData.data[depth].data.forEach((data) => {
                    monthSet.add(data.month);
                });
            });
            const monthSortedArray = Array.from(monthSet).sort((a, b) => a - b);
            setAvailableMonths(monthSortedArray);
            setSelectedMonth(monthSortedArray[0]);
            setShowSoilDepthData(soilDepthDataTemp);
        } else if (depthSoilMoistureData === null && weatherData !== null) {
            const monthsArr = Array.from(new Set(weatherData.avg_air_temp.map((data) => data.month))).sort(
                (a, b) => a - b
            );
            setAvailableMonths(monthsArr);
            setSelectedMonth(monthsArr[0]);
        }
    }, [depthSoilMoistureData, weatherData]);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' };
    const formattedDate = new Intl.DateTimeFormat('en-US', options);
    const soilMoistureValueFormatter = (value: string | number | null, axis: string) => {
        if (value !== null) {
            return axis === 'y'
                ? `${Math.round((value as number) * 1000) / 1000} %`
                : `${formattedDate.format(new Date(`${value}T00:00:00`))}`;
        }
        return '';
    };

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

    const [chartsData, setChartsData] = React.useState<{
        xAxisLabels: string[];
        series: AllSeriesType[];
        compositionWeatherData: DatasetType;
    }>({ xAxisLabels: [], series: [], compositionWeatherData: [] });

    const getWeatherYAxisData = (data: GeostreamsData[], xAxisLabelsArr: string[]) => {
        if (data && xAxisLabelsArr.length !== 0) {
            const yAxisData = new Array<number | null>(xAxisLabelsArr.length).fill(null);
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

    React.useEffect(() => {
        if (selectedMonth !== null && depthSoilMoistureData && showSoilDepthData && weatherData) {
            const xAxisLabelsTemp = new Set<string>();

            weatherData.avg_air_temp.forEach((data) => {
                if (data.month === selectedMonth) {
                    xAxisLabelsTemp.add(data.label);
                }
            });
            const xAxisLabelsSortedArray = Array.from(xAxisLabelsTemp).sort();

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
            Object.keys(showSoilDepthData)
                .sort((a, b) => parseInt(a.replace('cm', ''), 10) - parseInt(b.replace('cm', ''), 10))
                .forEach((depth, idx) => {
                    if (showSoilDepthData[depth]) {
                        const yAxisData = new Array<number | null>(xAxisLabelsSortedArray.length).fill(null);
                        if (xAxisLabelsSortedArray.length !== 0) {
                            depthSoilMoistureData.data[depth].data.forEach((data) => {
                                if (data.month === selectedMonth) {
                                    const index = xAxisLabelsSortedArray.indexOf(data.label);
                                    if (index !== -1) {
                                        yAxisData[index] = data.average;
                                    }
                                }
                            });
                        }
                        seriesTemp.push({
                            type: 'line',
                            data: yAxisData,
                            label: depth,
                            valueFormatter: (value: number | null) => soilMoistureValueFormatter(value, 'y'),
                            color: colors[idx % colors.length],
                            yAxisKey: 'depth'
                        });
                    }
                });

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

            setChartsData({
                xAxisLabels: xAxisLabelsSortedArray,
                series: seriesTemp,
                compositionWeatherData: dataset
            });
        } else if (selectedMonth !== null && depthSoilMoistureData === null && weatherData) {
            const xAxisLabelsTemp = new Set<string>();
            weatherData.avg_air_temp.forEach((data) => {
                if (data.month === selectedMonth) {
                    xAxisLabelsTemp.add(data.label);
                }
            });
            const xAxisLabelsSortedArray = Array.from(xAxisLabelsTemp).sort();

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

            setChartsData({
                xAxisLabels: xAxisLabelsSortedArray,
                series: seriesTemp,
                compositionWeatherData: dataset
            });
        }
    }, [selectedMonth, depthSoilMoistureData, showSoilDepthData, weatherData]);

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
        <Box>
            <Box>
                {availableMonths.length !== 0 ? (
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
                            {availableMonths.map((monthNum) => {
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
                            })}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
            <Box>
                <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                    <Box sx={{ marginBottom: '20px' }}>
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
                            Air Temperature and Vapor Pressure Deficit
                        </Typography>
                    </Box>
                    <AirTempAndVPDPlot
                        dataset={chartsData.compositionWeatherData}
                        series={weatherDataSeries}
                        xAxisLabels={chartsData.xAxisLabels}
                        valueFormatter={(value: string) => soilMoistureValueFormatter(value, 'x')}
                    />
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
                                  .sort((a, b) => parseInt(a.replace('cm', ''), 10) - parseInt(b.replace('cm', ''), 10))
                                  .map((depthValue, idx) => {
                                      return (
                                          <FormControlLabel
                                              key={depthValue}
                                              control={
                                                  <DepthSwitch
                                                      checked={showSoilDepthData[depthValue]}
                                                      onChange={(e) => {
                                                          setShowSoilDepthData({
                                                              ...showSoilDepthData,
                                                              [depthValue]: e.target.checked
                                                          });
                                                      }}
                                                      sx={{
                                                          display: 'flex',
                                                          alignItems: 'center'
                                                      }}
                                                  />
                                              }
                                              label={
                                                  <Box display="flex" alignItems="center">
                                                      <FiberManualRecordIcon
                                                          fontSize="small"
                                                          sx={{ color: colors[idx % colors.length] }}
                                                      />{' '}
                                                      Depth {depthValue}
                                                  </Box>
                                              }
                                          />
                                      );
                                  })
                            : null}
                    </Box>
                </Box>
                <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                    {depthSoilMoistureData === null ? (
                        <Box sx={{ my: '10px' }}>
                            <Alert severity="info">No Soil moisture data found for the selected year and month.</Alert>
                        </Box>
                    ) : null}
                    <SoilMoistureByDepthGraph
                        series={chartsData.series}
                        xAxisLabels={chartsData.xAxisLabels}
                        valueFormatter={(value: string) => soilMoistureValueFormatter(value, 'x')}
                        yAxis={
                            depthSoilMoistureData !== null
                                ? [
                                      { id: 'depth', label: 'Soil Moisture (%)' },
                                      { id: 'avg-precipitation', label: 'Precipitation (mm)' }
                                  ]
                                : [{ id: 'avg-precipitation', label: 'Precipitation (mm)' }]
                        }
                    />
                </Box>
            </Box>
        </Box>
    );
};

const SoilMoistureDepthWithATMDataWithLoading = withLoading(SoilMoistureDepthWithATMDataComponent);
const SoilMoistureDepthWithATMDataWithErrorHandling = withErrorHandling(SoilMoistureDepthWithATMDataWithLoading);

const SoilMoistureDepthWithATMData: React.FC<{ selectedYear: string | null; sectionHeader: string }> = ({
    selectedYear,
    sectionHeader
}) => {
    const { selectedResearch } = React.useContext(DataStateContext);

    const [combinedData, combinedDataLoading, combinedDataLoadError] = useCombinedSensorData(
        selectedYear,
        selectedResearch?.id
    );

    return (
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
                    {sectionHeader}
                </Typography>
            </Box>
            <Box>
                <SoilMoistureDepthWithATMDataWithErrorHandling
                    depthSoilMoistureData={combinedData !== null ? combinedData.depthSoilMoistureData : null}
                    weatherData={combinedData !== null ? combinedData.weatherData : null}
                    isLoading={combinedDataLoading}
                    error={combinedDataLoadError}
                />
            </Box>
        </Container>
    );
};

export default SoilMoistureDepthWithATMData;
