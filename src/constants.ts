export default {
    get apiBaseUrl(): string {
        return process.env.BASE_OPEN_API_URL || ""; //"https://api.openai.com/v1/"
    },

    get apiKey() : string {
        return process.env.OPEN_API_TOKEN || "";
    }
};
