import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllStatistics";

// mutation types
export const SET_STATISTICS = "setStatistics";

const state = {
  statistics: []
};

const getters = {
  getStatistics(state) {
    return state.statistics;
  },
  getStatisticsFor: state => stat => {
    return state.statistics[`${stat}`] ? state.statistics[`${stat}`][0] : null;
  }
};

const actions = {
  [FETCH_ALL](context) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/statistics")
        .then(response => {
          context.commit(SET_STATISTICS, response.data.data.statistics);
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  [SET_STATISTICS](state, statistics) {
    state.statistics = statistics;
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
