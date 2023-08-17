import httpRequest from "./httpRequest";

const PREFIX = "reservations";

const reservationApi = {
    createReservation: (data) => {
        const url = `${PREFIX}/create`;
        return httpRequest.post(url, data);
    },
    // updateTable: (id, data) => {
    //     const url = `${PREFIX}/${id}`;
    //     return httpRequest.patch(url, data);
    // },
    // getTableById: (id) => {
    //     const url = `${PREFIX}/${id}`;
    //     return httpRequest.get(url);
    // },
    getReservationList: () => {
        const url = `${PREFIX}`;
        return httpRequest.get(url);
    },
    deleteReservationById: (id) => {
        const url = `${PREFIX}/${id}`;
        return httpRequest.delete(url);
    },
};

export default reservationApi;
