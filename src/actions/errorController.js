// error handeling request
export function getError(error) {
    return {
        type: "GET_ERROR",
        error: error
    };
}
