import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function BusinessUnit({ title }) {
    return (
        <Card
            sx={{
                width: 160,
                height: 160,      // square shape
                borderRadius: 3,
                boxShadow: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700}>
                    {title}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default BusinessUnit;
