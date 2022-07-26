import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      permissionList: "getMyPermissions"
    })
  },
  methods: {
    permitted(permission) {
      if (this.permissionList) {
        let list = this.permissionList.map(permission =>
          permission.name.toLowerCase()
        );

        if (list.includes(permission)) {
          return true;
        }
      }

      return false;
    }
  }
};
