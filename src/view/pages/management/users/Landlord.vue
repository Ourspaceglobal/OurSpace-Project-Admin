<template>
  <users user_type="landlord"></users>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Users from "./components/Users";

export default {
  name: "landlords",
  components: {
    users: Users
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Landlords" }]);
  }
};
</script>
