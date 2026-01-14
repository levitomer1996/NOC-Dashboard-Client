import React, { useContext } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// Ensure path is correct
import AlertListModal from './Pages/AlertListModal';
import ModalContext from '../../Context/ModalContext';

const GModal = () => {
    const { isOpen, view, payload, closeModal } = useContext(ModalContext);

    // If there is no view, we render nothing (Dialog handles 'open={false}' gracefully, 
    // but this check is good for safety)
    if (!isOpen) return null;

    const renderContent = () => {
        switch (view) {
            case 'CONFIRMATION':
                return (
                    <>
                        <DialogTitle>
                            {payload?.title || 'Are you sure?'}
                        </DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="body1">
                                {payload?.message}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={closeModal} color="inherit">
                                Cancel
                            </Button>
                            <Button onClick={closeModal} variant="contained" color="primary">
                                Confirm
                            </Button>
                        </DialogActions>
                    </>
                );

            case 'LOGIN':
                return (
                    <>
                        <DialogTitle>Login</DialogTitle>
                        <DialogContent>
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography color="textSecondary">
                                    Login Form Components go here...
                                </Typography>
                            </Box>
                        </DialogContent>
                    </>
                );

            case 'ALERT_LIST':
                return (
                    <AlertListModal alerts={payload.alerts} />
                );

            default:
                return (
                    <DialogContent>
                        <Typography>Unknown View: {view}</Typography>
                    </DialogContent>
                );
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={closeModal}
            fullWidth
            maxWidth="sm" // Options: 'xs', 'sm', 'md', 'lg', 'xl'
        >
            {/* The "X" Close Button acts globally for all modals */}
            <IconButton
                aria-label="close"
                onClick={closeModal}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Render the specific content based on the switch case */}
            {renderContent()}
        </Dialog>
    );
};

export default GModal;