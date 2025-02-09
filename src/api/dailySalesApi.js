import axios from "axios";

const BASE_URL = "/api/v1/admin/daily-sales";

export function getDailySales(start, end) {
        return axios.get(BASE_URL, { params: { start, end } });
    }