<template>
  <div class="d-flex flex-row">
    <b-modal id="category-form" @hide="reset" centered>
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " Category" }}</h5>
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

      <alert-success :form="form">Category saved successfully!</alert-success>

      <form
        class="form"
        @submit.stop.prevent="!form.id ? save() : update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Name">
          <b-form-input
            type="text"
            v-model="form.name"
            placeholder="E.g.; Two bedroom"
            :class="{ 'is-invalid': form.errors.has('name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="name"></has-error>
        </b-form-group>
        <b-form-group label="Description">
          <b-form-input
            type="text"
            v-model="form.description"
            placeholder="E.g.; Room and parlour self-contain"
            :class="{ 'is-invalid': form.errors.has('description') }"
          ></b-form-input>
          <has-error :form="form" field="description"></has-error>
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
              v-b-modal.category-form
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
            id="categories-table"
            :items="categories"
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
            v-if="categoryList && categoryList.data"
            :link-gen="linkGen"
            :number-of-pages="categoryList.last_page"
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
} from "@/core/services/store/category.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "categories",
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
          key: "apartments_count",
          label: "Apartments"
        },
        {
          key: "sub_categories_count",
          label: "Sub-categories"
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
        description: "",
        icon: null
      }),
      query: "filter[trashed]=with&include=apartmentsCount,subCategoriesCount"
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
    edit(category) {
      this.form.fill({
        id: category.id,
        name: category.name,
        description: category.description
      });
      this.current_icon = category.icon;
      this.$bvModal.show("category-form");
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("category-form");
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
      categoryList: "getCategories"
    }),
    categories() {
      return this.categoryList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Categories" }]);
  }
};
</script>
