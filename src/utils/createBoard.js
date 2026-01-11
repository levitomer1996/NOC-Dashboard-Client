export const createBoard = async (boardPayload) => {
    try {
        const { data } = await api.post("/boards", boardPayload);

        console.log("Board created:", data);
        return data;
    } catch (err) {
        console.error("createBoard error:", err);

        if (err.response) {
            throw new Error(
                `Request failed: ${err.response.status} - ${err.response.data?.message || err.response.statusText
                }`
            );
        }

        throw err;
    }
};