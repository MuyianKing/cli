<script setup>
import { storage } from '@hl/utils'
import ExitFull from '@layout/ExitFull.vue'
import HlHeader from '@layout/Header.vue'
import HlSidebar from '@layout/side-bar/Index.vue'
import useIframeStore from '@pinia/useIframeStore'

const appStore = useAppStore()

const tags = useTagsStore()
const _route = useRoute()
const tagsList = computed(() => tags.tagsList)

// 设置标签
function setTags(tag_toute) {
  const isExist = tagsList.value.some(item => item.path === tag_toute.fullPath)
  if (!isExist) {
    tags.setTagsItem({
      name: tag_toute.name,
      title: tag_toute.meta.title,
      path: tag_toute.fullPath,
    })
  }
}

const collapse = ref(+storage.get('collapse') === 1)

const show = computed(() => _route.path !== 'login')

// 用来存已经创建的组件
const components_map = new Map()

// 返回组件实例
function formatComponentInstance(component, route) {
  if (!component) {
    return
  }
  const component_name = component.type.name
  /**
   * 如果组件名以Template结尾则重新生成一个组件实例并缓存起来
   */
  if (component_name && component_name.endsWith('Template')) {
    if (component) {
      let new_comp
      const new_comp_name = route.path

      if (components_map.has(new_comp_name)) {
        new_comp = components_map.get(new_comp_name)
      } else {
        // 缓存
        new_comp = {
          name: new_comp_name,
          render() {
            return h(component)
          },
        }
        components_map.set(new_comp_name, new_comp)
      }

      return h(new_comp)
    }
  } else {
    return component
  }
}

// 替换
const keepKey = ref(_route.path)

watch(() => _route.path, (val) => {
  keepKey.value = val
})

// 刷新了
watch(() => tags.reload, (val) => {
  if (!val) {
    keepKey.value = ''
    nextTick(() => {
      keepKey.value = _route.path
    })
  }
})

watch(collapse, (val) => {
  storage.set('collapse', val ? 1 : 0)
})

watch(_route, () => {
  setTags(_route)
}, {
  immediate: true,
})

const { iframe_url_list } = storeToRefs(useIframeStore())

const no_parent = ref(window.top === window.self)
</script>

<template>
  <div v-if="show" class="main-body-wrapper">
    <exit-full v-if="appStore.full_page && no_parent" />
    <hl-sidebar v-if="no_parent" v-model="collapse" :class="{ 'hidden-hidden': appStore.full_page }" class="relative z-10" />
    <div class="bottom-wrapper">
      <hl-header v-if="no_parent" v-model:collapse="collapse" :class="{ 'hidden-hidden': appStore.full_page }" />
      <div v-show="!_route.path.startsWith('/iframe')" :class="{ 'content-collapse': collapse }" class="content-box">
        <router-view v-slot="{ Component, route }">
          <transition mode="out-in" name="fade">
            <keep-alive :max="15" :exclude="/.*(NoAlive)$/">
              <component :is="formatComponentInstance(Component, route)" v-if="tags.reload" :key="keepKey" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
      <iframe v-for="item in iframe_url_list" v-show="item.key === _route.path.split('__')[1]" :key="item.key" class="content-box iframe-body" :src="item.url" />
      <div class="w-full pb-2 text-xs text-[#333] text-center" style="background-color: var(--bg-color)">
        技术支持：常州华龙通信科技股份有限公司
        <span class="px-2">|</span>
        建议使用谷歌 60 以上版本的浏览器
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

//滑动淡入淡出开始
/* 离开 */
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 进入 */
.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

//滑动淡入淡出结束
.hidden-hidden {
  width: 0 !important;
  height: 0;
  overflow: hidden;
}

.main-body-wrapper {
  display: flex;
  width: 100%;
  height: 100%;

  .bottom-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    position: relative;

    .content-box {
      -webkit-transition: left 0.3s ease-in-out;
      transition: left 0.3s ease-in-out;
      background: var(--bg-color);
      flex: 1;
      width: 100%;
      min-width: 0;
      min-height: 0;
    }
  }

  .content-collapse {
    left: 65px;
  }
}

.iframe-body {
  width: 100%;
  height: 100%;
  border-width: 0;
  outline: 0;
  padding-top: 0 !important;
}
</style>
