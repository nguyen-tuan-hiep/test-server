import httpRequest from "./httpRequest";

const PREFIX = "discount";

const discountApi = {
    create(data) {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data);
    },
    getdiscountById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    delete(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
    update(id, data) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.patch(url, data);
    },
};

export default discountApi;
