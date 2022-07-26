import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllApartmentBookings";

// mutation types
export const SET_APARTMENT_BOOKINGS = "setApartmentBookings";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: []
};

const getters = {
  getApartmentBookings(state) {
    return state.list;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/apartment-bookings" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_APARTMENT_BOOKINGS,
            response.data.data.apartment_bookings
          );
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
  [SET_APARTMENT_BOOKINGS](state, data) {
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
