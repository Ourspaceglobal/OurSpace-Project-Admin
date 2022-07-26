<template>
  <div class="d-flex flex-row">
    <!--begin::Content-->
    <div class="flex-row-fluid">
      <div class="mb-5">
        <form
          class="form"
          @submit.stop.prevent="!form.id ? save() : update()"
          @keydown="form.onKeydown($event)"
        >
          <b-input-group>
            <b-form-input
              type="text"
              v-model="form.name"
              placeholder="Enter the state name"
              :class="{ 'is-invalid': form.errors.has('name') }"
              required
            ></b-form-input>
            <b-input-group-append>
              <b-button
                type="reset"
                variant="dark"
                @click="reset"
                v-if="form.id"
                >Reset</b-button
              >
              <b-button
                type="submit"
                :variant="!form.id ? 'primary' : 'success'"
              >
                {{ !form.id ? "Save" : "Update" }}
              </b-button>
            </b-input-group-append>
          </b-input-group>
          <has-error :form="form" field="name"></has-error>
        </form>
      </div>

      <b-card>
        <b-table
          id="states-table"
          :items="states"
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

        <b-pagination-nav
          v-if="statesList && statesList.data"
          :link-gen="linkGen"
          :number-of-pages="statesList.last_page"
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
} from "@/core/services/store/locations/state.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "states",
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
          key: "name",
          label: "Name"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        name: ""
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
    edit(state) {
      this.form.fill(state);
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
    }
  },
  computed: {
    ...mapGetters({
      statesList: "getStates"
    }),
    states() {
      return this.statesList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "States" }]);
  }
};
</script>
