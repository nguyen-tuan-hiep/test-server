import httpRequest from "./httpRequest";

const PREFIX = "disk";

const diskApi = {
    create(data) {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    search(name) {
        const url = `${PREFIX}/search`;
        return httpRequest.get(url, { params: { name } });
    },
    getDiskById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    getListOfDisk() {
        const url = `${PREFIX}`;
        return httpRequest.get(url);
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

export default diskApi;
