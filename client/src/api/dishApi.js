import httpRequest from "./httpRequest";

const PREFIX = "dishes";

const dishApi = {
    create(data) {
        const url = `${PREFIX}/create`;
        console.log(data);
        // return httpRequest.post(url, data, {
        //     headers: { "Content-Type": "multipart/form-data" },
        // });
        return httpRequest.post(url, data);
    },
    search(name) {
        const url = `${PREFIX}/search`;
        return httpRequest.get(url, { params: { name } });
    },
    getDiskById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    // getListOfDisk() {
    //     const url = `${PREFIX}`;
    //     return httpRequest.get(url);
    // },
    delete(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
    update(id, data) {
        const url = `${PREFIX}/${id}`;
        console.log(data);
        // return httpRequest.patch(url, data, {
        //     headers: { "Content-Type": "multipart/form-data" },
        // });
        return httpRequest.patch(url, data);
    },
};

export default dishApi;
