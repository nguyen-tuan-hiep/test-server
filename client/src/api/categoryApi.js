import httpRequest from "./httpRequest";

const PREFIX = "category";

const categoryApi = {
    getCategoryList: () => {
        const url = `${PREFIX}`;
        return httpRequest.get(url);
    },
};

export default categoryApi;
