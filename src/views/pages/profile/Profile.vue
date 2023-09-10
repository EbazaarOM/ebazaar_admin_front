<template>
  <div
      v-if="Object.keys(profileData).length"
      id="user-profile"
  >
    <profile-header :header-data="profileData.header"/>
    <!-- profile info  -->
    <section id="profile-info">
      <b-row>
        <!-- about suggested page and twitter feed -->
        <b-col
            lg="3"
            cols="12"
            order="2"
            order-lg="1"
        >
          <profile-about :about-data="profileData.userAbout"/>
          <profile-suggested-pages :pages-data="profileData.suggestedPages"/>
          <profile-twitter-feed :twitter-feed="profileData.twitterFeeds"/>
        </b-col>
        <!--/ about suggested page and twitter feed -->

        <!-- post -->
        <b-col
            lg="6"
            cols="12"
            order="1"
            order-lg="2"
        >
          <profile-post :posts="profileData.post"/>
        </b-col>
        <!-- post -->

        <!-- latest photos suggestion and polls -->
        <b-col
            lg="3"
            cols="12"
            order="3"
        >
          <profile-latest-photos :latest-images="profileData.latestPhotos"/>
          <profile-suggestion :suggestions="profileData.suggestions"/>
          <profile-polls :polls-data="profileData.polls"/>
        </b-col>
        <!--/ latest photos suggestion and polls -->

        <!-- load more  -->
        <b-col
            cols="12"
            order="4"
        >
          <profile-bottom/>
        </b-col>
        <!--/ load more  -->
      </b-row>
    </section>
    <!--/ profile info  -->
  </div>
</template>

<script>
/* eslint-disable */
import {BRow, BCol} from 'bootstrap-vue'

import ProfileHeader from './ProfileHeader.vue'
import ProfileAbout from './ProfileAbout.vue'
import ProfileSuggestedPages from './ProfileSuggestedPages.vue'
import ProfileTwitterFeed from './ProfileTwitterFeed.vue'
import ProfilePost from './ProfilePost.vue'
import ProfileLatestPhotos from './ProfileLatestPhotos.vue'
import ProfileSuggestion from './ProfileSuggestion.vue'
import ProfilePolls from './ProfilePolls.vue'
import profileBottom from './profileBottom.vue'

