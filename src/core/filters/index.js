import Vue from "vue";

Vue.filter("number_format", function(number) {
  if (!number) {
    return 0;
  }

  return new Intl.NumberFormat().format(number);
});
