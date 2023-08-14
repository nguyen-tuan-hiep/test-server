import httpRequest from "./httpRequest";

const PREFIX = "order";

const orderApi = {
    create(data) {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data);
    },
    delete(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
    update(id, data) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.patch(url, data);
    },
    updateCost(id, data) {
        const url = `${PREFIX}/cost/${id}`;
        return httpRequest.patch(url, data);
    },
    getOrderById(id) {
        const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    },
    search(name, date) {
        const url = `${PREFIX}/search`;
        return httpRequest.get(url, { params: { name, date } });
    },
    getComboAndDisk(id) {
        const url = `${PREFIX}/combo-and-disk/${id}`;
        return httpRequest.get(url);
    },
    getStatistic(data) {
        const url = `${PREFIX}/statistic`;
        return httpRequest.get(url, {
            params: { beginDate: data.beginDate, endDate: data.endDate },
        });
    },
    getOrdersBetweenDate(data) {
        const url = `${PREFIX}/orderBetweenDate`;
        return httpRequest.get(url, {
            params: { beginDate: data.beginDate, endDate: data.endDate },
        });
    },
};

export default orderApi;
