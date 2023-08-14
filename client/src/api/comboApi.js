import httpRequest from "./httpRequest";

const PREFIX = "combo";

const comboApi = {
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
    getComboById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    getListOfCombo() {
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

export default comboApi;
