<template>
  <div class="d-flex flex-row">
    <b-modal
      id="support-ticket-data"
      v-if="supportTicket"
      size="lg"
      @hide="reset"
      centered
      scrollable
    >
      <template #modal-header="{ close }">
        <h5>
          Support Ticket {{ supportTicket.reference }}
          <small>
            <b-badge :variant="supportTicket.is_open ? 'primary' : 'dark'" pill>
              {{ supportTicket.is_open ? "Open" : "Closed" }}
            </b-badge>
          </small>
        </h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <div class="mb-5">
        <h6>Subject</h6>
        {{ supportTicket.subject }}
      </div>

      <div class="mb-5">
        <h6>Message</h6>
        {{ supportTicket.message }}
      </div>

      <div class="mb-5" v-if="supportTicket.attachments">
        <h6>Attachments</h6>
        <b-list-group horizontal="sm">
          <b-list-group-item
            v-for="attachment in supportTicket.attachments"
            :key="attachment.uuid"
            :href="attachment.original_url"
            target="_blank"
          >
            {{ attachment.name }}
          </b-list-group-item>
        </b-list-group>
      </div>

      <div class="mb-5" v-if="supportTicket.replies_count > 0">
        <div>
          <b-button
            variant="primary"
            size="sm"
            @click="loadReplies(supportTicket.id)"
            v-if="!replies.length"
          >
            Load Replies
          </b-button>
          <h6 v-else>Replies</h6>
        </div>

        <b-list-group v-if="replies.length">
          <b-list-group-item
            v-for="reply in replies"
            :key="reply.id"
            class="flex-column align-items-start"
            :active="
              selectedSupportTicketReply &&
                selectedSupportTicketReply.id === reply.id
            "
          >
            <div
              class="d-flex w-100 justify-content-between mb-3 border-bottom"
            >
              <div>
                <small>
                  {{ $root.getReadableDate(reply.created_at) }}<br />
                  <span class="text-info"
                    >{{ reply.user.full_name }} [{{ reply.user_type }}]</span
                  >
                </small>
              </div>
              <b-button @click="loadAttachments(reply.id)" size="sm" squared>
                <b-icon icon="files"></b-icon>
                {{ reply.attachments_count }}
              </b-button>
            </div>

            <p class="mb-3 font-weight-bold">{{ reply.message }}</p>
            <div
              class=""
              v-if="
                selectedSupportTicketReply &&
                  selectedSupportTicketReply.id === reply.id &&
                  selectedSupportTicketReply.attachments
              "
            >
              <b-list-group horizontal="sm">
                <b-list-group-item
                  v-for="attachment in selectedSupportTicketReply.attachments"
                  :key="attachment.uuid"
                  :href="attachment.original_url"
                  target="_blank"
                >
                  {{ attachment.file_name }}
                </b-list-group-item>
              </b-list-group>
            </div>
          </b-list-group-item>
        </b-list-group>
      </div>

      <b-jumbotron>
        <b-form
          @submit.stop.prevent="sendReply()"
          @keydown="form.onKeydown($event)"
        >
          <h6>Send a reply</h6>
          <b-form-group>
            <b-form-textarea
              v-model="form.message"
              placeholder="Enter a message..."
              rows="3"
              max-rows="6"
              :class="{ 'is-invalid': form.errors.has('message') }"
              required
            ></b-form-textarea>
          </b-form-group>
          <b-form-group>
            <input type="file" @change="onFileChange($event)" multiple />
            <has-error :form="form" field="attachments"></has-error>
          </b-form-group>

          <b-button variant="primary" type="submit" :disabled="form.busy">
            Send
          </b-button>
        </b-form>
      </b-jumbotron>

      <template #modal-footer="{ cancel }">
        <b-button size="sm" @click="cancel()">
          Close
        </b-button>
      </template>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-body">
          <b-table
            id="support-tickets-table"
            :items="supportTickets"
            :fields="fields"
            :busy="isBusy"
            :tbody-tr-class="$root.bTableRowClass"
            bordered
            hover
            responsive
          >
            <template #table-busy>
              <div class="text-center text-info my-2">
                <b-spinner class="align-middle mr-3"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template #cell(index)="data">
              {{ data.index + 1 }}
              <sup v-if="data.item.is_awaiting_reply" title="Awaiting reply">
                <b-icon
                  icon="circle-fill"
                  animation="throb"
                  variant="danger"
                  font-scale="0.5"
                ></b-icon>
              </sup>
            </template>

            <template #cell(is_open)="data">
              <b-badge :variant="data.item.is_open ? 'primary' : 'dark'" pill>
                {{ data.item.is_open ? "Open" : "Closed" }}
              </b-badge>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Open"
                @click="show(data.item.id)"
              >
                <b-icon icon="eye" variant="primary"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="supportTicketList && supportTicketList.data"
            :link-gen="linkGen"
            :number-of-pages="supportTicketList.last_page"
            first-text="First"
            prev-text="Prev"
            next-text="Next"
            last-text="Last"
            limit="10"
            last-number
            use-router
          ></b-pagination-nav>
        </div>
      </div>
    </div>
    <!--end::Content-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_ALL,
  SHOW,
  FETCH_REPLIES,
  SHOW_REPLIES,
  STORE_REPLY
} from "@/core/services/store/supportticket.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "support-tickets",
  mixins: [pagination],
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "user.full_name",
          label: "Name"
        },
        {
          key: "reference",
          label: "Reference"
        },
        {
          key: "subject",
          label: "Subject"
        },
        {
          key: "is_open",
          label: "Status"
        },
        {
          key: "replies_count",
          label: "Replies"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        message: "",
        attachments: []
      }),
      replies: [],
      selectedSupportTicketReply: null,
      query: "include=user&sort=-is_open,-updated_at"
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    show(id) {
      this.$store
        .dispatch(SHOW, id)
        .then(() => this.$bvModal.show("support-ticket-data"));
    },
    loadReplies(id) {
      this.$store.dispatch(FETCH_REPLIES, id).then(response => {
        this.replies = response.data.data.support_ticket_replies;
      });
    },
    loadAttachments(id) {
      this.selectedSupportTicketReply = null;

      this.$store
        .dispatch(SHOW_REPLIES, {
          id: this.supportTicket.id,
          replyId: id
        })
        .then(response => {
          this.selectedSupportTicketReply =
            response.data.data.support_ticket_reply;
        });
    },
    onFileChange(event) {
      this.form.attachments = event.target.files;
    },
    sendReply() {
      this.$store
        .dispatch(STORE_REPLY, {
          id: this.supportTicket.id,
          form: this.form
        })
        .then(() => {
          this.reset();
          this.loadReplies(this.supportTicket.id);
          this.fetchAll();
        });
    },
    reset() {
      this.form.reset();
      this.replies = [];
      this.selectedSupportTicketReply = null;
    }
  },
  computed: {
    ...mapGetters({
      supportTicketList: "getSupportTickets",
      supportTicket: "getSupportTicket"
    }),
    supportTickets() {
      return this.supportTicketList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Support Tickets" }]);
  }
};
</script>
