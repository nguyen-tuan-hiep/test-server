import httpRequest from "./httpRequest";

const PREFIX = "event";

const eventApi = {
    create(data) {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    getEventById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    searchEvent(name, price) {
        const url = `${PREFIX}/search`;
        return httpRequest.get(url, { params: { name, price } });
    },
    delete(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
    update(id, data) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.patch(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export default eventApi;
