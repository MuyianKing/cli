<template>
  <div class="error-page">
    <div class="error-code">4<span>0</span>4</div>
    <div class="error-desc">啊哦~ 你所访问的页面不存在</div>
    <a class="error-href" href="#/tabs/home/index">返回首页</a>
    <van-button class="error-btn" type="primary" @click="goBack">返回上一页</van-button>
  </div>
</template>

<script setup>

const router = useRouter();
function goBack() {
  router.go(-1);
}

</script>

<style scoped lang="scss">
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
}

.error-code {
  line-height: 1;
  font-size: 100px;
  font-weight: bolder;
  color: #2d8cf0;

  span {
    color: #00a854;
  }
}


.error-desc {
  font-size: 20px;
  color: #777;
}

.error-href {
  font-size: 26px;
  margin: 100px 0;
  color: #2d8cf0;
}

.error-btn {
  margin: 0 auto;
}
</style>
