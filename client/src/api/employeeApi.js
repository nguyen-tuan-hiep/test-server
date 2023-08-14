import httpRequest from "./httpRequest";

const PREFIX = "employee";

const employeeApi = {
    login(data) {
        const url = `${PREFIX}/login`;
        return httpRequest.post(url, data);
    },
    getEmployeeById(id) {
      const url = `${PREFIX}/${id}`;
        return httpRequest.get(url);
    }
};

export default employeeApi;
