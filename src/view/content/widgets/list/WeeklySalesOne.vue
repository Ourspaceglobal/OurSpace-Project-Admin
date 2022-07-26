<template>
  <div class="card card-custom card-stretch gutter-b">
    <div class="card-header border-0 pt-5">
      <div class="card-title font-weight-bolder">
        <div class="card-label">
          {{ title }}
          <div class="font-size-sm text-muted mt-2">
            {{ total }} transaction
          </div>
        </div>
      </div>
    </div>

    <div class="card-body d-flex flex-column">
      <apexchart
        :options="chartOptions"
        :series="series"
        type="radialBar"
      ></apexchart>

      <div class="mt-10">
        <div class="d-flex align-items-center mr-2 mb-5">
          <div class="symbol symbol-45 symbol-light-info mr-4 flex-shrink-0">
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-danger">
                <b-icon icon="cash-stack" font-scale="3x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <div class="font-size-h4 text-dark-75 font-weight-bolder">
              {{ pending_count }}
            </div>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              Total Pending
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center mr-2 mb-5">
          <div class="symbol symbol-45 symbol-light-success mr-4 flex-shrink-0">
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-danger">
                <b-icon icon="cash-stack" font-scale="3x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <div class="font-size-h4 text-dark-75 font-weight-bolder">
              {{ success_count }}
            </div>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              Total Successful
            </div>
          </div>
        </div>

        <div class="d-flex align-items-center mr-2">
          <div class="symbol symbol-45 symbol-light-danger mr-4 flex-shrink-0">
            <div class="symbol-label">
              <span class="svg-icon svg-icon-lg svg-icon-danger">
                <b-icon icon="cash-stack" font-scale="3x"></b-icon>
              </span>
            </div>
          </div>

          <div>
            <div class="font-size-h4 text-dark-75 font-weight-bolder">
              {{ fail_count }}
            </div>
            <div class="font-size-sm text-muted font-weight-bold mt-1">
              Total Failed
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
  name: "weekly-sales-one",
  props: {
    title: {
      required: true,
      type: String
    },
    total: {
      required: true
    },
    pending_count: {
      required: true
    },
    success_count: {
      required: true
    },
    fail_count: {
      required: true
    }
  },
  data() {
    return {
      chartOptions: {},
      series: [60, 50, 75, 80]
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"])
  },
  mounted() {
    this.chartOptions = {
      chart: {
        height: 200,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "30%"
          },
          dataLabels: {
            showOn: "always",
            name: {
              show: false,
              fontWeight: "700"
            },
            value: {
              color: this.layoutConfig("colors.gray.gray-700"),
              fontSize: "18px",
              fontWeight: "700",
              offsetY: 10,
              show: true
            },
            total: {
              show: true,
              label: "Total",
              fontWeight: "bold",
              formatter: function() {
                return "60%";
              }
            }
          },
          track: {
            background: this.layoutConfig("colors.gray.gray-100"),
            strokeWidth: "100%"
          }
        }
      },
      colors: [
        this.layoutConfig("colors.theme.base.info"),
        this.layoutConfig("colors.theme.base.danger"),
        this.layoutConfig("colors.theme.base.success"),
        this.layoutConfig("colors.theme.base.primary")
      ],
      stroke: {
        lineCap: "round"
      },
      labels: ["Progress"]
    };
  }
};
</script>
