<template>
  <div>
    <alert-success :form="form">
      We have sent you another email verification link
    </alert-success>
    <div
      class="alert alert-custom alert-notice alert-light-warning fade show"
      role="alert"
      v-if="!user.email_verified_at"
    >
      <div class="alert-icon"><i class="flaticon-warning"></i></div>
      <div class="alert-text">
        Please verify your email address.
      </div>
      <div class="alert-close">
        <button
          type="button"
          class="btn btn-sm"
          @click="sendEmailVerificationLink"
        >
          Send verification link
        </button>
      </div>
    </div>

    <b-row v-if="apartmentStats">
      <b-col>
        <SimpleStat
          title="Total No of Apartments"
          :value="apartmentStats.total"
          icon="house-door"
          extraClasses="bg-info"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Inactive Apartments"
          :value="apartmentStats.inactive"
          icon="house-door"
          extraClasses="bg-warning"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Unverified Apartments"
          :value="apartmentStats.unverified"
          icon="house-door"
          extraClasses="bg-dark"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Unfeatured Apartments"
          :value="apartmentStats.unfeatured"
          icon="house-door"
          extraClasses="bg-success"
        ></SimpleStat>
      </b-col>
    </b-row>

    <b-row>
      <b-col md="6" lg="6" v-if="paymentTransactionStats">
        <SimpleChart
          :total="paymentTransactionStats.total"
          :pending_count="paymentTransactionStats.pending"
          :success_count="paymentTransactionStats.success"
          :fail_count="paymentTransactionStats.fail"
          :wallet_payments="paymentTransactionStats.wallet_payments"
          :paystack_payments="paymentTransactionStats.paystack_payments"
          :amount_success="paymentTransactionStats.amount_success"
          :amount_failed="paymentTransactionStats.amount_failed"
          :last_twelve_months_stats="
            paymentTransactionStats.last_twelve_months_stats
          "
        ></SimpleChart>
      </b-col>
      <b-col md="6" lg="6">
        <DetailProgress
          title="Latest Apartment Rental"
          description="Data for the latest rental"
          :rental="apartmentRentalStats.latest_rental"
          v-if="apartmentRentalStats && apartmentRentalStats.latest_rental"
        ></DetailProgress>
        <b-alert variant="primary" show v-else>
          No new rent at this moment!
        </b-alert>
      </b-col>
    </b-row>

    <b-row v-if="userStats">
      <b-col>
        <div class="card card-custom bg-transparent card-stretch">
          <SimpleStat
            title="All Users"
            :value="userStats.total"
            icon="alarm"
            extraClasses="bg-success"
          ></SimpleStat>

          <SimpleStat
            title="Landlords"
            :value="userStats.total_landlords"
            icon="alarm"
            extraClasses="bg-danger"
          ></SimpleStat>

          <SimpleStat
            title="Tenants"
            :value="userStats.total_tenants"
            icon="alarm"
            extraClasses="bg-warning"
          ></SimpleStat>
        </div>
      </b-col>
      <b-col>
        <UserTrend
          :list="userStats.richest_users"
          title="Richest Users"
        ></UserTrend>
      </b-col>
      <b-col>
        <UserTrend
          :list="userStats.newest_users"
          title="Newest Users"
        ></UserTrend>
      </b-col>
    </b-row>

    <b-row v-if="supportTicketStats">
      <b-col>
        <SimpleStat
          title="Total No of Tickets"
          :value="supportTicketStats.total"
          icon="stickies"
          extraClasses="bg-info"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Open Tickets"
          :value="supportTicketStats.open"
          icon="stickies"
          extraClasses="bg-primary"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Closed Tickets"
          :value="supportTicketStats.closed"
          icon="stickies"
          extraClasses="bg-dark"
        ></SimpleStat>
      </b-col>
      <b-col>
        <SimpleStat
          title="Awaiting Reply"
          :value="supportTicketStats.awaiting_reply"
          icon="stickies"
          extraClasses="bg-danger"
        ></SimpleStat>
      </b-col>
    </b-row>

    <div v-if="postStats">
      <b-row>
        <b-col cols="12">
          <h4 class="text-dark font-weight-bolder font-size-h4">
            Most Viewed Posts
          </h4>
        </b-col>
        <b-col
          v-for="(post, index) in postStats.most_viewed_posts"
          :key="'most_viewed_posts' + index"
        >
          <DetailPost
            :title="post.views_count + ' views'"
            :post="post"
          ></DetailPost>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12">
          <h4 class="text-dark font-weight-bolder font-size-h4">
            Most Interesting Posts
          </h4>
        </b-col>
        <b-col
          v-for="(post, index) in postStats.most_interesting_posts"
          :key="'most_interesting_posts' + index"
        >
          <DetailPost
            :title="post.comments_count + ' comments'"
            :post="post"
          ></DetailPost>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import UserTrend from "@/view/content/widgets/list/UserTrend.vue";
import SimpleStat from "@/view/content/widgets/list/SimpleStat.vue";
// import WeeklySalesOne from "@/view/content/widgets/list/WeeklySalesOne.vue";
import DetailPost from "@/view/content/widgets/list/DetailPost.vue";
import DetailProgress from "@/view/content/widgets/list/DetailProgress.vue";
import SimpleChart from "@/view/content/widgets/list/SimpleChart.vue";
import {
  SENDEMAILVERIFICATIONLINK,
  VERIFY_EMAIL
} from "@/core/services/store/auth.module";

export default {
  name: "dashboard",
  data() {
    return {
      form: new this.$Form({
        callbackUrl: process.env.VUE_APP_APP_URL + "dashboard"
      })
    };
  },
  components: {
    UserTrend,
    SimpleStat,
    // WeeklySalesOne,
    DetailPost,
    DetailProgress,
    SimpleChart
  },
  computed: {
    ...mapGetters({
      user: "currentUser"
    }),
    apartmentStats() {
      return this.$store.getters.getStatisticsFor("apartments");
    },
    userStats() {
      return this.$store.getters.getStatisticsFor("users");
    },
    supportTicketStats() {
      return this.$store.getters.getStatisticsFor("support_tickets");
    },
    apartmentRentalStats() {
      return this.$store.getters.getStatisticsFor("apartment_rentals");
    },
    paymentTransactionStats() {
      return this.$store.getters.getStatisticsFor("payment_transactions");
    },
    postStats() {
      return this.$store.getters.getStatisticsFor("posts");
    }
  },
  methods: {
    sendEmailVerificationLink() {
      this.$store.dispatch(SENDEMAILVERIFICATIONLINK, this.form);
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Dashboard" }]);

    let hash = this.$route.query.hash;
    let expires = this.$route.query.expires;
    let signature = this.$route.query.signature;
    let id = this.$route.query.id;

    if (hash && expires && signature && id) {
      this.$store.dispatch(VERIFY_EMAIL, {
        id: id,
        expires: expires,
        signature: signature,
        hash: hash
      });
    }
  }
};
</script>
