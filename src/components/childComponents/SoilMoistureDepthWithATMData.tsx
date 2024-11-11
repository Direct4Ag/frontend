import React from 'react';

import { Box, CircularProgress, Chip, Container, FormControlLabel, Stack, Switch, Typography } from '@mui/material';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { alpha, styled } from '@mui/material/styles';
import { AllSeriesType } from '@mui/x-charts';
import { DatasetType } from '@mui/x-charts/models/seriesType/config';

import SoilMoistureByDepthGraph from '@app/components/childComponents/SoilMoistureByDepthGraph';
import AirTempAndVPDPlot from '@app/components/childComponents/AirTempAndVPDPlot';
import { DataStateContext } from '@app/store/contexts';
import { useDepthSoilMoistureData, useWeatherData } from '@app/utils/hooks';
import withErrorHandling from '@app/components/childComponents/hocs/withErrorHandling';
import withLoading from '@app/components/childComponents/hocs/withLoading';
import { theme } from '@app/theme';

const SoilMoistureByDepthGraphWithLoading = withLoading(SoilMoistureByDepthGraph);
const SoilMoistureByDepthGraphWithErrorHandling = withErrorHandling(SoilMoistureByDepthGraphWithLoading);

const AirTempAndVPDPlotWithLoading = withLoading(AirTempAndVPDPlot);
const AirTempAndVPDPlotWithErrorHandling = withErrorHandling(AirTempAndVPDPlotWithLoading);

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

const SoilMoistureDepthWithATMData: React.FC<{ selectedYear: string; sectionHeader: string }> = ({
    selectedYear,
    sectionHeader
}) => {
    const { selectedField } = React.useContext(DataStateContext);

    const [soilDepthData, soilMoistureLoading, soilMoistureLoadError] = useDepthSoilMoistureData(
        selectedYear,
        selectedField?.id
    );
    const [weatherData, weatherDataLoading, weatherDataLoadError] = useWeatherData(selectedYear, selectedField?.id);
    const [showSoilDepthData, setShowSoilDepthData] = React.useState<ShowSoilDepthData | null>(null);
    const [availableMonths, setAvailableMonths] = React.useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (soilDepthData) {
            const monthSet = new Set<number>();
            const soilDepthDataTemp: ShowSoilDepthData = {};
            Object.keys(soilDepthData.data).forEach((depth) => {
                soilDepthDataTemp[depth] = true;
                soilDepthData.data[depth].data.forEach((data) => {
                    monthSet.add(data.month);
                });
            });
            const monthSortedArray = Array.from(monthSet).sort((a, b) => a - b);
            setAvailableMonths(monthSortedArray);
            setSelectedMonth(monthSortedArray[0]);
            setShowSoilDepthData(soilDepthDataTemp);
        }
    }, [soilDepthData]);

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const soilMoistureValueFormatter = (value: string | number | null, axis: string) => {
        if (value !== null) {
            return axis === 'y'
                ? `${Math.round((value as number) * 1000) / 1000} %`
                : `${new Date(value).toLocaleDateString('en-US', options)}`;
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

    const [xAxisLabels, setXAxisLabels] = React.useState<string[]>([]);
    const [series, setSeries] = React.useState<AllSeriesType[]>([]);
    const [compositionWeatherData, setCompositionWeatherData] = React.useState<DatasetType>([]);

    React.useEffect(() => {
        if (selectedMonth !== null && soilDepthData && showSoilDepthData && weatherData) {
            const xAxisLabelsTemp = new Set<string>();
            Object.keys(soilDepthData.data).forEach((depth) => {
                if (showSoilDepthData[depth]) {
                    soilDepthData.data[depth].data.forEach((data) => {
                        if (data.month === selectedMonth && data.year === parseInt(selectedYear, 10)) {
                            xAxisLabelsTemp.add(data.label);
                        }
                    });
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
            Object.keys(showSoilDepthData)
                .sort((a, b) => parseInt(a.replace('cm', ''), 10) - parseInt(b.replace('cm', ''), 10))
                .forEach((depth, idx) => {
                    if (showSoilDepthData[depth]) {
                        let yAxisData: number[] = [];
                        if (xAxisLabelsSortedArray.length !== 0) {
                            yAxisData = new Array<number>(xAxisLabelsSortedArray.length).fill(0);
                            soilDepthData.data[depth].data.forEach((data) => {
                                if (data.month === selectedMonth) {
                                    const index = xAxisLabelsSortedArray.indexOf(data.label);
                                    yAxisData[index] = data.average;
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
            // set series state value
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
    }, [selectedMonth, selectedYear, soilDepthData, showSoilDepthData, weatherData]);

    const getWeatherYAxisData = (data: GeostreamsData[], xAxisLabelsArr: string[]) => {
        if (data && xAxisLabelsArr.length !== 0) {
            const yAxisData = new Array<number>(xAxisLabelsArr.length).fill(0);
            data.forEach((dataVal) => {
                if (dataVal.month === selectedMonth) {
                    const index = xAxisLabelsArr.indexOf(dataVal.label);
                    yAxisData[index] = dataVal.average;
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
                                <CircularProgress />
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Box>
            <Box>
                <Box sx={{ width: '100%', marginTop: '20px', marginBottom: '20px' }}>
                    <AirTempAndVPDPlotWithErrorHandling
                        dataset={compositionWeatherData}
                        series={weatherDataSeries}
                        xAxisLabels={xAxisLabels}
                        valueFormatter={(value: string) => soilMoistureValueFormatter(value, 'x')}
                        isLoading={weatherDataLoading}
                        error={weatherDataLoadError}
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
                    <SoilMoistureByDepthGraphWithErrorHandling
                        series={series}
                        xAxisLabels={xAxisLabels}
                        valueFormatter={(value: string) => soilMoistureValueFormatter(value, 'x')}
                        yAxis={[
                            { id: 'depth', label: 'Soil Moisture (%)' },
                            { id: 'avg-precipitation', label: 'Precipitation (mm)' }
                        ]}
                        isLoading={soilMoistureLoading}
                        error={soilMoistureLoadError}
                    />
                </Box>
            </Box>
        </Container>
    );
};

export default SoilMoistureDepthWithATMData;
