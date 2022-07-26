<template>
  <div class="d-flex flex-row">
    <b-modal id="admin-form" @hide="reset" @show="getRoles" centered>
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " Admin" }}</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <alert-success :form="form">Admin saved successfully!</alert-success>

      <form
        class="form"
        @submit.stop.prevent="!form.id ? save() : update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="First name">
          <b-form-input
            type="text"
            v-model="form.first_name"
            :class="{ 'is-invalid': form.errors.has('first_name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="first_name"></has-error>
        </b-form-group>
        <b-form-group label="Last name">
          <b-form-input
            type="text"
            v-model="form.last_name"
            :class="{ 'is-invalid': form.errors.has('last_name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="last_name"></has-error>
        </b-form-group>
        <b-form-group label="Email address">
          <b-form-input
            type="email"
            v-model="form.email"
            :class="{ 'is-invalid': form.errors.has('email') }"
            required
          ></b-form-input>
          <has-error :form="form" field="email"></has-error>
        </b-form-group>
        <b-form-group label="Phone number">
          <b-form-input
            type="tel"
            v-model="form.phone_number"
            :class="{ 'is-invalid': form.errors.has('phone_number') }"
            required
          ></b-form-input>
          <has-error :form="form" field="phone_number"></has-error>
        </b-form-group>
      </form>

      <b-jumbotron v-if="form.id">
        <b-form-group label="Assign Role">
          <b-form-select
            :id="admin.id + '-role'"
            :value="admin.roles.length ? admin.roles[0].name : null"
            :options="roles"
            @change="updateRole()"
            size="sm"
          >
            <template #first>
              <b-form-select-option :value="null"
                >-- Select a role --</b-form-select-option
              >
            </template>
          </b-form-select>
        </b-form-group>
      </b-jumbotron>

      <template #modal-footer="{ cancel }">
        <b-button size="sm" variant="danger" @click="cancel()">
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
              v-b-modal.admin-form
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
            id="admins-table"
            :items="admins"
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
              <b-button
                variant="link"
                class="p-0 text-left text-primary"
                @click="$refs.adminData.showAdmin(data.item.id)"
              >
                {{ data.item.first_name }}
              </b-button>
            </template>

            <template #cell(email)="data">
              <a :href="'mailto:' + data.item.email">{{ data.item.email }}</a>
            </template>

            <template #cell(phone_number)="data">
              <a :href="'tel:' + data.item.phone_number">
                {{ data.item.phone_number }}
              </a>
            </template>

            <template #cell(is_blocked)="data">
              <b-form-checkbox
                :checked="data.item.is_blocked"
                @change="toggleBlockedStatus(data.item.id)"
                :disabled="data.item.deleted_at !== null"
                switch
              ></b-form-checkbox>
            </template>

            <template #cell(role)="data">
              <b-badge
                class="badge"
                :class="{
                  'badge-warning': data.item.roles.length < 1,
                  'badge-success': data.item.roles.length > 0
                }"
                pill
              >
                {{
                  data.item.roles.length
                    ? data.item.roles[0].name
                    : "not assigned"
                }}
              </b-badge>
            </template>

            <template #cell(actions)="data">
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Edit details"
                v-if="!data.item.deleted_at"
                @click="edit(data.item.id)"
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
            v-if="adminList && adminList.data"
            :link-gen="linkGen"
            :number-of-pages="adminList.last_page"
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

    <admin-data ref="adminData" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  FETCH_ALL,
  SHOW,
  STORE,
  UPDATE,
  DESTROY,
  RESTORE,
  TOGGLE_BLOCKED_STATUS,
  GET_ROLES,
  TOGGLE_ROLE
} from "@/core/services/store/admin.module";
import pagination from "@/core/mixins/pagination";
import sorting from "@/core/mixins/sorting";
import AdminData from "@/view/content/widgets/AdminData";

export default {
  name: "admins",
  mixins: [pagination, sorting],
  components: {
    "admin-data": AdminData
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
          label: "First name",
          sortable: true
        },
        {
          key: "last_name",
          label: "Last name",
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
          key: "is_blocked",
          label: "Blocked Status",
          sortable: true
        },
        {
          key: "role",
          label: "Role"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        callbackUrl: process.env.VUE_APP_APP_URL + "reset-password"
      }),
      query: "filter[trashed]=with",
      roles: []
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
    edit(id) {
      this.$store.dispatch(SHOW, id).then(() => {
        this.form.fill({
          id: this.admin.id,
          first_name: this.admin.first_name,
          last_name: this.admin.last_name,
          email: this.admin.email,
          phone_number: this.admin.phone_number,
          callbackUrl: process.env.VUE_APP_APP_URL + "reset-password"
        });

        this.$bvModal.show("admin-form");
      });
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("admin-form");
      });
    },
    toggleBlockedStatus(id) {
      this.$store.dispatch(TOGGLE_BLOCKED_STATUS, id).then(() => {
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
    },
    getRoles() {
      this.$store
        .dispatch(GET_ROLES, "do_not_paginate=1")
        .then(response => {
          this.roles = response.data.data.roles.map(role => {
            return {
              value: role.name,
              text: role.name
            };
          });
        })
        .catch(() => {
          this.$bvModal.msgBoxOk("We could not fetch the roles at this time.", {
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
    updateRole() {
      let roleName = document.getElementById(`${this.admin.id}-role`).value;

      let form = new this.$Form({
        id: this.admin.id,
        role: roleName ? roleName : this.admin.roles[0].name
      });

      this.$store.dispatch(TOGGLE_ROLE, form).then(response => {
        this.fetchAll();
        this.$store.dispatch(SHOW, form.id);

        this.$bvModal.msgBoxOk(response.data.message, {
          title: "Confirmation",
          size: "sm",
          buttonSize: "sm",
          okVariant: "success",
          headerClass: "p-2 border-bottom-0",
          footerClass: "p-2 border-top-0",
          centered: true
        });
      });
    }
  },
  computed: {
    ...mapGetters({
      adminList: "getAdmins"
    }),
    admins() {
      return this.adminList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Admins" }]);
  }
};
</script>
