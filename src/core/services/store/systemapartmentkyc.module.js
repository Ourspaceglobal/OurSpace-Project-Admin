import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllSystemApartmentKycs";
export const STORE = "storeSystemApartmentKyc";
export const SHOW = "showSystemApartmentKyc";
export const UPDATE = "updateSystemApartmentKyc";
export const DESTROY = "destroySystemApartmentKyc";
export const RESTORE = "restoreSystemApartmentKyc";

// mutation types
export const SET_SYSTEMAPARTMENTKYCS = "setSystemApartmentKycs";
export const SET_SYSTEMAPARTMENTKYC = "setSystemApartmentKyc";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  system_apartment_kyc: null
};

const getters = {
  getSystemApartmentKycs(state) {
    return state.list;
  },
  getSystemApartmentKyc(state) {
    return state.system_apartment_kyc;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get(
        "/admin/system-apartment-kycs" + (query ? `?${query}` : "")
      )
        .then(response => {
          context.commit(
            SET_SYSTEMAPARTMENTKYCS,
            response.data.data.system_apartment_kycs
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
        .post("/admin/system-apartment-kycs")
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
  },
  [SHOW](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/system-apartment-kycs/${id}`)
        .then(response => {
          context.commit(
            SET_SYSTEMAPARTMENTKYC,
            response.data.data.system_apartment_kyc
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
        .put(`/admin/system-apartment-kycs/${form.id}`)
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
  },
  [DESTROY](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/admin/system-apartment-kycs/${id}`)
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
      ApiService.patch(`/admin/system-apartment-kycs/${id}/restore`)
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
  [SET_SYSTEMAPARTMENTKYCS](state, system_apartment_kycs) {
    state.list = system_apartment_kycs;
  },
  [SET_SYSTEMAPARTMENTKYC](state, system_apartment_kyc) {
    state.system_apartment_kyc = system_apartment_kyc;
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
