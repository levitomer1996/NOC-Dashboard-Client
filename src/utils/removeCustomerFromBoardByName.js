// src/services/boards.ts (or similar)
import api from "../API/api";

export const removeEnvironmentFromBoardByName = async (boardId, environmentName) => {
    try {
        const { data } = await api.delete(
            `/boards/${boardId}/environments/${environmentName}`
        );

        console.log('Environment removed from board by name:', data);
        return data;
    } catch (err) {
        console.error('removeEnvironmentFromBoardByName error:', err);

        if (err.response) {
            throw new Error(
                `Request failed: ${err.response.status} - ${err.response.data?.message || err.response.statusText
                }`
            );
        }

        throw err;
    }
};
