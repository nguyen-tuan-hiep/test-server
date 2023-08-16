import httpRequest from "./httpRequest";

const PREFIX = "tables";

const tableApi = {
    createTable: (data) => {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data);
    },
    updateTable: (id, data) => {
        const url = `${PREFIX}/${id}`;
        return httpRequest.patch(url, data);
    },
    getTableById: (id) => {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    getTableList: () => {
        const url = `${PREFIX}`;
        return httpRequest.get(url);
    },
    deleteTableById: (id) => {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
};

export default tableApi;
