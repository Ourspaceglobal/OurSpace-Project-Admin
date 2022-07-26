import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllLocalGoverments";
export const STORE = "storeLocalGoverment";
export const SHOW = "showLocalGoverment";
export const UPDATE = "updateLocalGoverment";
export const DESTROY = "destroyLocalGoverment";
export const RESTORE = "restoreLocalGoverment";

// mutation types
export const SET_LOCAL_GOVERNMENTS = "setLocalGovernments";
export const SET_LOCAL_GOVERNMENT = "setLocalGovernment";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  local_government: null
};

const getters = {
  getLocalGovernments(state) {
    return state.list;
  },
  getLocalGovernment(state) {
    return state.local_government;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/local-governments" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_LOCAL_GOVERNMENTS,
            response.data.data.local_governments
          );
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
        .post("/admin/local-governments")
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
      ApiService.get(`/admin/local-governments/${id}`)
        .then(response => {
          context.commit(
            SET_LOCAL_GOVERNMENT,
            response.data.data.local_government
          );
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
        .put(`/admin/local-governments/${form.id}`)
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
      ApiService.delete(`/admin/local-governments/${id}`)
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
      ApiService.patch(`/admin/local-governments/${id}/restore`)
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
  [SET_LOCAL_GOVERNMENTS](state, local_governments) {
    state.list = local_governments;
  },
  [SET_LOCAL_GOVERNMENT](state, local_government) {
    state.local_government = local_government;
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
