<template>
  <div class="flex-row-fluid">
    <div class="card card-custom">
      <div class="card-body">
        <b-table
          id="apartment-table"
          :items="apartments"
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

          <template #cell(price)="data">
            ₦{{ data.item.price | number_format }}
          </template>

          <template #cell(created_at)="data">
            {{ $root.getReadableDate(data.item.created_at, "llll") }}
          </template>

          <template #cell(updated_at)="data">
            {{ $root.getReadableDate(data.item.updated_at, "llll") }}
          </template>

          <template #cell(duration)="data">
            {{ data.item.apartment_duration.duration_in_days }}
          </template>

          <template #cell(is_verified)="data">
            <b-form-checkbox
              :checked="data.item.is_verified"
              @change="toggleVerifiedStatus(data.item.id)"
              :disabled="data.item.deleted_at !== null"
              switch
            ></b-form-checkbox>
          </template>

          <template #cell(actions)="data">
            <b-button
              variant="link"
              size="sm"
              class="btn-clean btn-icon mr-2"
              title="Open"
              :to="{
                name: 'single-apartment',
                params: { apartment: data.item.slug }
              }"
            >
              <b-icon icon="eye" variant="primary"></b-icon>
            </b-button>
          </template>
        </b-table>

        <b-pagination-nav
          v-if="apartmentList && apartmentList.data"
          :link-gen="linkGen"
          :number-of-pages="apartmentList.last_page"
          first-text="First"
          prev-text="Prev"
          next-text="Next"
          last-text="Last"
          limit="10"
          last-number
          use-router
        ></b-pagination-nav>

        <user-data ref="userData" />
      </div>
    </div>
  </div>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";
import {
  FETCH_ALL,
  TOGGLE_VERIFIED_STATUS
} from "@/core/services/store/apartment.module";
import { mapGetters } from "vuex";
import UserData from "@/view/content/widgets/UserData";

export default {
  name: "apartments",
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
          label: "Landlord"
        },
        {
          key: "name",
          label: "Name",
          sortable: true
        },
        {
          key: "price",
          label: "Price",
          sortable: true
        },
        {
          key: "duration",
          label: "Duration (days)"
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
          key: "is_verified",
          label: "Verification Status",
          sortable: true
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      query: "filter[trashed]=with&include=category,user,apartmentDuration"
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    toggleVerifiedStatus(id) {
      this.$store.dispatch(TOGGLE_VERIFIED_STATUS, id).then(() => {
        this.fetchAll();
      });
    }
  },
  computed: {
    ...mapGetters({
      apartmentList: "getApartments"
    }),
    apartments() {
      return this.apartmentList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Apartments" }]);
  }
};
</script>
