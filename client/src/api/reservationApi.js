import httpRequest from "./httpRequest";

const PREFIX = "reservations";

const reservationApi = {
	createReservation: (data) => {
		const url = `${PREFIX}/create`;
		return httpRequest.post(url, data);
	},
    getAvailableTables: ({ capacity, res_date, res_time_start }) => {
        const url = `${PREFIX}/available-tables`;
        return httpRequest.get(url, { params: { capacity, res_date, res_time_start } });
    },
	getReservationList: () => {
		const url = `${PREFIX}`;
		return httpRequest.get(url);
	},
	searchByPhone: ({ phone, table_id }) => {
		const url = `${PREFIX}/search`;
		return httpRequest.get(url, { params: { phone } });
	},
	deleteReservationById: (id) => {
		const url = `${PREFIX}/${id}`;
		return httpRequest.delete(url);
	},
};

export default reservationApi;
