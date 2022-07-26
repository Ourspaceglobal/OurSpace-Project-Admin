<template>
  <b-skeleton-wrapper :loading="loading">
    <template #loading>
      <b-card>
        <b-skeleton width="85%"></b-skeleton>
        <b-skeleton width="55%"></b-skeleton>
        <b-skeleton width="70%"></b-skeleton>
      </b-card>
    </template>

    <b-card v-if="myApartment">
      <b-tabs content-class="mt-5 pt-5" justified>
        <b-tab title="Overview" active>
          <div class="d-flex align-items-center">
            <div class="symbol symbol-60 symbol-light-success mr-5">
              <span class="symbol-label">
                <img
                  :src="myApartment.user.avatar"
                  class="h-100 w-100 align-self-end"
                  alt="avatar"
                />
              </span>
            </div>

            <div class="d-flex flex-column flex-grow-1">
              <b-button
                variant="link"
                class="p-0 text-left text-primary font-size-lg font-weight-bolder"
                @click="$refs.userData.showUser(myApartment.user.id)"
              >
                {{ myApartment.user.full_name }}
              </b-button>
              <span class="text-muted font-weight-bold">
                {{ myApartment.user.email }}<br />
                {{ myApartment.user.phone_number }}
              </span>
            </div>
          </div>

          <div class="separator separator-dashed my-5"></div>

          <div class="clearfix">
            <b-img-lazy
              :src="myApartment.featured_image"
              width="300px"
              height="300px"
              rounded
              right
              fluid
            ></b-img-lazy>

            <div class="mb-5">
              <h2>{{ myApartment.name }}</h2>
              <b-badge variant="primary">{{
                myApartment.category.name
              }}</b-badge>
              <b-badge variant="secondary" class="ml-2">{{
                myApartment.sub_category ? myApartment.sub_category.name : ""
              }}</b-badge>
            </div>

            <h4>
              ₦{{ myApartment.price | number_format }}/{{
                myApartment.apartment_duration.period
              }}
            </h4>

            <p class="pt-5 mb-2">
              {{ myApartment.description }}
            </p>
          </div>

          <div class="separator separator-dashed my-5"></div>

          <div>
            <h5>Amenities</h5>
            <b-button
              variant="outline-dark"
              v-for="(amenity, index) in myApartment.amenities"
              :key="index"
            >
              <b-img
                :src="amenity.icon"
                width="20px"
                height="20px"
                class="mr-2"
              ></b-img>
              {{ amenity.name }} ({{ amenity.pivot.total_number }})
            </b-button>
          </div>

          <div class="separator separator-dashed my-5"></div>

          <div>
            <h5>Additional KYCs</h5>
            <b-button
              variant="outline-dark"
              v-for="(custom_apartment_kyc,
              index) in myApartment.custom_apartment_kycs"
              :key="index"
            >
              {{ custom_apartment_kyc.name }}
            </b-button>
          </div>
        </b-tab>

        <b-tab title="Gallery">
          <b-tabs pills card vertical>
            <b-tab
              :title="gallery.title + ' (' + gallery.media.length + ')'"
              v-for="(gallery, index) in myApartment.galleries"
              :key="gallery.id"
              :active="index === 0"
            >
              <b-img
                v-for="(image, index) in gallery.media"
                :key="index"
                :src="image.original_url"
                :alt="image.name"
                @click="currentGalleryImage = index"
                width="150px"
                height="150px"
                class="mr-5 cursor-pointer"
              ></b-img>

              <Tinybox
                v-model="currentGalleryImage"
                :images="getImages(gallery.media)"
              />
            </b-tab>
          </b-tabs>
        </b-tab>

        <b-tab title="Contact &amp; Location">
          <div class="mb-3">
            <h4>Contact Information</h4>
            <b-table
              v-if="myApartment.contact"
              :fields="['email', 'phone_number_1', 'phone_number_2']"
              :items="[myApartment.contact]"
              stacked
            ></b-table>
            <b-alert show v-else>Nothing to see here</b-alert>
          </div>

          <div class="mb-3">
            <h4>Location Information</h4>
            <b-table
              v-if="myApartment.location"
              :fields="[
                'house_number',
                'street',
                'landmark',
                'latitude',
                'longitude',
                { key: 'local_government.name', label: 'Local Government' },
                { key: 'city.name', label: 'City' },
                { key: 'state.name', label: 'State' },
                'full_address'
              ]"
              :items="[myApartment.location]"
              stacked
              responsive
            ></b-table>
            <b-alert show v-else>Nothing to see here</b-alert>
          </div>
        </b-tab>

        <b-tab title="Bookings">
          <b-table
            :fields="[
              { key: 'index', label: '#' },
              'user',
              { key: 'is_active', label: 'Status' },
              { key: 'started_at', label: 'Start Date' },
              { key: 'expired_at', label: 'Expiry Date' }
            ]"
            :items="myApartment.bookings"
            responsive
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(user)="data">
              <b-button
                variant="link"
                class="p-0 text-left text-primary"
                @click="$refs.userData.showUser(data.item.user.id)"
              >
                {{ data.item.user.full_name }}
              </b-button>
            </template>

            <template #cell(is_active)="data">
              <b-badge
                class="badge"
                :class="{
                  'badge-success': data.item.is_active === true,
                  'badge-warning': data.item.is_active === false
                }"
                pill
              >
                {{ data.item.is_active === true ? "Active" : "Inactive" }}
              </b-badge>
            </template>

            <template #cell(started_at)="data">
              {{ $root.getReadableDate(data.item.started_at, "llll") }}
            </template>

            <template #cell(expired_at)="data">
              {{ $root.getReadableDate(data.item.expired_at, "llll") }}
            </template>
          </b-table>
        </b-tab>

        <b-tab title="Rentals">
          <b-table
            :fields="[
              { key: 'index', label: '#' },
              'user',
              { key: 'is_active', label: 'Status' },
              { key: 'started_at', label: 'Start Date' },
              { key: 'expired_at', label: 'Expiry Date' }
            ]"
            :items="myApartment.rentals"
            responsive
          >
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>

            <template #cell(user)="data">
              <b-button
                variant="link"
                class="p-0 text-left text-primary"
                @click="$refs.userData.showUser(data.item.user.id)"
              >
                {{ data.item.user.full_name }}
              </b-button>
            </template>

            <template #cell(is_active)="data">
              <b-badge
                class="badge"
                :class="{
                  'badge-success': data.item.is_active === true,
                  'badge-warning': data.item.is_active === false
                }"
                pill
              >
                {{ data.item.is_active === true ? "Active" : "Inactive" }}
              </b-badge>
            </template>

            <template #cell(started_at)="data">
              {{ $root.getReadableDate(data.item.started_at, "llll") }}
            </template>

            <template #cell(expired_at)="data">
              {{ $root.getReadableDate(data.item.expired_at, "llll") }}
            </template>
          </b-table>
        </b-tab>
      </b-tabs>

      <template #footer>
        <div class="d-flex justify-content-between">
          <b-button
            :variant="myApartment.is_verified ? 'success' : ''"
            @click="verify(myApartment.id)"
          >
            Click to {{ myApartment.is_verified ? "unverify" : "verify" }}
          </b-button>
          <b-button
            :variant="myApartment.is_featured ? 'info' : ''"
            @click="feature(myApartment.id)"
          >
            Click to {{ myApartment.is_featured ? "unfeature" : "feature" }}
          </b-button>
        </div>
      </template>

      <user-data ref="userData" />
    </b-card>
    <b-alert variant="danger" show v-else>
      We could not get the apartment. Please try again later.
    </b-alert>
  </b-skeleton-wrapper>
