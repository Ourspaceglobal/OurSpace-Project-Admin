<template>
  <div class="d-flex flex-row">
    <b-modal
      id="termination-form"
      v-if="selectedApartmentRental"
      @hide="reset()"
      centered
    >
      <template #modal-header="{ close }">
        <h5>
          Terminate {{ selectedApartmentRental.user.full_name }}'s Rental for
          {{ selectedApartmentRental.apartment.name }}
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

      <form
        class="form"
        @submit.stop.prevent="terminate()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Reason">
          <b-form-textarea
            v-model="form.reason"
            placeholder="Why are you terminating this rental?"
            rows="3"
            max-rows="6"
            :class="{ 'is-invalid': form.errors.has('reason') }"
            required
          ></b-form-textarea>
          <has-error :form="form" field="reason"></has-error>
        </b-form-group>
      </form>

      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancel
        </b-button>
        <b-button
          size="sm"
          variant="primary"
          :disabled="form.busy"
          @click="terminate()"
        >
          Terminate Rental
        </b-button>
      </template>
    </b-modal>

    <!--begin::Content-->
    <div class="flex-row-fluid">
      <b-card>
        <b-table
          id="rentals-table"
          :items="rentals"
          :fields="fields"
          :busy="isBusy"
          :tbody-tr-class="rowClass"
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

          <template #cell(is_active)="data">
            <b-badge
              class="badge"
              :class="{
                'badge-success': data.item.is_active === true,
                'badge-warning': data.item.is_active === false
              }"
              pill
            >
              {{ data.item.is_active === true ? "Active" : "Inactive" }}
            </b-badge>
          </template>

          <template #cell(apartment)="data">
            <router-link
              :to="{
                name: 'single-apartment',
                params: { apartment: data.item.apartment.slug }
              }"
              class=""
            >
              {{ data.item.apartment.name }}
            </router-link>
          </template>

          <template #cell(started_at)="data">
            {{ $root.getReadableDate(data.item.started_at, "llll") }}
          </template>

          <template #cell(expired_at)="data">
            {{ $root.getReadableDate(data.item.expired_at, "llll") }}
          </template>

          <template #cell(check_in_date)="data">
            {{ $root.getReadableDate(data.item.check_in_date, "llll") }}
          </template>

          <template #cell(check_out_date)="data">
            {{ $root.getReadableDate(data.item.check_out_date, "llll") }}
          </template>

          <template #cell(terminated_at)="data">
            {{ $root.getReadableDate(data.item.terminated_at, "llll") }}
          </template>

          <template #cell(actions)="data">
            <button
              class="btn btn-sm btn-clean btn-icon mr-2"
              title="Terminate"
              v-if="!data.item.terminated_at"
              @click="openTerminationForm(data.item)"
              :disabled="!data.item.is_active"
            >
              <b-icon icon="x" variant="danger"></b-icon>
            </button>
          </template>
        </b-table>

        <b-pagination-nav
          v-if="rentalsList && rentalsList.data"
          :link-gen="linkGen"
          :number-of-pages="rentalsList.last_page"
          first-text="First"
          prev-text="Prev"
          next-text="Next"
          last-text="Last"
          limit="10"
          last-number
          use-router
        ></b-pagination-nav>
      </b-card>
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
  TERMINATE
} from "@/core/services/store/apartmentrental.module";
import pagination from "@/core/mixins/pagination";
import UserData from "@/view/content/widgets/UserData";

export default {
  name: "apartment-rentals",
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
          label: "User"
        },
        {
          key: "apartment",
          label: "Apartment"
        },
        {
          key: "is_active",
          label: "Status"
        },
        {
          key: "started_at",
          label: "Start Date"
        },
        {
          key: "expired_at",
          label: "Expiry Date"
        },
        {
          key: "check_in_date",
          label: "Check-In Date"
        },
        {
          key: "check_out_date",
          label: "Check-Out Date"
        },
        {
          key: "terminated_at",
          label: "Termination Date"
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
      selectedApartmentRental: null,
      query: "include=user,apartment,paymentTransaction"
    };
  },
  methods: {
    rowClass(item, type) {
      this.$root.bTableRowClass(item, type);
      if (item?.is_active) return "table-success";
    },
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    openTerminationForm(apartmentRental) {
      if (!apartmentRental.is_active) {
        this.$bvModal.msgBoxOk("Rental is not even active!", {
          title: "Warning",
          size: "sm",
          buttonSize: "sm",
          okVariant: "warning",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true
        });

        return;
      }

      this.selectedApartmentRental = apartmentRental;

      this.form.fill({
        id: apartmentRental.id
      });
      this.$bvModal.show("termination-form");
    },
    terminate() {
      this.$store
        .dispatch(TERMINATE, this.form)
        .then(() => {
          this.reset();
          this.fetchAll();
          this.$bvModal.hide("termination-form");
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
    reset() {
      this.form.reset();
    }
  },
  computed: {
    ...mapGetters({
      rentalsList: "getApartmentRentals"
    }),
    rentals() {
      return this.rentalsList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Apartment Rentals" }]);
  }
};
</script>
