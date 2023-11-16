import React, { FC } from 'react';

import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

import fieldImage from "./field.png"
import { theme } from "../../../theme"

type Props = {
    farm: FarmDetail;
    fields: FieldDetail[];
    idx: number;
};

const FarmCard: FC<Props> = ({ farm, fields, idx }): JSX.Element => {
    return (
        <Card
            sx={{
                display: 'flex',
                width: '100%',
                height: '113px',
                my: 3,
                background: 'linear-gradient(292.79deg, rgba(232, 245, 250, 0.75) 0%, rgba(243, 248, 253, 0.37) 100%)'
            }}
        >
            <CardMedia component="img" image={fieldImage} sx={{ width: '120px' }} alt="Field image" />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: "100%",
                    gap: '4px'
                }}
            >
                <CardContent sx={{  }}>
                    <Box 
                        sx={(theme) => ({ 
                            display: 'flex', 
                            flexWrap: 'wrap',
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            font: "Roboto",
                            fontWeight: 400,
                            fontSize: '12px',
                            color: theme.palette.text.secondary,
                        })}
                    >
                        <Typography variant="caption">
                            {`NO. ${idx}`}
                        </Typography>
                        <Typography variant="caption">
                            {farm.location}
                        </Typography>
                    </Box>
                    <Typography sx={{mb: 1, font: "Roboto", fontWeight: 700, fontSize: "16px", lineHeight: "28px", color: theme.palette.text.primary }} variant="subtitle1">
                        {farm.farmName}
                    </Typography>
                    <Box 
                        sx={(theme) => ({ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            justifyContent: 'space-between',
                            font: "Roboto",
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: "20.02px",
                            color: theme.palette.text.secondary,
                        })}
                    >
                        <Typography variant="body2">
                            {fields.length > 2 ? `${fields[0].fieldName}, ${fields[1].fieldName}` : `${fields.map((field) => field.fieldName).join(' and ')}`}
                        </Typography>
                        <Typography variant="body2">
                            {fields.length > 2 ? ` and ${fields.length - 2} more` : null}
                        </Typography>
                    </Box>
                </CardContent>
            </Box>
        </Card>
    );
};

export default FarmCard;
