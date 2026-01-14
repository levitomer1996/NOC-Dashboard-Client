import React, { createContext, useReducer } from 'react';

// 1. Initial State
const initialState = {
    isOpen: false,
    view: null,
    payload: null,
};

// 2. Reducer
const modalReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return {
                ...state,
                isOpen: true,
                view: action.payload.view,
                payload: action.payload.payload || null,
            };
        case 'CLOSE_MODAL':
            return {
                ...state,
                isOpen: false,
                view: null,
                payload: null,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const ModalContext = createContext(initialState);

export const ModalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(modalReducer, initialState);

    // 3. Helper Functions (Standard functions, no useCallback)

    const openModal = (view, payload) => {
        console.log('Opening modal with view:', view, 'and payload:', payload);
        dispatch({ type: 'OPEN_MODAL', payload: { view, payload } });
    };

    const closeModal = () => {
        dispatch({ type: 'CLOSE_MODAL' });
    };

    // 4. Return State + Functions
    const value = {
        ...state,
        openModal,
        closeModal
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalContext;