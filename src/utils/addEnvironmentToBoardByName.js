import api from "../API/api";

export const addEnvironmentToBoardByName = async (boardId, environmentName) => {
    try {
        const { data } = await api.post(
            `/boards/${boardId}/environments/${environmentName}`
        );

        console.log("Environment added to board:", data);
        return data;
    } catch (err) {
        console.error("addEnvironmentToBoardByName error:", err);

        if (err.response) {
            throw new Error(
                `Request failed: ${err.response.status} - ${err.response.data?.message || err.response.statusText
                }`
            );
        }

        throw err;
    }
};