</template>

<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import {
  SHOW,
  TOGGLE_VERIFIED_STATUS,
  TOGGLE_FEATURED_STATUS
} from "@/core/services/store/apartment.module";
import { mapGetters } from "vuex";
import Tinybox from "vue-tinybox";
import UserData from "@/view/content/widgets/UserData";

export default {
  name: "apartment",
  props: {
    apartment: {
      required: true,
      type: String
    }
  },
  components: {
    Tinybox,
    "user-data": UserData
  },
  data() {
    return {
      loading: false,
      currentGalleryImage: null
    };
  },
  computed: {
    ...mapGetters({
      myApartment: "getApartment"
    })
  },
  methods: {
    show() {
      this.loading = true;

      this.$store
        .dispatch(SHOW, {
          id: this.apartment,
          query:
            "include=user,category,subCategory,apartmentDuration,amenities,galleries,contact,location,bookings,rentals,customApartmentKycs"
        })
        .then(() => {
          this.setBreadcrumb();
        })
        .finally(() => (this.loading = false));
    },
    setBreadcrumb() {
      this.$store.dispatch(SET_BREADCRUMB, [
        {
          title: "Apartments",
          route: "/apartments"
        },
        {
          title: this.myApartment ? this.myApartment.name : this.apartment
        }
      ]);
    },
    getImages(media) {
      let images = media.map(image => {
        return {
          src: image.original_url,
          caption: image.name
        };
      });
      return images;
    },
    verify() {
      this.$store
        .dispatch(TOGGLE_VERIFIED_STATUS, this.myApartment.id)
        .then(() => {
          this.show();
        });
    },
    feature() {
      this.$store
        .dispatch(TOGGLE_FEATURED_STATUS, this.myApartment.id)
        .then(() => {
          this.show();
        });
    }
  },
  mounted() {
    this.setBreadcrumb();

    this.show();
  }
};
</script>
