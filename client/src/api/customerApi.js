import httpRequest from "./httpRequest";

const PREFIX = "customers";

const customerApi = {
  create(data) {
    const url = `${PREFIX}/create`;
    return httpRequest.post(url, data);
  },
  searchByNameOrRank({ name, rank }) {
    const url = `${PREFIX}/search`;
    return httpRequest.get(url, { params: { name, rank } });
  },
  searchByPhone(phone) {
    const url = `${PREFIX}/search`;
    return httpRequest.get(url, { params: { phone } });
  },
  getCustomerById(id) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.get(url);
  },
  deleteCustomerById(id) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.delete(url);
  },
  updateCustomerById(id, data) {
    const url = `${PREFIX}/${id}`;
    return httpRequest.patch(url, data);
  },
};

export default customerApi;
