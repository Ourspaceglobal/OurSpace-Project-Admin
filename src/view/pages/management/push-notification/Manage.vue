<template>
  <div class="d-flex flex-row">
    <b-modal
      id="push-notification-data"
      v-if="pushNotification"
      size="xl"
      scrollable
      centered
    >
      <template #modal-header="{ close }">
        <h5>Push Notification</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <div class="border-bottom mb-5 pb-5">
        <div class="font-weight-bold mb-3">
          Subject
        </div>
        <div class="line-height-md">
          {{ pushNotification.subject }}
        </div>
      </div>
      <div class="border-bottom mb-5 pb-5">
        <div class="font-weight-bold mb-3">
          Message
        </div>
        <div class="line-height-md">
          <span v-html="pushNotification.message"></span>
        </div>
      </div>
      <div class="border-bottom mb-5 pb-5">
        <div class="font-weight-bold mb-3">
          Users
        </div>
        <div class="line-height-md">
          {{
            pushNotification.user_ids[0] === "*"
              ? "All Tenants & Landlords"
              : pushNotification.user_ids.length
          }}
        </div>
      </div>
      <div class="mb-5 pb-5">
        <div class="font-weight-bold mb-3">
          Settings
        </div>
        <div class="line-height-md">
          <p>
            Send via mail: {{ pushNotification.send_via_mail ? "Yes" : "No" }}
          </p>
          <p>
            Send through system:
            {{ pushNotification.send_via_system ? "Yes" : "No" }}
          </p>
          <p>
            Send date &amp; time:
            {{ $root.getReadableDate(pushNotification.send_at) }}
          </p>
        </div>
      </div>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-header flex-wrap border-0 pt-6 pb-0">
          <div class="card-title">
            <h3 class="card-label">
              <span class="d-block text-muted pt-2 font-size-sm">
                <!--  -->
              </span>
            </h3>
          </div>
          <div class="card-toolbar">
            <b-button
              variant="primary"
              class="font-weight-bolder"
              :to="{ name: 'new-push-notification' }"
            >
              <b-icon icon="plus"></b-icon>
              New Record
            </b-button>
          </div>
        </div>
        <div class="card-body">
          <b-table
            id="push-notification-table"
            :items="pushNotifications"
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
            </template>

            <template #cell(send_at)="data">
              {{ $root.getReadableDate(data.item.send_at) }}
            </template>

            <template #cell(is_sent)="data">
              <b-badge
                class="badge"
                :class="data.item.is_sent ? 'badge-success' : 'badge-warning'"
                pill
              >
                {{ data.item.is_sent ? "sent" : "not yet" }}
              </b-badge>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="View push notification"
                v-if="!data.item.deleted_at"
                @click="show(data.item.id)"
              >
                <b-icon icon="eye" variant="dark"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Edit details"
                v-if="!data.item.deleted_at"
                @click="edit(data.item)"
              >
                <b-icon icon="pencil" variant="primary"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Delete"
                v-if="!data.item.deleted_at"
                @click="destroy(data.item.id)"
              >
                <b-icon icon="trash" variant="danger"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Restore"
                v-if="data.item.deleted_at"
                @click="restore(data.item.id)"
              >
                <b-icon icon="bootstrap-reboot" variant="success"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="pushNotificationList && pushNotificationList.data"
            :link-gen="linkGen"
            :number-of-pages="pushNotificationList.last_page"
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
  DESTROY,
  SET_PUSHNOTIFICATION,
  RESTORE
} from "@/core/services/store/pushnotification.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "push-notifications",
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
          key: "subject",
          label: "Subject"
        },
        {
          key: "admin.full_name",
          label: "Composed by Admin"
        },
        {
          key: "is_sent",
          label: "Sent Status"
        },
        {
          key: "send_at",
          label: "Send Date"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      query: "filter[trashed]=with&include=admin"
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    edit(pushNotification) {
      this.$store.commit(SET_PUSHNOTIFICATION, pushNotification);
      this.$router.push({
        name: "new-push-notification",
        params: { push_notification: pushNotification.id }
      });
    },
    show(id) {
      this.$store
        .dispatch(SHOW, id)
        .then(() => this.$bvModal.show("push-notification-data"));
    },
    destroy(id) {
      this.$store
        .dispatch(DESTROY, id)
        .then(() => {
          this.fetchAll();
        })
        .catch(error => {
          this.$bvModal.msgBoxOk(error.response.data.message, {
            title: "Error",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
        });
    },
    restore(id) {
      this.$store
        .dispatch(RESTORE, id)
        .then(() => {
          this.fetchAll();
        })
        .catch(error => {
          this.$bvModal.msgBoxOk(error.response.data.message, {
            title: "Error",
            size: "sm",
            buttonSize: "sm",
            okVariant: "danger",
            headerClass: "p-2 border-bottom-0",
            footerClass: "p-2 border-top-0",
            centered: true
          });
        });
    }
  },
  computed: {
    ...mapGetters({
      pushNotificationList: "getPushNotifications",
      pushNotification: "getPushNotification"
    }),
    pushNotifications() {
      return this.pushNotificationList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Push Notifications" }]);
  }
};
</script>
