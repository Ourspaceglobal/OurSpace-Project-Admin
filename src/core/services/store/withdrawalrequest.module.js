import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllWithdrawalRequests";
export const SHOW = "fetchWithdrawalRequest";
export const APPROVE = "approveWithdrawalRequest";
export const DECLINE = "declineWithdrawalRequest";

// mutation types
export const SET_WITHDRAWAL_REQUESTS = "setWithdrawalRequests";
export const SET_WITHDRAWAL_REQUEST = "setWithdrawalRequest";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  withdrawal_request: null
};

const getters = {
  getWithdrawalRequests(state) {
    return state.list;
  },
  getWithdrawalRequest(state) {
    return state.withdrawal_request;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/withdrawal-requests" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_WITHDRAWAL_REQUESTS,
            response.data.data.withdrawal_requests
          );
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [SHOW](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/withdrawal-requests/${id}`)
        .then(response => {
          context.commit(
            SET_WITHDRAWAL_REQUEST,
            response.data.data.withdrawal_request
          );
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [APPROVE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post(`/admin/withdrawal-requests/${form.id}/approve`, {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              data._method = "PATCH";
              return serialize(data);
            }
          ]
        })
        .then(response => {
          context.dispatch("fetchAllStatistics");
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [DECLINE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .patch(`/admin/withdrawal-requests/${form.id}/decline`)
        .then(response => {
          context.dispatch("fetchAllStatistics");
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_WITHDRAWAL_REQUESTS](state, withdrawal_requests) {
    state.list = withdrawal_requests;
  },
  [SET_WITHDRAWAL_REQUEST](state, withdrawal_request) {
    state.withdrawal_request = withdrawal_request;
  },
  [SET_ERROR](state, error) {
    state.errors = error;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
