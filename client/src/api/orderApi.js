import httpRequest from "./httpRequest";

const PREFIX = "orders";

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
    return httpRequest.put(url, data);
  },
  updateCost(id, data) {
    const url = `${PREFIX}/cost/${id}`;
    return httpRequest.patch(url, data);
  },
  getOrderById(id) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.get(url);
  },
  searchByName(name) {
    const url = `${PREFIX}/search`;
    return httpRequest.get(url, { params: { name } });
  },
  searchByPhone(phone) {
    const url = `${PREFIX}/search`;
    return httpRequest.get(url, { params: { phone } });
  },
  getDishesByOrderId(id) {
    const url = `${PREFIX}/${id}/dishes`;
    return httpRequest.get(url);
  },
  getStatistic(data) {
    const url = `/statistic`;
    return httpRequest.get(url, {
      params: { beginDate: data.beginDate, endDate: data.endDate },
    });
  },
  getOrdersBetweenDate(data) {
    const url = `statistic/orderBetweenDate`;
    return httpRequest.get(url, {
      params: { beginDate: data.beginDate, endDate: data.endDate },
    });
  },
  getTop5DishesBetweenDate(data) {
    const url = `statistic/top5DishesBetweenDate`;
    return httpRequest.get(url, {
      params: { beginDate: data.beginDate, endDate: data.endDate },
    });
  },
};

export default orderApi;
