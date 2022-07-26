import { serialize } from "object-to-formdata";
import ApiService from "@/core/services/api.service";

// action types
export const FETCH_ALL = "fetchAllSupportTickets";
export const SHOW = "fetchSupportTicket";
export const FETCH_REPLIES = "fetchSupportTicketReplies";
export const SHOW_REPLIES = "showSupportTicketReplies";
export const STORE_REPLY = "storeSupportTicketReply";

// mutation types
export const SET_SUPPORT_TICKETS = "seSupportTickets";
export const SET_SUPPORT_TICKET = "setSupportTicket";
export const SET_ERROR = "setErrors";

const state = {
  errors: null,
  list: [],
  support_ticket: null
};

const getters = {
  getSupportTickets(state) {
    return state.list;
  },
  getSupportTicket(state) {
    return state.support_ticket;
  }
};

const actions = {
  [FETCH_ALL](context, query) {
    return new Promise((resolve, reject) => {
      ApiService.get("/admin/support-tickets" + (query ? `?${query}` : ""))
        .then(response => {
          context.commit(
            SET_SUPPORT_TICKETS,
            response.data.data.support_tickets
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
      ApiService.get(`/admin/support-tickets/${id}`)
        .then(response => {
          context.commit(SET_SUPPORT_TICKET, response.data.data.support_ticket);
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [FETCH_REPLIES](context, id) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/support-tickets/${id}/replies`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [SHOW_REPLIES](context, { id, replyId }) {
    return new Promise((resolve, reject) => {
      ApiService.get(`/admin/support-tickets/${id}/replies/${replyId}`)
        .then(response => {
          resolve(response);
        })
        .catch(error => {
          context.commit(SET_ERROR, error);
          reject(error);
        });
    });
  },
  [STORE_REPLY](context, { id, form }) {
    return new Promise((resolve, reject) => {
      form
        .post(`/admin/support-tickets/${id}/replies`, {
          // Transform form data to FormData
          transformRequest: [
            function(data) {
              return serialize(data);
            }
          ]
        })
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
  [SET_SUPPORT_TICKETS](state, support_tickets) {
    state.list = support_tickets;
  },
  [SET_SUPPORT_TICKET](state, support_ticket) {
    state.support_ticket = support_ticket;
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
