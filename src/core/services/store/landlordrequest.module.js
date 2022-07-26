import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllLandlordRequests";
export const SHOW = "fetchLandlordRequest";
export const APPROVE = "approveLandlordRequest";
export const DECLINE = "declineLandlordRequest";

// mutation types
export const SET_LANDLORD_REQUESTS = "setLandlordRequests";
export const SET_LANDLORD_REQUEST = "setLandlordRequest";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  landlord_request: null
};

const getters = {
  getLandlordRequests(state) {
    return state.list;
  },
  getLandlordRequest(state) {
    return state.landlord_request;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/landlord-requests" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_LANDLORD_REQUESTS,
            response.data.data.landlord_requests
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
      ApiService.get(`/admin/landlord-requests/${id}`)
        .then(response => {
          context.commit(
            SET_LANDLORD_REQUEST,
            response.data.data.landlord_request
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
      ApiService.patch(`/admin/landlord-requests/${id}/approve`)
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
        .patch(`/admin/landlord-requests/${form.id}/decline`)
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
  [SET_LANDLORD_REQUESTS](state, landlord_requests) {
    state.list = landlord_requests;
  },
  [SET_LANDLORD_REQUEST](state, landlord_request) {
    state.landlord_request = landlord_request;
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
