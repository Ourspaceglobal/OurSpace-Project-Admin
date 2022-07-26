<template>
  <div class="card card-custom bg-dark gutter-b card-stretch">
    <div class="card-header border-0 pt-5">
      <div class="card-title font-weight-bolder">
        <div class="card-label text-white">
          Payment Stats
          <div class="font-size-sm text-muted mt-2">
            Chart shows payment transactions in the last 12 months.
          </div>
        </div>
      </div>
    </div>

    <div class="card-body d-flex flex-column p-0">
      <apexchart
        class="card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        type="bar"
      ></apexchart>

      <div class="card-spacer bg-white card-rounded flex-grow-1">
        <div class="row m-0">
          <div class="col px-8 py-6 mr-8">
            <div class="font-size-sm text-muted font-weight-bold">
              Total Payments
            </div>
            <div class="font-size-h4 font-weight-bolder">{{ total }}</div>
          </div>
          <div class="col px-8 py-6">
            <div class="font-size-sm text-muted font-weight-bold">
              Pending Payments
            </div>
            <div class="font-size-h4 font-weight-bolder">
              {{ pending_count }}
            </div>
          </div>
        </div>

        <div class="row m-0">
          <div class="col px-8 py-6 mr-8">
            <div class="font-size-sm text-muted font-weight-bold">
              Total Amount (success)
            </div>
            <div class="font-size-h4 font-weight-bolder">
              ₦{{ amount_success }}
            </div>
          </div>
          <div class="col px-8 py-6">
            <div class="font-size-sm text-muted font-weight-bold">
              Total Amount (failed)
            </div>
            <div class="font-size-h4 font-weight-bolder">
              ₦{{ amount_failed }}
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
  name: "simple-chart",
  props: {
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
    },
    wallet_payments: {
      required: true
    },
    paystack_payments: {
      required: true
    },
    amount_success: {
      required: true
    },
    amount_failed: {
      required: true
    },
    last_twelve_months_stats: {
      required: true
    }
  },
  data() {
    return {
      strokeColor: "#2E82DF",
      chartOptions: {},
      series: [
        {
          name: "Successful",
          data: []
        },
        {
          name: "Fail",
          data: []
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["layoutConfig"]),
    labels() {
      let labels = [];
      for (let i = 12; i >= 0; i--) {
        let today = this.$moment();
        let date = today.subtract(i, "months");
        let year = date.format("Y");
        let month = date.format("MMM");
        let alias = `${month} ${year}`;
        labels.push(alias);
      }
      return labels;
    }
  },
  mounted() {
    this.chartOptions = {
      chart: {
        type: "bar",
        height: 200,
        toolbar: {
          show: false
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: ["30%"],
          endingShape: "rounded"
        }
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.labels,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        }
      },
      yaxis: {
        min: 0,
        max: 100000,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.layoutConfig("colors.gray.gray-500"),
            fontSize: "12px",
            fontFamily: this.layoutConfig("font-family")
          }
        }
      },
      fill: {
        opacity: 1
      },
      states: {
        normal: {
          filter: {
            type: "none",
            value: 0
          }
        },
        hover: {
          filter: {
            type: "none",
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: "none",
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: "12px",
          fontFamily: this.layoutConfig("font-family")
        },
        y: {
          formatter: function(val) {
            return "₦" + val;
          }
        }
      },
      colors: ["#1BC5BD", "#F64E60"],
      grid: {
        borderColor: this.layoutConfig("colors.gray.gray-200"),
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: false
          }
        }
      }
    };

    this.series[0].data = this.labels.map(label => {
      let real_label = this.$root.convertToSlug(label).toLowerCase();

      // Find the amount of real_label in this.last_twelve_months[0]
      return this.last_twelve_months_stats[0][`${real_label}_success_amount`];
    });
    this.series[1].data = this.labels.map(label => {
      let real_label = this.$root.convertToSlug(label).toLowerCase();

      // Find the amount of real_label in this.last_twelve_months[0]
      return this.last_twelve_months_stats[0][`${real_label}_fail_amount`];
    });
  }
};
</script>
