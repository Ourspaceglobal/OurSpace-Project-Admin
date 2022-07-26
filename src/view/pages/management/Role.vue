<template>
  <div class="d-flex flex-row">
    <b-modal
      id="role-form"
      @show="getPermissions"
      @hide="reset"
      size="lg"
      scrollable
      centered
    >
      <template #modal-header="{ close }">
        <h5>{{ (!form.id ? "New" : "Update") + " Role" }}</h5>
        <b-button
          type="button"
          aria-label="Close"
          class="close"
          @click="close()"
        >
          ×
        </b-button>
      </template>

      <alert-success :form="form">Role saved successfully!</alert-success>

      <form
        class="form"
        @submit.stop.prevent="!form.id ? save() : update()"
        @keydown="form.onKeydown($event)"
      >
        <b-form-group label="Name">
          <b-form-input
            type="text"
            v-model="form.name"
            placeholder="Account Manager"
            :class="{ 'is-invalid': form.errors.has('name') }"
            required
          ></b-form-input>
          <has-error :form="form" field="name"></has-error>
        </b-form-group>

        <b-form-group label="Permissions" v-slot="{ ariaDescribedby }">
          <b-form-checkbox-group
            v-model="form.permissions"
            :options="permissions"
            :aria-describedby="ariaDescribedby"
            stacked
          ></b-form-checkbox-group>
          <has-error :form="form" field="permissions"></has-error>
        </b-form-group>
      </form>

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
              v-b-modal.role-form
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
            id="roles-table"
            :items="roles"
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
                @click="edit(data.item.id)"
              >
                <b-icon icon="pencil" variant="primary"></b-icon>
              </button>
              <button
                class="btn btn-sm btn-clean btn-icon mr-2"
                title="Delete"
                @click="destroy(data.item.id)"
              >
                <b-icon icon="trash" variant="danger"></b-icon>
              </button>
            </template>
          </b-table>

          <b-pagination-nav
            v-if="roleList && roleList.data"
            :link-gen="linkGen"
            :number-of-pages="roleList.last_page"
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
  SHOW,
  STORE,
  UPDATE,
  DESTROY,
  GET_PERMISSIONS
} from "@/core/services/store/role.module";
import pagination from "@/core/mixins/pagination";

export default {
  name: "roles",
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
          key: "permissions_count",
          label: "No of permissions"
        },
        {
          key: "users_count",
          label: "No of admins"
        },
        {
          key: "actions",
          label: "Actions"
        }
      ],
      form: new this.$Form({
        id: "",
        name: "",
        permissions: []
      }),
      query: "include=permissionsCount,usersCount",
      permissions: []
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
          id: this.role.id,
          name: this.role.name,
          permissions: this.role.permissions.map(permission => {
            return permission.id;
          })
        });

        this.$bvModal.show("role-form");
      });
    },
    update() {
      this.$store.dispatch(UPDATE, this.form).then(() => {
        this.reset();
        this.fetchAll();
        this.$bvModal.hide("role-form");
      });
    },
    destroy(id) {
      this.$store.dispatch(DESTROY, id).then(() => {
        this.fetchAll();
      });
    },
    reset() {
      this.form.reset();
    },
    getPermissions() {
      this.$store
        .dispatch(GET_PERMISSIONS, "do_not_paginate=1")
        .then(response => {
          this.permissions = response.data.data.permissions.map(permission => {
            return {
              value: permission.id,
              text: `${permission.name} - ${permission.description}`
            };
          });
        })
        .catch(() => {
          this.$bvModal.msgBoxOk(
            "We could not fetch the permissions at this time.",
            {
              title: "Error",
              size: "sm",
              buttonSize: "sm",
              okVariant: "danger",
              headerClass: "p-2 border-bottom-0",
              footerClass: "p-2 border-top-0",
              centered: true
            }
          );
        });
    }
  },
  computed: {
    ...mapGetters({
      roleList: "getRoles",
      role: "getRole"
    }),
    roles() {
      return this.roleList.data;
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Roles" }]);
  }
};
</script>

<style lang="scss">
.custom-control.custom-checkbox {
  margin-bottom: 10px;
}
</style>
