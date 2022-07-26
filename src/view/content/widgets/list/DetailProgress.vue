<template>
  <div class="card card-custom card-stretch card-shadowless gutter-b">
    <div class="card-header border-0 pt-5">
      <div class="card-title font-weight-bolder">
        <div class="card-label">
          {{ title }}
          <div class="font-size-sm text-muted mt-2">{{ description }}</div>
        </div>
      </div>
    </div>

    <div class="card-body">
      <div style="height: 250px">
        <apexchart
          :options="chartOptions"
          :series="series"
          type="radialBar"
        ></apexchart>
      </div>

      <div class="mt-n12 position-relative zindex-0">
        <div class="d-flex align-items-center mb-4">
          <div
            class="symbol symbol-circle symbol-40 symbol-light mr-3 flex-shrink-0"
          >
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-gray-500">
                <b-icon icon="person-fill" font-scale="2x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <span class="font-size-h6 text-dark-75 font-weight-bolder">
              {{ rental.user.full_name }}
            </span>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              {{ rental.user.email }}
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center mb-4">
          <div
            class="symbol symbol-circle symbol-40 symbol-light mr-3 flex-shrink-0"
          >
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-gray-500">
                <b-icon icon="house" font-scale="2x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <router-link
              :to="{
                name: 'single-apartment',
                params: { apartment: rental.apartment.slug }
              }"
              class="font-size-h6 font-weight-bolder"
            >
              {{ rental.apartment.name }}
            </router-link>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              Expires: {{ $root.getReadableDate(rental.expired_at) }}
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <div
            class="symbol symbol-circle symbol-40 symbol-light mr-3 flex-shrink-0"
          >
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-gray-500">
                <b-icon icon="cash" font-scale="2x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <span class="font-size-h6 text-dark-75 font-weight-bolder">
              ₦{{ rental.payment_transaction.amount }}
            </span>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              {{ rental.payment_transaction.reference }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "detail-progress",
  props: {
    title: {
      required: true
    },
    description: {
      required: true
    },
    rental: {
      required: true
    }
  },
  data() {
    return {
      chartOptions: {}
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"]),
    series() {
      let starts = this.$moment(this.rental.started_at);
      let expires = this.$moment(this.rental.expired_at);
      let now = this.$moment();

      let percentage = ((now - starts) / (expires - starts)) * 100;

      return [Math.round(percentage)];
    }
  },
  mounted() {
    this.chartOptions = {
      chart: {
        height: 250,
        type: "radialBar",
        offsetY: 0
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          hollow: {
            margin: 0,
            size: "70%"
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: true,
              fontSize: "13px",
              fontWeight: "700",
              offsetY: -5,
              color: this.layoutConfig("colors.gray.gray-500")
            },
            value: {
              color: this.layoutConfig("colors.gray.gray-700"),
              fontSize: "30px",
              fontWeight: "700",
              offsetY: -40,
              show: true
            }
          },
          track: {
            background: this.layoutConfig("colors.theme.light.primary"),
            strokeWidth: "100%"
          }
        }
      },
      colors: [this.layoutConfig("colors.theme.base.primary")],
      stroke: {
        lineCap: "round"
      },
      labels: ["Countdown"]
    };
  }
};
</script>
