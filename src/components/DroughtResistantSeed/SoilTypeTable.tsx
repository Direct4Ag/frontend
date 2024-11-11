import React from 'react';

import {
    Box,
    Divider,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { theme } from '@app/theme';

interface LabelMap {
    [key: string]: string;
}

const SoilTypeTable: React.FC<{ soilData: SoilData[] | null }> = ({ soilData }): JSX.Element => {
    const rowOrder = ['depth_bottom', 'claytotal_r', 'silttotal_r', 'sandtotal_r'];
    const rowNameMap: LabelMap = {
        depth_bottom: 'Depth',
        claytotal_r: 'Clay',
        silttotal_r: 'Silt',
        sandtotal_r: 'Sand'
    };
    return (
        <>
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
                        {rowOrder.map((row) => {
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
                                    {soilData?.map((data, index) => {
                                        return (
                                            <TableCell key={`${data[row]}_${index}`}>
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
                                                    {Math.ceil(parseFloat(data[row] as string) / 2.54)}{' '}
                                                    {row === 'depth_bottom' ? 'inches' : '%'}
                                                </Typography>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default SoilTypeTable;
