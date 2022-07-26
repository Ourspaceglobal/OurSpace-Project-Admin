<template>
  <div class="d-flex flex-row">
    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="mb-5">
        <alert-errors :form="form"
          >There are errors with your input.</alert-errors
        >

        <b-form
          @submit.stop.prevent="!form.id ? save() : update()"
          @keydown="form.onKeydown($event)"
        >
          <b-input-group>
            <b-form-input
              type="text"
              v-model="form.period"
              placeholder="Enter the period, e,g,; night"
              :class="{ 'is-invalid': form.errors.has('period') }"
              required
            ></b-form-input>
            <b-form-input
              type="number"
              v-model="form.duration_in_days"
              placeholder="Number of days"
              :class="{ 'is-invalid': form.errors.has('duration_in_days') }"
              required
            ></b-form-input>
            <b-input-group-append>
              <b-button
                type="reset"
                variant="dark"
                @click="reset()"
                v-if="form.id"
              >
                Reset
              </b-button>
              <b-button
                type="submit"
                :variant="!form.id ? 'primary' : 'success'"
              >
                {{ !form.id ? "Save" : "Update" }}
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <b-form-text text-variant="info" v-html="example"></b-form-text>
        </b-form>
      </div>

      <b-card>
        <b-table
          id="apartment-durations-table"
          :items="apartmentDurations"
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

          <template #cell(actions)="data">
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
      </b-card>
    </div>
    <!--end::Content-->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_ALL,
  STORE,
  UPDATE,
  DESTROY,
  RESTORE
} from "@/core/services/store/apartmentduration.module";

export default {
  name: "apartment-durations",
  data() {
    return {
      isBusy: false,
      fields: [
        {
          key: "index",
          label: "#"
        },
        {
          key: "period",
          label: "Period"
        },
        {
          key: "duration_in_days",
          label: "Duration in Days"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        period: "",
        duration_in_days: null
      }),
      query: "filter[trashed]=with"
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    save() {
      this.$store.dispatch(STORE, this.form).then(() => {
        this.reset();
        this.fetchAll();
      });
    },
    edit(apartmentDuration) {
      this.form.fill(apartmentDuration);
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
      });
    },
    destroy(id) {
      this.$store.dispatch(DESTROY, id).then(() => {
        this.fetchAll();
      });
    },
    restore(id) {
      this.$store.dispatch(RESTORE, id).then(() => {
        this.fetchAll();
      });
    },
    reset() {
      this.form.reset();
      this.form.clear();
    }
  },
  computed: {
    ...mapGetters({
      apartmentDurations: "getApartmentDurations"
    }),
    example() {
      return this.form.period
        ? `Apartment A will rent at <b>X.XX per ${this.form.period}</b>
         and billed every <b>${this.form.duration_in_days} day(s)</b>`
        : null;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Apartment Durations" }]);
    this.fetchAll();
  }
};
</script>
