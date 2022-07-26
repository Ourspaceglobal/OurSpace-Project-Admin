import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllApartments";
export const SHOW = "showApartment";
export const TOGGLE_ACTIVE_STATUS = "toggleActiveStatusForApartment";
export const TOGGLE_VERIFIED_STATUS = "toggleVerifiedStatusForApartment";
export const TOGGLE_FEATURED_STATUS = "toggleFeaturedStatusForApartment";

// mutation types
export const SET_APARTMENTS = "setApartments";
export const SET_APARTMENT = "setApartment";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  apartment: null
};

const getters = {
  getApartments(state) {
    return state.list;
  },
  getApartment(state) {
    return state.apartment;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/apartments" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_APARTMENTS, response.data.data.apartments);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [SHOW](context, { id, query = null }) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/apartments/${id}` + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_APARTMENT, response.data.data.apartment);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [TOGGLE_ACTIVE_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/apartments/${id}/active`)
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
  [TOGGLE_VERIFIED_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/apartments/${id}/verify`)
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
  [TOGGLE_FEATURED_STATUS](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/apartments/${id}/feature`)
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
  [SET_APARTMENTS](state, data) {
    state.list = data;
  },
  [SET_APARTMENT](state, data) {
    state.apartment = data;
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
