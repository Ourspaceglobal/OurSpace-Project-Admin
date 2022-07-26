export default {
  watch: {
    $route(to) {
      this.$root.pagination(to, this.goToPage);
    }
  },
  methods: {
    goToPage(page) {
      this.query += `&page=${page}`;
      this.fetchAll();
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    }
  },
  mounted() {
    this.$root.pagination(this.$route, this.goToPage);
  }
};
