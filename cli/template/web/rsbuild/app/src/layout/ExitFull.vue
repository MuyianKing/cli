<script setup>
const appStore = useAppStore()

function handleClose() {
  appStore.full_page = false
}
</script>

<template>
  <div class="close-wrapper">
    <div class="close-item">
      <hl-icon icon="iconamoon:close-thin" size="28px" @click="handleClose" />
    </div>
  </div>
</template>

<style lang='scss' scoped>
.close-wrapper {
  position: fixed;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  z-index: 999999;
  height: 60px;
}

.close-item {
  background-color: var(--el-color-primary-light-5);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transform: translateY(-70%);
  transition: all ease 0.3s;
  box-shadow: 0 0 20px var(--el-color-primary-light-5);
}

.close-item:hover {
  background-color: var(--color-primary);
}

.close-wrapper:hover {
  .close-item {
    transform: translateY(50%);
  }
}
</style>
