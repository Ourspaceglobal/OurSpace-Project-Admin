import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllSystemData";
export const UPDATE = "updateSystemData";

// mutation types
export const SET_SYSTEMDATA = "setSystemData";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: []
};

const getters = {
  getSystemData(state) {
    return state.list;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/system-data" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(SET_SYSTEMDATA, response.data.data.system_data);
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
        .post(`/admin/system-data/${form.id}`, {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              data._method = "PATCH";
              return serialize(data);
            }
          ]
        })
        .then(response => {
          context.dispatch("showToast", {
            icon: "success",
            title: response.data.message
          });

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
  [SET_SYSTEMDATA](state, system_data) {
    state.list = system_data;
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
