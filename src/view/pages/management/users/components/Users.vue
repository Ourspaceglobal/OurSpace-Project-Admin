<template>
  <div class="d-flex flex-row">
    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-body">
          <b-table
            id="users-table"
            :items="users"
            :fields="fields"
            :busy="isBusy"
            :tbody-tr-class="$root.bTableRowClass"
            @sort-changed="sortingChanged"
            no-local-sorting
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

            <template #cell(first_name)="data">
              {{ data.item.full_name }}
            </template>

            <template #cell(email)="data">
              <a :href="'mailto:' + data.item.email">{{ data.item.email }}</a>
            </template>

            <template #cell(phone_number)="data">
              <a :href="'tel:' + data.item.phone_number">
                {{ data.item.phone_number }}
              </a>
            </template>

            <template #cell(wallet_balance)="data">
              ₦{{ data.item.wallet_balance | number_format }}
            </template>

            <template #cell(temp_wallet_balance)="data">
              ₦{{ data.item.temp_wallet_balance | number_format }}
            </template>

            <template #cell(is_blocked)="data">
              <b-form-checkbox
                :checked="data.item.is_blocked"
                @change="toggleBlockedStatus(data.item.id)"
                :disabled="data.item.deleted_at !== null"
                switch
              ></b-form-checkbox>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Open"
                @click="$refs.userData.showUser(data.item.id)"
              >
                <b-icon icon="eye" variant="primary"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="userList && userList.data"
            :link-gen="linkGen"
            :number-of-pages="userList.last_page"
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

    <user-data ref="userData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  FETCH_ALL,
  TOGGLE_BLOCKED_STATUS
} from "@/core/services/store/user.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";
import UserData from "@/view/content/widgets/UserData";

export default {
  mixins: [pagination, sorting],
  props: {
    user_type: {
      type: String,
      required: true
    }
  },
  components: {
    "user-data": UserData
  },
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "first_name",
          label: "Name",
          sortable: true
        },
        {
          key: "email",
          label: "Email address",
          sortable: true
        },
        {
          key: "phone_number",
          label: "Phone number",
          sortable: true
        },
        {
          key: "wallet_balance",
          label: "Wallet Balance",
          sortable: true
        },
        {
          key: "temp_wallet_balance",
          label: "Temp. Wallet Balance",
          sortable: true
        },
        {
          key: "is_blocked",
          label: "Blocked Status",
          sortable: true
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      userFields: [
        {
          key: "finder",
          label: "Finder"
        },
        {
          key: "first_name",
          label: "First Name"
        },
        {
          key: "last_name",
          label: "Last Name"
        },
        {
          key: "email",
          label: "Email address"
        },
        {
          key: "email_verified_at",
          label: "Email Verified"
        },
        {
          key: "phone_number",
          label: "Phone number"
        },
        {
          key: "type",
          label: "Type"
        },
        {
          key: "wallet_balance",
          label: "Wallet Balance"
        },
        {
          key: "is_blocked",
          label: "Blocked Status"
        },
        {
          key: "is_2fa_active",
          label: "Two-factor Authentication Status"
        },
        {
          key: "created_at",
          label: "Joined"
        },
        {
          key: "updated_at",
          label: "Last Updated"
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
    toggleBlockedStatus(id) {
      this.$store.dispatch(TOGGLE_BLOCKED_STATUS, id).then(() => {
        this.fetchAll();
      });
    }
  },
  computed: {
    ...mapGetters({
      userList: "getUsers"
    }),
    users() {
      return this.userList.data;
    }
  },
  created() {
    this.query = `filter[type]=${this.user_type}`;
  }
};
</script>
