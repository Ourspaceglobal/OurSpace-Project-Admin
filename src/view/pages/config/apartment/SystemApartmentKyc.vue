<template>
  <div class="d-flex flex-row">
    <b-modal id="system-apartment-kyc-form" @hide="reset()" centered>
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " System Apartment KYC" }}</h5>
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

      <alert-success :form="form">
        System Apartment KYC saved successfully!
      </alert-success>

      <form
        class="form"
        @submit.stop.prevent="!form.id ? save() : update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Name">
          <b-form-input
            type="text"
            v-model="form.name"
            placeholder="E.g.; Valid ID card"
            :class="{ 'is-invalid': form.errors.has('name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="name"></has-error>
        </b-form-group>
        <b-form-group label="Description">
          <b-form-input
            type="text"
            v-model="form.description"
            placeholder="Enter something..."
            :class="{ 'is-invalid': form.errors.has('description') }"
            required
          ></b-form-input>
          <has-error :form="form" field="description"></has-error>
        </b-form-group>
        <b-form-group
          label="Required?"
          description="We'll make sure all tenants provide this during rentals"
        >
          <b-form-checkbox
            v-model="form.is_required"
            :class="{ 'is-invalid': form.errors.has('is_required') }"
            :unchecked-value="0"
            :value="1"
            switch
          ></b-form-checkbox>
          <has-error :form="form" field="is_primary"></has-error>
        </b-form-group>
        <b-form-select v-model="form.datatype_id" :options="datatypes">
          <template #first>
            <b-form-select-option value="" disabled>
              -- Please select a datatype --
            </b-form-select-option>
          </template>
        </b-form-select>
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
          :variant="!form.id ? 'primary' : 'success'"
          :disabled="form.busy"
          @click="!form.id ? save() : update()"
        >
          {{ !form.id ? "Save" : "Update" }}
        </b-button>
      </template>
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
              v-b-modal.system-apartment-kyc-form
              variant="primary"
              class="font-weight-bolder"
            >
              <b-icon icon="plus"></b-icon>
              New Record
            </b-button>
          </div>
        </div>

        <div class="card-body">
          <b-table
            id="system-apartment-kycs-table"
            :items="systemApartmentKycs"
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

            <template #cell(is_required)="data">
              <b-badge
                pill
                :variant="data.item.is_required ? 'primary' : 'warning'"
              >
                {{ data.item.is_required }}
              </b-badge>
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
            v-if="systemApartmentKycList && systemApartmentKycList.data"
            :link-gen="linkGen"
            :number-of-pages="systemApartmentKycList.last_page"
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
  STORE,
  UPDATE,
  DESTROY,
  RESTORE
} from "@/core/services/store/systemapartmentkyc.module";
import pagination from "@/core/mixins/pagination";
import ApiService from "@/core/services/api.service";

export default {
  name: "system-apartment-kycs",
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
          key: "description",
          label: "Description"
        },
        {
          key: "is_required",
          label: "Required?"
        },
        {
          key: "datatype.hint",
          label: "Datatype"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      datatypes: [],
      form: new this.$Form({
        id: "",
        name: "",
        description: "",
        datatype_id: "",
        is_required: 0
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
    fetchAllDatatypes() {
      ApiService.get("datatypes").then(response => {
        this.datatypes = response.data.data.datatypes.map(datatype => {
          return {
            value: datatype.id,
            text: `${datatype.hint} (${datatype.name})`
          };
        });
      });
    },
    save() {
      this.$store.dispatch(STORE, this.form).then(() => {
        this.reset();
        this.fetchAll();
      });
    },
    edit(systemApartmentKyc) {
      this.form.fill({
        id: systemApartmentKyc.id,
        name: systemApartmentKyc.name,
        description: systemApartmentKyc.description,
        datatype_id: systemApartmentKyc.datatype_id,
        is_required: systemApartmentKyc.is_required ? 1 : 0
      });
      this.$bvModal.show("system-apartment-kyc-form");
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("system-apartment-kyc-form");
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
      systemApartmentKycList: "getSystemApartmentKycs"
    }),
    systemApartmentKycs() {
      return this.systemApartmentKycList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "System Apartment KYCs" }]);
    this.fetchAllDatatypes();
  }
};
</script>
