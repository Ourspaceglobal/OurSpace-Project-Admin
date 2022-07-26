export default {
  methods: {
    sortingChanged(context) {
      let { sortBy, sortDesc } = context;

      let sortValue = (sortDesc ? "-" : "") + sortBy;

      let queryParams = new URLSearchParams(this.query);
      if (queryParams.has("sort")) {
        this.query = this.query.replace(queryParams.get("sort"), sortValue);
      } else {
        this.query += "&sort=" + sortValue;
      }

      this.fetchAll();
    }
  }
};
