<template>
  <div class="d-flex flex-row">
    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-body">
          <b-table
            id="notifications-table"
            :items="notifications"
            :fields="fields"
            :busy="isBusy"
            :tbody-tr-class="$root.bTableRowClass"
            @sort-changed="sortingChanged"
            no-local-sorting
            bordered
            caption-top
            responsive
          >
            <template #table-caption>
              <b-button variant="success" size="sm" @click="readAll">
                Mark All as Read
              </b-button>
            </template>

            <template #table-busy>
              <div class="text-center text-info my-2">
                <b-spinner class="align-middle mr-3"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>

            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(message)="data">
              <b-icon
                :icon="
                  data.item.data.status ? 'hand-thumbs-up' : 'hand-thumbs-down'
                "
                :variant="data.item.data.status ? 'primary' : 'danger'"
                class="mr-2"
              ></b-icon>
              {{ data.item.data.message }}
            </template>

            <template #cell(read_at)="data">
              {{ $root.getReadableDate(data.item.read_at, "llll") }}
            </template>

            <template #cell(created_at)="data">
              {{ $root.getReadableDate(data.item.created_at, "llll") }}
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Mark as read"
                @click="read(data.item.id)"
                v-if="!data.item.read_at"
              >
                <b-icon icon="envelope-open" variant="success"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="notificationList && notificationList.data"
            :link-gen="linkGen"
            :number-of-pages="notificationList.last_page"
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
  READ,
  READ_ALL
} from "@/core/services/store/mynotification.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";

export default {
  name: "my-notifications",
  mixins: [pagination, sorting],
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "message",
          label: "Message"
        },
        {
          key: "read_at",
          label: "Read Date",
          sortable: true
        },
        {
          key: "created_at",
          label: "Created Date",
          sortable: true
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      query: ""
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    read(id) {
      this.$store.dispatch(READ, id).then(() => {
        this.fetchAll();
      });
    },
    readAll() {
      this.$store.dispatch(READ_ALL).then(() => {
        this.fetchAll();
      });
    }
  },
  computed: {
    ...mapGetters({
      notificationList: "getMyNotifications"
    }),
    notifications() {
      return this.notificationList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "My Notifications" }]);
  }
};
</script>
