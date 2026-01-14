import React, { useEffect, useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Divider,
    Box,
    Chip,
    CircularProgress,
    Tooltip
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../../../API/api';

// Helper: Determine color based on priority
const getPriorityColor = (priority) => {
    switch (priority) {
        case 'P1': return 'error.main';     // Red
        case 'P2': return 'warning.main';   // Orange
        case 'P3': return '#ffd700';        // Yellow
        case 'P4': return 'success.main';   // Green
        default: return 'grey.500';
    }
};

// Helper: Choose icon based on priority
const getPriorityIcon = (priority) => {
    switch (priority) {
        case 'P1': return <ErrorIcon />;
        case 'P2': return <WarningIcon />;
        case 'P3': return <InfoIcon />;
        case 'P4': return <CheckCircleIcon />;
        default: return <InfoIcon />;
    }
};

const AlertListModal = ({ alerts: initialAlerts }) => {
    const [fetchedAlerts, setFetchedAlerts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            if (!initialAlerts || initialAlerts.length === 0) return;

            const ids = initialAlerts.map((a) => a.id);
            setLoading(true);
            setError(null);

            try {
                const response = await api.post('/opsgenie/fetch-list', { ids });
                setFetchedAlerts(response.data || []);
                console.log("Fetched alert details:", response.data);
            } catch (err) {
                console.error("Failed to fetch alert details:", err);
                setError("Failed to load latest alert details.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, [initialAlerts]);

    if (loading) {
        return (
            <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 2, textAlign: 'center', color: 'error.main' }}>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    if (!fetchedAlerts || fetchedAlerts.length === 0) {
        return (
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography color="textSecondary">No alerts found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <List>
                {fetchedAlerts.map((alert, index) => {
                    // Fallback to initial data if needed, but prefer API data
                    const initialMatch = initialAlerts.find(a => a.id === alert.id);

                    // 1. Use the 'message' field from your object as the main text
                    const displayMessage = alert.message || alert.metric || initialMatch?.metric || 'No message';
                    const displayEnv = alert.env || initialMatch?.env || 'N/A';
                    const isSeen = alert.isSeen || alert.seen || false; // Check both properties just in case
                    const updatedAt = alert.updatedAt ? new Date(alert.updatedAt).toLocaleString() : 'N/A';

                    return (
                        <React.Fragment key={alert.id || index}>
                            <ListItem alignItems="flex-start">
                                {/* Left Icon (Avatar) */}
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: getPriorityColor(alert.priority) }}>
                                        {getPriorityIcon(alert.priority)}
                                    </Avatar>
                                </ListItemAvatar>

                                {/* Main Text Content */}
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                                            {/* Priority Chip */}
                                            <Chip
                                                label={alert.priority}
                                                size="small"
                                                sx={{
                                                    bgcolor: getPriorityColor(alert.priority),
                                                    color: alert.priority === 'P3' ? 'black' : 'white',
                                                    height: 20,
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}
                                            />

                                            {/* Is Seen Indicator */}
                                            <Tooltip title={isSeen ? "Seen" : "Not Seen"}>
                                                <Chip
                                                    icon={isSeen ? <VisibilityIcon style={{ fontSize: 14 }} /> : <VisibilityOffIcon style={{ fontSize: 14 }} />}
                                                    label={isSeen ? "Seen" : "New"}
                                                    size="small"
                                                    variant={isSeen ? "outlined" : "filled"}
                                                    color={isSeen ? "default" : "primary"}
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            </Tooltip>
                                        </Box>
                                    }
                                    secondary={
                                        <React.Fragment>
                                            {/* The Actual Message */}
                                            <Typography
                                                component="span"
                                                variant="body1"
                                                color="text.primary"
                                                sx={{ display: 'block', fontWeight: 500, mb: 0.5 }}
                                            >
                                                {displayMessage}
                                            </Typography>

                                            {/* Metadata */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                                                <Typography variant="body2" component="span">
                                                    Environment: <strong>{displayEnv}</strong>
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Updated: {updatedAt}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: {alert.id}
                                                </Typography>
                                            </Box>
                                        </React.Fragment>
                                    }
                                />
                            </ListItem>
                            {index < fetchedAlerts.length - 1 && <Divider variant="inset" component="li" />}
                        </React.Fragment>
                    );
                })}
            </List>
        </Box>
    );
};

export default AlertListModal;