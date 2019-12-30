<template>
  <div class="profile-header flex flex-jcc">
    <div class="profile-info flex flex-clo flex-ai">
      <img :src="accountInfo.avatarUrl" alt />
      <span class="profile-name">{{accountInfo.name}}</span>
      <span class="profile-login-name">{{accountInfo.login}}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    accountInfo: Object
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
.profile-header {
  position: relative;
  @include setWAndH(100%, 240px !important);
  background: url('../../static/images/profile-bg.svg');
  .profile-info {
    margin-top: 50px;
    & > img {
      @include setWAndH(100px, 100px);
      border-radius: 50%;
      border: 2px solid $dominantHue;
    }
    span {
      margin-top: 10px;
    }
    .profile-name {
      color: $primaryHued;
      font-size: 30px;
      font-weight: 600;
    }
    .profile-login-name {
      color: $describe;
      margin-bottom: 20px;
    }
    .profile-login-name,
    .profile-name,
    img {
      animation: slide 1s ease 1;
    }
    @include keyframes(slide) {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  }
}
</style>