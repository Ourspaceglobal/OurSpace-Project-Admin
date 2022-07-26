import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllWalletFundingRequests";
export const SHOW = "fetchWalletFundingRequest";
export const APPROVE = "approveWalletFundingRequest";
export const DECLINE = "declineWalletFundingRequest";

// mutation types
export const SET_WALLET_FUNDING_REQUESTS = "setWalletFundingRequests";
export const SET_WALLET_FUNDING_REQUEST = "setWalletFundingRequest";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  wallet_funding_request: null
};

const getters = {
  getWalletFundingRequests(state) {
    return state.list;
  },
  getWalletFundingRequest(state) {
    return state.wallet_funding_request;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get(
        "/admin/wallet-funding-requests" + (query ? `?${query}` : "")
      )
        .then(response => {
          context.commit(
            SET_WALLET_FUNDING_REQUESTS,
            response.data.data.wallet_funding_requests
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
      ApiService.get(`/admin/wallet-funding-requests/${id}`)
        .then(response => {
          context.commit(
            SET_WALLET_FUNDING_REQUEST,
            response.data.data.wallet_funding_request
          );
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [APPROVE](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/wallet-funding-requests/${id}/approve`)
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
        .patch(`/admin/wallet-funding-requests/${form.id}/decline`)
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
  [SET_WALLET_FUNDING_REQUESTS](state, wallet_funding_requests) {
    state.list = wallet_funding_requests;
  },
  [SET_WALLET_FUNDING_REQUEST](state, wallet_funding_request) {
    state.wallet_funding_request = wallet_funding_request;
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
