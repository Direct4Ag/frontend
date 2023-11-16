import React, { FC } from 'react';

import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

import fieldImage from "./field.png"

type Props = {
    field: FieldsSummary;
    idx: number;
};

const FieldCard: FC<Props> = ({ field, idx }): JSX.Element => {
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
                <CardContent sx={{ flex: '1 0 auto' }}>
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
                            {field.farm.location}
                        </Typography>
                    </Box>
                    <Typography sx={{mb: 1}} variant="subtitle1">
                        {field.farm.farmName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {field.fieldName}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
};

export default FieldCard;
