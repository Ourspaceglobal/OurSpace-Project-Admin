<template>
  <ul class="menu-nav">
    <router-link
      :to="{ name: 'dashboard' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      custom
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Dashboard </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'profile' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      custom
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Profile </span>
        </a>
      </li>
    </router-link>

    <router-link
      :to="{ name: 'support-tickets' }"
      v-slot="{ href, navigate, isActive, isExactActive }"
      v-if="$root.permitted('manage support tickets')"
      custom
    >
      <li
        aria-haspopup="true"
        data-menu-toggle="hover"
        class="menu-item"
        :class="[
          isActive && 'menu-item-active',
          isExactActive && 'menu-item-active'
        ]"
      >
        <a :href="href" class="menu-link" @click="navigate">
          <span class="menu-text"> Support Tickets </span>
          <b-icon
            icon="circle-fill"
            animation="throb"
            font-scale="0.5"
            variant="danger"
            v-if="supportTicketStats && supportTicketStats.awaiting_reply"
          ></b-icon>
        </a>
      </li>
    </router-link>

    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      v-bind:class="{ 'menu-item-active': hasActiveChildren('management') }"
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text"> Management </span>
        <i class="menu-arrow"></i>
        <b-icon
          icon="circle-fill"
          animation="throb"
          font-scale="0.5"
          variant="danger"
          v-if="pendingManagementNotification"
        ></b-icon>
      </a>
      <div class="menu-submenu menu-submenu-fixed">
        <div class="menu-subnav megamenu" style="max-width: 800px;">
          <ul class="menu-content">
            <li
              class="menu-item"
              v-if="
                $root.permitted('manage withdrawal requests') ||
                  $root.permitted('manage wallet funding requests')
              "
            >
              <h3 class="menu-heading menu-toggle">
                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                <span class="menu-text"> Financials </span>
                <i class="menu-arrow"></i>
                <b-icon
                  icon="circle-fill"
                  animation="throb"
                  font-scale="0.5"
                  variant="danger"
                  v-if="
                    pendingManagementNotification &&
                      (withdrawalRequestStats.pending ||
                        walletFundingRequestStats.pending)
                  "
                ></b-icon>
              </h3>
              <ul class="menu-inner">
                <router-link
                  :to="{ name: 'withdrawal-requests' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage withdrawal requests')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Withdrawal Requests </span>
                      <b-icon
                        icon="circle-fill"
                        animation="throb"
                        font-scale="0.5"
                        variant="danger"
                        v-if="
                          pendingManagementNotification &&
                            withdrawalRequestStats.pending
                        "
                      ></b-icon>
                    </a>
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'wallet-funding-requests' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage wallet funding requests')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Wallet Funding Requests </span>
                      <b-icon
                        icon="circle-fill"
                        animation="throb"
                        font-scale="0.5"
                        variant="danger"
                        v-if="
                          pendingManagementNotification &&
                            walletFundingRequestStats.pending
                        "
                      ></b-icon>
                    </a>
                  </li>
                </router-link>
              </ul>
            </li>
            <li
              class="menu-item"
              v-if="
                $root.permitted('manage users') ||
                  $root.permitted('manage landlord requests')
              "
            >
              <h3 class="menu-heading menu-toggle">
                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                <span class="menu-text"> Users </span>
                <i class="menu-arrow"></i>
                <b-icon
                  icon="circle-fill"
                  animation="throb"
                  font-scale="0.5"
                  variant="danger"
                  v-if="
                    pendingManagementNotification &&
                      landlordRequestStats.pending
                  "
                ></b-icon>
              </h3>
              <ul class="menu-inner">
                <router-link
                  :to="{ name: 'landlords' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage users')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Landlords </span>
                    </a>
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'tenants' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage users')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Tenants </span>
                    </a>
                  </li>
                </router-link>

                <router-link
                  :to="{ name: 'landlord-requests' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage landlord requests')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Landlord Requests </span>
                      <b-icon
                        icon="circle-fill"
                        animation="throb"
                        font-scale="0.5"
                        variant="danger"
                        v-if="
                          pendingManagementNotification &&
                            landlordRequestStats.pending
                        "
                      ></b-icon>
                    </a>
                  </li>
                </router-link>
              </ul>
            </li>
            <li
              class="menu-item"
              v-if="
                $root.permitted('manage admins') ||
                  $root.permitted('manage access control list')
              "
            >
              <h3 class="menu-heading menu-toggle">
                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                <span class="menu-text"> Admin Management </span>
                <i class="menu-arrow"></i>
              </h3>
              <ul class="menu-inner">
                <router-link
                  :to="{ name: 'roles' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage access control list')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Roles </span>
                    </a>
                  </li>
                </router-link>
                <router-link
                  :to="{ name: 'admins' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage admins')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Admins </span>
                    </a>
                  </li>
                </router-link>
              </ul>
            </li>
            <li class="menu-item">
              <h3 class="menu-heading menu-toggle">
                <i class="menu-bullet menu-bullet-dot"><span></span></i>
                <span class="menu-text"> Notifications </span>
                <i class="menu-arrow"></i>
                <b-icon
                  icon="circle-fill"
                  animation="throb"
                  font-scale="0.5"
                  variant="danger"
                  v-if="
                    pendingManagementNotification && myNotificationStats.unread
                  "
                ></b-icon>
              </h3>
              <ul class="menu-inner">
                <router-link
                  :to="{ name: 'my-notifications' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> My Notifications </span>
                      <b-icon
                        icon="circle-fill"
                        animation="throb"
                        font-scale="0.5"
                        variant="danger"
                        v-if="
                          pendingManagementNotification &&
                            myNotificationStats.unread
                        "
                      ></b-icon>
                    </a>
                  </li>
                </router-link>
                <router-link
                  :to="{ name: 'manage-push-notifications' }"
                  v-slot="{ href, navigate, isActive, isExactActive }"
                  v-if="$root.permitted('manage push notifications')"
                  custom
                >
                  <li
                    aria-haspopup="true"
                    class="menu-item"
                    :class="[
                      isActive && 'menu-item-active',
                      isExactActive && 'menu-item-active'
                    ]"
                  >
                    <a :href="href" class="menu-link" @click="navigate">
                      <i class="menu-bullet menu-bullet-dot"><span></span></i>
                      <span class="menu-text"> Push Notifications </span>
                    </a>
                  </li>
                </router-link>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </li>

    <li
      aria-haspopup="true"
      data-menu-toggle="click"
      class="menu-item menu-item-submenu menu-item-open-dropdown"
      v-bind:class="{ 'menu-item-active': hasActiveChildren('/apartments') }"
      v-if="
        $root.permitted('manage apartments') ||
          $root.permitted('manage apartment bookings') ||
          $root.permitted('manage apartment rentals')
      "
    >
      <a href="#" class="menu-link menu-toggle">
        <span class="menu-text"> Apartments </span>
        <i class="menu-arrow"></i>
      </a>
      <div class="menu-submenu menu-submenu-classic">
        <ul class="menu-subnav">
          <router-link
            :to="{ name: 'apartments' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage apartments')"
            custom
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item"
              :class="[
                isActive && 'menu-item-active',
                isExactActive && 'menu-item-active'
              ]"
            >
              <a :href="href" class="menu-link" @click="navigate">
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> All apartments </span>
              </a>
            </li>
          </router-link>

          <router-link
            :to="{ name: 'apartment-bookings' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage apartment bookings')"
            custom
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item"
              :class="[
                isActive && 'menu-item-active',
                isExactActive && 'menu-item-active'
              ]"
            >
              <a :href="href" class="menu-link" @click="navigate">
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> Bookings </span>
              </a>
            </li>
          </router-link>

          <router-link
            :to="{ name: 'apartment-rentals' }"
            v-slot="{ href, navigate, isActive, isExactActive }"
            v-if="$root.permitted('manage apartment rentals')"
            custom
          >
            <li
              aria-haspopup="true"
              data-menu-toggle="hover"
              class="menu-item"
              :class="[
                isActive && 'menu-item-active',
                isExactActive && 'menu-item-active'
              ]"
            >
              <a :href="href" class="menu-link" @click="navigate">
                <i class="menu-bullet menu-bullet-line"><span></span></i>
                <span class="menu-text"> Rentals </span>
              </a>
            </li>
          </router-link>
        </ul>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "KTMenuDashboard",
  computed: {
    supportTicketStats() {
      return this.$store.getters.getStatisticsFor("support_tickets");
    },
    withdrawalRequestStats() {
      return this.$store.getters.getStatisticsFor("withdrawal_requests");
    },
    walletFundingRequestStats() {
      return this.$store.getters.getStatisticsFor("wallet_funding_requests");
    },
    landlordRequestStats() {
      return this.$store.getters.getStatisticsFor("landlord_requests");
    },
    myNotificationStats() {
      return this.$store.getters.getStatisticsFor("my_notifications");
    },
    pendingManagementNotification() {
      return (
        this.withdrawalRequestStats?.pending ||
        this.walletFundingRequestStats?.pending ||
        this.landlordRequestStats?.pending ||
        this.myNotificationStats?.unread
      );
    }
  },
  methods: {
    hasActiveChildren(match) {
      return this.$route["path"].indexOf(match) !== -1;
    }
  }
};
</script>
