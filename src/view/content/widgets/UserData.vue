<template>
  <b-modal id="user-data" v-if="user" size="xl" scrollable centered>
    <template #modal-header="{ close }">
      <h5>{{ user.full_name }}</h5>
      <b-button type="button" aria-label="Close" class="close" @click="close()">
        ×
      </b-button>
    </template>

    <div class="text-center mb-2">
      <div class="image-input image-input-outline">
        <div
          class="image-input-wrapper"
          :style="{ backgroundImage: `url(${user.avatar})` }"
        ></div>
      </div>
    </div>

    <b-table :fields="userFields" :items="[user]" stacked borderless>
      <template #cell(email_verified_at)="data">
        <span :class="{ 'bg-warning': !data.item.email_verified_at }">
          {{ $root.getReadableDate(data.item.email_verified_at) }}
        </span>
      </template>

      <template #cell(wallet_balance)="data">
        <b class="text-success">
          ₦{{ data.item.wallet_balance | number_format }}
        </b>
      </template>

      <template #cell(temp_wallet_balance)="data">
        <b class="text-success">
          ₦{{ data.item.temp_wallet_balance | number_format }}
        </b>
      </template>

      <template #cell(created_at)="data">
        {{ $root.getReadableDate(data.item.created_at) }}
      </template>

      <template #cell(updated_at)="data">
        {{ $root.getReadableDate(data.item.updated_at) }}
      </template>
    </b-table>
  </b-modal>
</template>

<script>
import { mapGetters } from "vuex";
import { SHOW } from "@/core/services/store/user.module";

export default {
  name: "user-data",
  data() {
    return {
      userFields: [
        {
          key: "finder",
          label: "Finder"
        },
        {
          key: "first_name",
          label: "First Name"
        },
        {
          key: "last_name",
          label: "Last Name"
        },
        {
          key: "email",
          label: "Email Address"
        },
        {
          key: "email_verified_at",
          label: "Email Verified"
        },
        {
          key: "phone_number",
          label: "Phone Number"
        },
        {
          key: "type",
          label: "Type"
        },
        {
          key: "wallet_balance",
          label: "Wallet Balance"
        },
        {
          key: "temp_wallet_balance",
          label: "Temp Wallet Balance"
        },
        {
          key: "is_blocked",
          label: "Blocked Status"
        },
        {
          key: "is_2fa_active",
          label: "Two-factor Authentication Status"
        },
        {
          key: "created_at",
          label: "Joined"
        },
        {
          key: "updated_at",
          label: "Last Updated"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser"
    })
  },
  methods: {
    showUser(id) {
      this.$store
        .dispatch(SHOW, id)
        .then(() => this.$bvModal.show("user-data"));
    }
  }
};
</script>
