<template>
  <div class="d-flex flex-row">
    <b-modal id="amenity-form" @hide="reset()" centered>
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " Amenity" }}</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="
            close();
            reset();
          "
          >×</b-button
        >
      </template>

      <alert-success :form="form">Amenity saved successfully!</alert-success>

      <form
        class="form"
        @submit.stop.prevent="!form.id ? save() : update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Name">
          <b-form-input
            type="text"
            v-model="form.name"
            placeholder="E.g.; Swimming pool"
            :class="{ 'is-invalid': form.errors.has('name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="name"></has-error>
        </b-form-group>
        <b-form-group
          label="Primary Status"
          description="We'll make sure landlords provide data for the amenity"
        >
          <b-form-checkbox
            v-model="form.is_primary"
            :class="{ 'is-invalid': form.errors.has('is_primary') }"
            :unchecked-value="0"
            :value="1"
            switch
          ></b-form-checkbox>
          <has-error :form="form" field="is_primary"></has-error>
        </b-form-group>
        <b-form-group label="Icon">
          <div class="image-input image-input-outline">
            <div
              class="image-input-wrapper"
              :style="{ backgroundImage: `url(${current_icon})` }"
            ></div>
            <label
              class="btn btn-xs btn-icon btn-circle btn-white btn-hover-text-primary btn-shadow"
              data-action="change"
              data-toggle="tooltip"
              data-original-title="Change icon"
            >
              <i class="fa fa-pen icon-sm text-muted"></i>
              <input
                type="file"
                name="icon"
                accept=".png, .jpg, .jpeg"
                @change="onFileChange($event)"
              />
            </label>
          </div>
          <span class="form-text text-muted">
            Allowed file types: png, jpg, jpeg.
          </span>
          <has-error :form="form" field="icon"></has-error>
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
              v-b-modal.amenity-form
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
            id="amenities-table"
            :items="amenities"
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

            <template #cell(name)="data">
              <b-img-lazy
                v-bind="{ width: 20, height: 20, class: 'mr-3' }"
                :src="data.item.icon"
                alt="icon"
              ></b-img-lazy>
              {{ data.item.name }}
            </template>

            <template #cell(is_primary)="data">
              <b-badge
                pill
                :variant="data.item.is_primary ? 'primary' : 'warning'"
              >
                {{ data.item.is_primary }}
              </b-badge>
            </template>

            <template #cell(is_active)="data">
              <b-form-checkbox
                :checked="data.item.is_active"
                @change="toggleActiveStatus(data.item.id)"
                :disabled="data.item.deleted_at !== null"
                switch
              ></b-form-checkbox>
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
            v-if="amenityList && amenityList.data"
            :link-gen="linkGen"
            :number-of-pages="amenityList.last_page"
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
  TOGGLE_ACTIVE_STATUS,
  DESTROY,
  RESTORE
} from "@/core/services/store/amenity.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "amenities",
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
          key: "is_primary",
          label: "Primary Status"
        },
        {
          key: "is_active",
          label: "Active Status"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      current_icon: null,
      form: new this.$Form({
        id: "",
        name: "",
        is_primary: 0,
        icon: null
      }),
      query: "per_page=20&filter[trashed]=with"
    };
  },
  methods: {
    fetchAll() {
      this.isBusy = true;
      this.$store
        .dispatch(FETCH_ALL, this.query)
        .finally(() => (this.isBusy = false));
    },
    onFileChange(event) {
      const file = event.target.files[0];

      if (typeof FileReader === "function") {
        const reader = new FileReader();

        reader.onload = event => {
          this.current_icon = event.target.result;
        };

        reader.readAsDataURL(file);
      } else {
        alert("Sorry, FileReader API not supported");
      }

      this.form.icon = file;
    },
    save() {
      this.$store.dispatch(STORE, this.form).then(() => {
        this.reset();
        this.fetchAll();
      });
    },
    edit(amenity) {
      this.form.fill({
        id: amenity.id,
        name: amenity.name,
        is_primary: amenity.is_primary ? 1 : 0
      });
      this.current_icon = amenity.icon;
      this.$bvModal.show("amenity-form");
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("amenity-form");
      });
    },
    toggleActiveStatus(id) {
      this.$store.dispatch(TOGGLE_ACTIVE_STATUS, id).then(() => {
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
      this.current_icon = null;
    }
  },
  computed: {
    ...mapGetters({
      amenityList: "getAmenities"
    }),
    amenities() {
      return this.amenityList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Amenities" }]);
  }
};
</script>
