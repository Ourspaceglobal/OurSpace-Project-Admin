import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllStates";
export const STORE = "storeState";
export const SHOW = "showState";
export const UPDATE = "updateState";
export const DESTROY = "destroyState";
export const RESTORE = "restoreState";

// mutation types
export const SET_STATES = "setStates";
export const SET_STATE = "setState";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  state: null
};

const getters = {
  getStates(state) {
    return state.list;
  },
  getState(state) {
    return state.state;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/states" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_STATES, response.data.data.states);
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
        .post("/admin/states")
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
      ApiService.get(`/admin/states/${id}`)
        .then(response => {
          context.commit(SET_STATE, response.data.data.state);
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
        .put(`/admin/states/${form.id}`)
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
      ApiService.delete(`/admin/states/${id}`)
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
      ApiService.patch(`/admin/states/${id}/restore`)
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
  [SET_STATES](state, states) {
    state.list = states;
  },
  [SET_STATE](state, data) {
    state.state = data;
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
