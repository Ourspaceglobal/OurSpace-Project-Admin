<template>
  <div class="d-flex flex-row">
    <b-modal id="declination-form" centered>
      <template #modal-header="{ close }">
        <h5>Decline Wallet Funding Request</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <form
        class="form"
        @submit.stop.prevent="decline()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Reason">
          <b-form-textarea
            v-model="form.reason"
            placeholder="Why are you declining?"
            rows="3"
            max-rows="6"
            :class="{ 'is-invalid': form.errors.has('reason') }"
            required
          ></b-form-textarea>
          <has-error :form="form" field="reason"></has-error>
        </b-form-group>
      </form>

      <template #modal-footer="{ cancel }">
        <b-button
          size="sm"
          variant="danger"
          @click="
            cancel();
            reset();
          "
        >
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          :disabled="form.busy"
          @click="decline()"
        >
          Save
        </b-button>
      </template>
    </b-modal>

    <b-modal
      id="wallet-funding-request-data"
      v-if="walletFundingRequest"
      size="lg"
      scrollable
      centered
    >
      <template #modal-header="{ close }">
        <h5>Wallet Funding Request</h5>
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
        Amount:
        <h1>₦{{ walletFundingRequest.amount | number_format }}</h1>
      </div>

      <div class="mb-5">
        <h6>User</h6>
        <span class="text-muted">Name: </span>
        {{ walletFundingRequest.user.full_name }}<br />
        <span class="text-muted">Email: </span>
        {{ walletFundingRequest.user.email }}<br />
        <span class="text-muted">Phone: </span>
        {{ walletFundingRequest.user.phone_number }}<br />
      </div>

      <div class="mb-5" v-if="walletFundingRequest.declination_reason">
        <h6>Declination Reason</h6>
        {{ walletFundingRequest.declination_reason }}
      </div>

      <div class="mb-5" v-if="walletFundingRequest.proof_of_payment">
        <h6>Proof of Payment</h6>
        <b-button-group>
          <b-button
            variant="outline-primary"
            v-for="proof_of_payment in walletFundingRequest.proof_of_payment"
            :key="proof_of_payment.uuid"
            :href="proof_of_payment.original_url"
            target="_blank"
          >
            {{ proof_of_payment.name }}
          </b-button>
        </b-button-group>
      </div>

      <div class="mb-5" v-if="walletFundingRequest.created_at">
        <h6>Date Created</h6>
        {{ $root.getReadableDate(walletFundingRequest.created_at, "llll") }}
      </div>

      <div class="mb-5" v-if="walletFundingRequest.created_at">
        <h6>Last Modified Date</h6>
        {{ $root.getReadableDate(walletFundingRequest.updated_at, "llll") }}
      </div>

      <template #modal-footer="{ cancel }">
        <b-button size="sm" @click="cancel()">
          Close
        </b-button>
        <b-button
          size="sm"
          variant="success"
          @click="approve(walletFundingRequest.id)"
          v-if="walletFundingRequest.status === 'pending'"
        >
          Approve
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="openDeclinationForm(walletFundingRequest)"
          v-if="walletFundingRequest.status === 'pending'"
        >
          Decline
        </b-button>
      </template>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="card card-custom">
        <div class="card-body">
          <b-table
            id="wallet-funding-requests-table"
            :items="walletFundingRequests"
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

            <template #cell(user)="data">
              <b-button
                variant="link"
                class="p-0 text-left text-primary"
                @click="$refs.userData.showUser(data.item.user.id)"
              >
                {{ data.item.user.full_name }}
              </b-button>
            </template>

            <template #cell(amount)="data">
              ₦{{ data.item.amount | number_format }}
            </template>

            <template #cell(status)="data">
              <b-badge
                class="badge"
                :class="{
                  'badge-warning': data.item.status === 'pending',
                  'badge-dark': data.item.status === 'closed',
                  'badge-success': data.item.status === 'approved',
                  'badge-danger': data.item.status === 'declined'
                }"
                pill
              >
                {{ data.item.status }}
              </b-badge>
            </template>

            <template #cell(created_at)="data">
              {{ $root.getReadableDate(data.item.created_at, "llll") }}
            </template>

            <template #cell(updated_at)="data">
              {{ $root.getReadableDate(data.item.updated_at, "llll") }}
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
            v-if="walletFundingRequestList && walletFundingRequestList.data"
            :link-gen="linkGen"
            :number-of-pages="walletFundingRequestList.last_page"
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
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_ALL,
  SHOW,
  DECLINE,
  APPROVE
} from "@/core/services/store/walletfundingrequest.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";
import UserData from "@/view/content/widgets/UserData";

export default {
  name: "wallet-funding-requests",
  mixins: [pagination, sorting],
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
          key: "user",
          label: "Name"
        },
        {
          key: "amount",
          label: "Amount",
          sortable: true
        },
        {
          key: "status",
          label: "Status",
          sortable: true
        },
        {
          key: "created_at",
          label: "Date Created",
          sortable: true
        },
        {
          key: "updated_at",
          label: "Last Modified Date",
          sortable: true
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        reason: ""
      }),
      query: "include=user"
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
        .then(() => this.$bvModal.show("wallet-funding-request-data"));
    },
    openDeclinationForm(walletFundingRequest) {
      this.form.fill({
        id: walletFundingRequest.id
      });
      this.$bvModal.show("declination-form");
    },
    decline() {
      this.$store.dispatch(DECLINE, this.form).then(() => {
        this.show(this.form.id);
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("declination-form");
      });
    },
    approve(id) {
      this.$store.dispatch(APPROVE, id).then(() => {
        this.show(id);
        this.fetchAll();
      });
    },
    reset() {
      this.form.reset();
    }
  },
  computed: {
    ...mapGetters({
      walletFundingRequestList: "getWalletFundingRequests",
      walletFundingRequest: "getWalletFundingRequest"
    }),
    walletFundingRequests() {
      return this.walletFundingRequestList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [
      { title: "Wallet Funding Requests" }
    ]);
  }
};
</script>