/* eslint-disable global-require */
export default {
  components: {
    BRow,
    BCol,

    ProfileHeader,
    ProfileAbout,
    ProfileSuggestedPages,
    ProfileTwitterFeed,
    ProfilePost,
    ProfileLatestPhotos,
    ProfileSuggestion,
    ProfilePolls,
    profileBottom,
  },
  data() {
    return {
      profileData: {},
    }
  },
  created() {
    this.profileData = JSON.parse('{"header":{"avatar":"/img/avatar-s-2.da5e73c7.jpg","username":"Kitty Allanson","designation":"UI/UX Designer","coverImg":"/img/timeline.aa03c008.jpg"},"userAbout":{"about":"Tart I love sugar plum I love oat cake. Sweet ⭐️ roll caramels I love jujubes. Topping cake wafer.","joined":"November 15, 2015","lives":"New York, USA","email":"bucketful@fiendhead.org","website":"www.pixinvent.com"},"suggestedPages":[{"avatar":"/img/12-small.3a5e3ce0.png","username":"Peter Reed","subtitle":"Company","favorite":false},{"avatar":"/img/1-small.1b74d2ba.png","username":"Harriett Adkins","subtitle":"Company","favorite":false},{"avatar":"/img/10-small.2b24b197.png","username":"Juan Weaver","subtitle":"Company","favorite":false},{"avatar":"/img/3-small.33d29f56.png","username":"Claudia Chandler","subtitle":"Company","favorite":false},{"avatar":"/img/5-small.a4eb6d6e.png","username":"Earl Briggs","subtitle":"Company","favorite":true},{"avatar":"/img/6-small.c9b47a98.png","username":"Jonathan Lyons","subtitle":"Beauty Store","favorite":false}],"twitterFeeds":[{"imgUrl":"/img/5-small.a4eb6d6e.png","title":"Gertrude Stevens","id":"tiana59 ","tags":"#design #fasion","desc":"I love cookie chupa chups sweet tart apple pie ⭐️ chocolate bar.","favorite":false},{"imgUrl":"/img/12-small.3a5e3ce0.png","title":"Lura Jones","id":"tiana59 ","tags":"#vuejs #code #coffeez","desc":"Halvah I love powder jelly I love cheesecake cotton candy. 😍","favorite":true},{"imgUrl":"/img/1-small.1b74d2ba.png","title":"Norman Gross","id":"tiana59 ","tags":"#sketch #uiux #figma","desc":"Candy jelly beans powder brownie biscuit. Jelly marzipan oat cake cake.","favorite":false}],"post":[{"avatar":"/img/avatar-s-18.0ffcd7b4.jpg","username":"Leeanna Alvord","postTime":"12 Dec 2018 at 1:16 AM","postText":"Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.","postImg":"/img/2.fedb99d5.jpg","likes":1240,"youLiked":true,"comments":1240,"share":1240,"likedUsers":[{"avatar":"/img/avatar-s-1.3fdebd01.jpg","username":"Trine Lynes"},{"avatar":"/img/avatar-s-2.da5e73c7.jpg","username":"Lilian Nenes"},{"avatar":"/img/avatar-s-3.6128b34a.jpg","username":"Alberto Glotzbach"},{"avatar":"/img/avatar-s-5.50ed9b46.jpg","username":"George Nordic"},{"avatar":"/img/avatar-s-4.61de186b.jpg","username":"Vinnie Mostowy"}],"likedCount":140,"detailedComments":[{"avatar":"/img/avatar-s-6.0f4533ab.jpg","username":"Kitty Allanson","comment":"Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.","commentsLikes":34,"youLiked":false},{"avatar":"/img/avatar-s-8.d6c23222.jpg","username":"Jackey Potter","comment":"Unlimited color🖌 options allows you to set your application color as per your branding 🤪.","commentsLikes":61,"youLiked":true}]},{"avatar":"/img/avatar-s-22.da5e73c7.jpg","username":"Rosa Walters","postTime":"11 Dec 2019 at 1:16 AM","postText":"Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.","postImg":"/img/25.290aefb5.jpg","likes":1240,"youLiked":true,"comments":1240,"share":1240,"likedUsers":[{"avatar":"/img/avatar-s-1.3fdebd01.jpg","username":"Trine Lynes"},{"avatar":"/img/avatar-s-2.da5e73c7.jpg","username":"Lilian Nenes"},{"avatar":"/img/avatar-s-3.6128b34a.jpg","username":"Alberto Glotzbach"},{"avatar":"/img/avatar-s-5.50ed9b46.jpg","username":"George Nordic"},{"avatar":"/img/avatar-s-4.61de186b.jpg","username":"Vinnie Mostowy"}],"likedCount":271,"detailedComments":[{"avatar":"/img/avatar-s-3.6128b34a.jpg","username":"Kitty Allanson","comment":"Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.","commentsLikes":34,"youLiked":false}]},{"avatar":"/img/avatar-s-15.d50eb9cb.jpg","username":"Charles Watson","postTime":"12 Dec 2019 at 1:16 AM","postText":"Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.","postVid":"https://www.youtube.com/embed/6stlCkUDG_s","likes":1240,"youLiked":true,"comments":1240,"share":1240,"likedUsers":[{"avatar":"/img/avatar-s-1.3fdebd01.jpg","username":"Trine Lynes"},{"avatar":"/img/avatar-s-2.da5e73c7.jpg","username":"Lilian Nenes"},{"avatar":"/img/avatar-s-3.6128b34a.jpg","username":"Alberto Glotzbach"},{"avatar":"/img/avatar-s-5.50ed9b46.jpg","username":"George Nordic"},{"avatar":"/img/avatar-s-4.61de186b.jpg","username":"Vinnie Mostowy"}],"likedCount":264,"detailedComments":[{"avatar":"/img/avatar-s-3.6128b34a.jpg","username":"Kitty Allanson","comment":"Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.","commentsLikes":34,"youLiked":false}]}],"latestPhotos":[{"img":"/img/user-13.005c80e1.jpg"},{"img":"/img/user-02.8342b4cb.jpg"},{"img":"/img/user-03.0fc73648.jpg"},{"img":"/img/user-04.3ac7ddd3.jpg"},{"img":"/img/user-05.d2e52538.jpg"},{"img":"/img/user-06.74a75a96.jpg"},{"img":"/img/user-07.c63e602a.jpg"},{"img":"/img/user-08.d01a17e3.jpg"},{"img":"/img/user-09.ed018c7b.jpg"}],"suggestions":[{"avatar":"/img/avatar-s-9.397f0acd.jpg","name":"Peter Reed","mutualFriend":"6 Mutual Friends"},{"avatar":"/img/avatar-s-6.0f4533ab.jpg","name":"Harriett Adkins","mutualFriend":"3 Mutual Friends"},{"avatar":"/img/avatar-s-7.cb1b1e65.jpg","name":"Juan Weaver","mutualFriend":"1 Mutual Friends"},{"avatar":"/img/avatar-s-8.d6c23222.jpg","name":"Claudia Chandler","mutualFriend":"16 Mutual Friends"},{"avatar":"/img/avatar-s-1.3fdebd01.jpg","name":"Earl Briggs","mutualFriend":"4 Mutual Friends"},{"avatar":"/img/avatar-s-10.64aa61a3.jpg","name":"Jonathan Lyons","mutualFriend":"25 Mutual Friends"}],"polls":[{"name":"RDJ","result":"82%","votedUser":[{"img":"/img/avatar-s-12.4ba08df0.jpg","username":"Tonia Seabold"},{"img":"/img/avatar-s-5.50ed9b46.jpg","username":"Carissa Dolle"},{"img":"/img/avatar-s-9.397f0acd.jpg","username":"Kelle Herrick"},{"img":"/img/avatar-s-10.64aa61a3.jpg","username":"Len Bregantini"},{"img":"/img/avatar-s-11.14cf1734.jpg","username":"John Doe"}]},{"name":"Chris Hemswort","result":"67%","votedUser":[{"img":"/img/avatar-s-9.397f0acd.jpg","username":"Tonia Seabold"},{"img":"/img/avatar-s-1.3fdebd01.jpg","username":"Carissa Dolle"},{"img":"/img/avatar-s-8.d6c23222.jpg","username":"Jonathan Lyons"}]}]}')
    // this.$http.get('/profile/data').then(res => {
    //
    //   this.profileData = res.data
    // })
  },
}
/* eslint-disable global-require */
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-profile.scss';
</style>
