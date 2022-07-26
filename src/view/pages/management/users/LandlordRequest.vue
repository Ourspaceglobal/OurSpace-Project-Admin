<template>
  <div class="d-flex flex-row">
    <b-modal id="declination-form" centered>
      <template #modal-header="{ close }">
        <h5>Decline Landlord Request</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="
            close();
            reset();
          "
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

    <b-modal id="landlord-request-data" v-if="landlordRequest" centered>
      <template #modal-header="{ close }">
        <h5>
          Landlord Request
          <b-badge
            class="ml-4 badge"
            :class="{
              'badge-warning': landlordRequest.status === 'pending',
              'badge-dark': landlordRequest.status === 'closed',
              'badge-success': landlordRequest.status === 'approved',
              'badge-danger': landlordRequest.status === 'declined'
            }"
            pill
          >
            {{ landlordRequest.status }}
          </b-badge>
        </h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="
            close();
            reset();
          "
        >
          ×
        </b-button>
      </template>

      <div class="mb-5">
        <h6>User</h6>
        <span class="text-muted">Name: </span>
        {{ landlordRequest.user.full_name }}<br />
        <span class="text-muted">Email: </span>
        {{ landlordRequest.user.email }}<br />
        <span class="text-muted">Phone: </span>
        {{ landlordRequest.user.phone_number }}<br />
      </div>

      <div class="mb-5">
        <h6>Note</h6>
        {{ landlordRequest.note }}
      </div>

      <div class="mb-5">
        <h6>National Identity Number</h6>
        {{ landlordRequest.national_identity_number }}
      </div>

      <div class="mb-5" v-if="landlordRequest.declination_reason">
        <h6>Declination Reason</h6>
        {{ landlordRequest.declination_reason }}
      </div>

      <div class="mb-5" v-if="landlordRequest.kycs">
        <h6>KYC</h6>
        <b-button-group>
          <b-button
            variant="outline-primary"
            v-for="kyc in landlordRequest.kycs"
            :key="kyc.uuid"
            :href="kyc.original_url"
            target="_blank"
          >
            {{ kyc.name }}
          </b-button>
        </b-button-group>
      </div>

      <div class="mb-5" v-if="landlordRequest.created_at">
        <h6>Date Created</h6>
        {{ $root.getReadableDate(landlordRequest.created_at, "llll") }}
      </div>

      <div class="mb-5" v-if="landlordRequest.created_at">
        <h6>Last Modified Date</h6>
        {{ $root.getReadableDate(landlordRequest.updated_at, "llll") }}
      </div>

      <template #modal-footer="{ cancel }">
        <b-button size="sm" @click="cancel()">
          Close
        </b-button>
        <b-button
          size="sm"
          variant="success"
          @click="approve(landlordRequest.id)"
          v-if="landlordRequest.status === 'pending'"
        >
          Accept
        </b-button>
        <b-button
          size="sm"
          variant="danger"
          @click="openDeclinationForm(landlordRequest)"
          v-if="landlordRequest.status === 'pending'"
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
            id="landlord-requests-table"
            :items="landlordRequests"
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

            <template #cell(user)="data">
              <b-button
                variant="link"
                class="p-0 text-left text-primary"
                @click="$refs.userData.showUser(data.item.user.id)"
              >
                {{ data.item.user.full_name }}
              </b-button>
            </template>

            <template #cell(created_at)="data">
              {{ $root.getReadableDate(data.item.created_at, "llll") }}
            </template>

            <template #cell(updated_at)="data">
              {{ $root.getReadableDate(data.item.updated_at, "llll") }}
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
            v-if="landlordRequestList && landlordRequestList.data"
            :link-gen="linkGen"
            :number-of-pages="landlordRequestList.last_page"
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
} from "@/core/services/store/landlordrequest.module";
import pagination from "@/core/mixins/pagination";
import UserData from "@/view/content/widgets/UserData";

export default {
  name: "landlord-requests",
  mixins: [pagination],
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
          key: "note",
          label: "Note"
        },
        {
          key: "national_identity_number",
          label: "National Identity Number"
        },
        {
          key: "status",
          label: "Status"
        },
        {
          key: "created_at",
          label: "Date Created"
        },
        {
          key: "updated_at",
          label: "Last Modified Date"
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
        .then(() => this.$bvModal.show("landlord-request-data"));
    },
    openDeclinationForm(landlordRequest) {
      this.form.fill({
        id: landlordRequest.id
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
      landlordRequestList: "getLandlordRequests",
      landlordRequest: "getLandlordRequest"
    }),
    landlordRequests() {
      return this.landlordRequestList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Landlord Requests" }]);
  }
};
</script>
