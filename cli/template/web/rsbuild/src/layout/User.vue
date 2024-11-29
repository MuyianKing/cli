<script setup>
import { logout } from '@server/user'
import { PersonAvatar } from '@tyyh'

// 用户名下拉菜单选择事件
const router = useRouter()
const user = useUserStore()
const organization = computed(() => {
  const org = user.organization || {}
  return Array.isArray(org) ? org[0] : org
})

function handleDown(command) {
  if (command === 'loginout') {
    logout(router)
  } else if (command === 'user') {
    router.push('/user/info')
  }
}
</script>

<template>
  <el-dropdown class="user-name" trigger="click" @command="handleDown">
    <div class="el-dropdown-link inline-flex items-center cursor-pointer">
      <person-avatar />
      <div class="ml-2">
        <span>{{ user.name }}</span>
        <div v-if="organization.organization_id" class="org-box">
          {{ organization.organization_name }}--{{ organization.job_name }}
        </div>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="loginout" divided>
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style lang="scss" scoped>
.el-dropdown-link {
  cursor: pointer;
  color: var(--el-bar-text-color);
}

.el-dropdown-menu__item {
  text-align: center;
}

.org-box {
  font-size: 12px;
  border: 1px solid #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
}
</style>
