import httpRequest from "./httpRequest";

const PREFIX = "events";

const eventApi = {
  create(data) {
    const url = `${PREFIX}/create`;
    return httpRequest.post(url, data);
  },
  getEventById(id) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.get(url);
  },
  searchEvent({ name }) {
    const url = `${PREFIX}/search`;
    return httpRequest.get(url, { params: { name } });
  },
  delete(id) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.delete(url);
  },
  update(id, data) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.put(url, data);
  },
  getFreeDishes(id) {
    const url = `${PREFIX}/getDishes/${id}`;
    return httpRequest.get(url);
  },
};

export default eventApi;
