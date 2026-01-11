import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import api from '../API/api';

// 1. Initial State
const initialState = {
    tags: null, // Changed to null initially to distinguish "empty" from "not loaded"
    loading: false,
    error: null,
    isAdding: false, // New state to track if we are currently adding a tag
};

// 2. Reducer
const tagsReducer = (state, action) => {
    switch (action.type) {
        // Fetching Actions
        case 'FETCH_INIT':
            return { ...state, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, tags: action.payload };
        case 'FETCH_FAILURE':
            return { ...state, loading: false, error: action.payload };

        // Add Tag Actions
        case 'ADD_TAG_INIT':
            return { ...state, isAdding: true, error: null };
        case 'ADD_TAG_SUCCESS':
            return {
                ...state,
                isAdding: false,
                tags: action.payload // We replace the local state with the updated data from server
            };
        case 'ADD_TAG_FAILURE':
            return { ...state, isAdding: false, error: action.payload };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

const TagsContext = createContext(initialState);

export const TagsProvider = ({ children }) => {
    const [state, dispatch] = useReducer(tagsReducer, initialState);

    // 3. Helper to Fetch Data (Refactored to be reusable)
    const fetchDictionary = useCallback(async () => {
        dispatch({ type: 'FETCH_INIT' });
        try {
            const response = await api.get(`${process.env.REACT_APP_API_URL}/dictionary`);
            dispatch({ type: 'FETCH_SUCCESS', payload: response.data });
        } catch (error) {
            console.error('Error fetching tags dictionary:', error);
            dispatch({
                type: 'FETCH_FAILURE',
                payload: error.message || 'Failed to fetch tags'
            });
        }
    }, []);

    // 4. Initial Load
    useEffect(() => {
        fetchDictionary();
    }, [fetchDictionary]);

    // 5. New Function: Add Tag
    const addTag = async (dictionaryName, key) => {
        dispatch({ type: 'ADD_TAG_INIT' });

        try {
            const payload = {
                name: dictionaryName, // ✅ chosen by user now
                key,

            };

            const response = await api.post(
                `${process.env.REACT_APP_API_URL}/dictionary/add-entry-to-dictionary/${dictionaryName}/${key}`,
                payload
            );

            dispatch({ type: 'ADD_TAG_SUCCESS', payload: response.data });
        } catch (error) {
            console.error('Error adding tag:', error);
            dispatch({
                type: 'ADD_TAG_FAILURE',
                payload: error.response?.data?.message || error.message || 'Failed to add tag',
            });
        }
    };
    // 6. Return State + Functions
    const value = {
        ...state,
        addTag,       // Exposed function
        refreshTags: fetchDictionary // Exposed function to manually reload if needed
    };

    return (
        <TagsContext.Provider value={value}>
            {children}
        </TagsContext.Provider>
    );
};

export default TagsContext;