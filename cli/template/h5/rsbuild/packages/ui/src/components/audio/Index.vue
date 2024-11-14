<script setup>
const props = defineProps({
  file: {
    type: Object,
    default: null,
  },
})

const { previewFileUrl } = inject('GLOBAL_CUSTOM_CONFIG', null)

let audio = null
const player = reactive({
  // 状态
  status: 'pause',
  cur_timestamp: 0,
  duration: 0,
  error: '',
})

function handleClick() {
  if (!audio) {
    return
  }

  if (player.error) {
    hl.message.error(null, player.error)
    return
  }

  player.status = player.status === 'pause' ? 'playing' : 'pause'

  if (audio.paused) {
    audio.play()
  } else {
    audio.pause()
  }
}

watch(() => props.file, (val) => {
  audio && audio.pause()

  if (!audio) {
    audio = new Audio()
  }

  audio.ontimeupdate = () => {
    player.cur_timestamp = audio.currentTime
  }

  audio.onplay = () => {
    player.duration = audio.duration
  }

  audio.ondurationchange = (e) => {
    console.log(e)
  }

  audio.onended = () => {
    player.status = 'pause'
    player.cur_timestamp = 0
  }

  audio.onerror = () => {
    player.error = '音频数据不存在，无法播放'
  }

  audio.src = previewFileUrl(val.path, val.prefix)
}, {
  immediate: true,
})

const duration = computed(() => {
  return dayjs.duration(player.cur_timestamp || player.duration, 's').format('HH:mm:ss').replace(/00:/, '')
})

const percent = computed(() => {
  if (!player.duration) {
    return 0
  }

  const _percent = (player.cur_timestamp / player.duration).toFixed(2) * 100
  return Math.min(_percent, 100)
})
</script>

<template>
  <div class="bg-gray-50 p-2 rounded">
    <div class="flex ">
      <div class="flex-1 leading-4">
        <div class="line-clamp-1 break-all">
          {{ file?.name }}{{ file?.name }}{{ file?.name }}{{ file?.name }}
        </div>
        <div class="my-1">
          {{ duration }}
        </div>
      </div>
      <div class="text-yellow-400 ml-2" @click="handleClick">
        <van-icon :name="player.status === 'pause' ? 'play-circle-o' : 'stop-circle-o'" size="30" />
      </div>
    </div>
    <van-progress :percentage="percent" pivot-text="." color="#facc15" stroke-width="2" />
  </div>
</template>

<style lang='scss' scoped>
:deep(.van-progress__pivot) {
  width: 10px;
  min-width: 0;
  padding: 0;
  height: 10px;
}
</style>
