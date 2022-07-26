import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllApartmentRentals";
export const TERMINATE = "terminateApartmentRental";

// mutation types
export const SET_APARTMENT_RENTALS = "setApartmentRentals";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: []
};

const getters = {
  getApartmentRentals(state) {
    return state.list;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/apartment-rentals" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_APARTMENT_RENTALS,
            response.data.data.apartment_rentals
          );
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [TERMINATE](context, form) {
    return new Promise((resolve, reject) => {
      form
        .patch(`/admin/apartment-rentals/${form.id}/terminate`)
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
  [SET_APARTMENT_RENTALS](state, data) {
    state.list = data;
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
