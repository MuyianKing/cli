<script setup>
import { getUrlParam } from '@hl/utils'
import { login } from '@server/user'

const userStore = useUserStore()

const loginFormRef = ref()
const form = reactive({
  username: '',
  password: '',
  login_type: 1,
})

async function submit() {
  const vilid = await loginFormRef.value.validate()
  if (!vilid)
    return false
  try {
    const res = await login(form)
    userStore.initUser(res.data)
    afterLogin()
  } catch (error) {
    hl.message.error(error, '')
  }
}

async function afterLogin() {
  const path = window.location.origin + window.location.pathname

  window.history.replaceState(null, '', `${path}#/tabs/home/index`)
  const new_url = decodeURIComponent(getUrlParam('url')) || '/tabs/home/index'
  window.location.href = `${path}#${new_url}`
}
</script>

<template>
  <div class="login">
    <div class="welcome">
      <div>
        <div class="welcome-text mb-3">
          您好,
        </div>
        <div class="flex items-center welcome-text">
          欢迎您使用
        </div>
      </div>
    </div>
    <div class="login-input">
      <div class="user-login-info">
        <hl-form ref="loginFormRef" :model="form">
          <hl-form-item label="账号" label-width="40" prop="username" required>
            <hl-input v-model="form.username" placeholder="请输入用户名" class="w-full" />
          </hl-form-item>

          <hl-form-item label="密码" label-width="40" prop="password" required>
            <hl-input v-model="form.password" placeholder="请输入密码" type="password" class="w-full" />
          </hl-form-item>

          <van-button type="primary" class="w-full mt-8" @click="submit">
            登录
          </van-button>
        </hl-form>
      </div>
    </div>
  </div>
</template>

<style lang='scss' scoped>
.welcome {
  width: 100%;
  height: 40vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;

  .welcome-text {
    font-size: 22px;
    font-weight: 700;
  }

  .title {
    width: 50%;
  }

  .bg {
    width: 170px;
    height: 170px;
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    z-index: -1;
  }
}

.login-input {
  padding: 5px 20px;

  .user-login-info {
    padding: 0 10px;
    margin-bottom: 20px;

    .login-info-img {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
