export function addPortfolio(portfolio) {
    return {
        type: "ADD_PORTFOLIO",
        portfolio: portfolio
    }
}


export function deletePortfolio(id) {
    return {
        type: "DELETE_PORTFOLIO",
        id: id
    }
}
