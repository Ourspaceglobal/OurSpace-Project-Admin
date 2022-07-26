import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllCities";
export const STORE = "storeCity";
export const SHOW = "showCity";
export const UPDATE = "updateCity";
export const DESTROY = "destroyCity";
export const RESTORE = "restoreCity";

// mutation types
export const SET_CITIES = "setCities";
export const SET_CITY = "setCity";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  city: null
};

const getters = {
  getCities(state) {
    return state.list;
  },
  getCity(state) {
    return state.city;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/cities" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_CITIES, response.data.data.cities);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [STORE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .post("/admin/cities")
        .then(response => {
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
      ApiService.get(`/admin/cities/${id}`)
        .then(response => {
          context.commit(SET_CITY, response.data.data.city);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [UPDATE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .put(`/admin/cities/${form.id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [DESTROY](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/admin/cities/${id}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [RESTORE](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.patch(`/admin/cities/${id}/restore`)
        .then(response => {
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
  [SET_CITIES](state, cities) {
    state.list = cities;
  },
  [SET_CITY](state, city) {
    state.city = city;
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
