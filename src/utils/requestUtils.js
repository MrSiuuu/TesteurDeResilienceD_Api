export const sendRequest = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
};
