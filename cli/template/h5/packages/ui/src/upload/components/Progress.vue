<script setup name="UploadProgress">
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const slots = useSlots()
</script>

<template>
  <teleport to="body">
    <div v-show="show" class="progress-shadow">
      <div class="progress-body">
        <div class="title">
          正在上传...
        </div>
        <slot :percentage="progress" />
        <van-progress v-if="!slots.default" :stroke-width="20" :percentage="progress" class="progress" />
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.progress-shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999999;
  background-color: rgba(0, 0, 0, 0.5);

  .progress-body {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 50%;
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
  }

  .title {
    margin-bottom: 10px;
  }

  .progress {
    width: 100%;
  }
}
</style>
