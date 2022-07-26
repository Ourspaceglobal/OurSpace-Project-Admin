<template>
  <users user_type="tenant"></users>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import Users from "./components/Users";

export default {
  name: "tenants",
  components: {
    users: Users
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Tenants" }]);
  }
};
</script>
