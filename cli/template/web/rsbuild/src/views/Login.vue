<script name="UserLoginNoAlive" setup>
import { useRequest } from '@hl/hooks'
import { clearUserData } from '@server/user'
import { login } from "@hl/tyyh"

const form = reactive({
  username: '',
  password: '',
  login_type: 1,
})

const login_ref = ref(null)
const rules = {
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  }],
}

const { loading, request } = useRequest(login)

// 登录
function submitForm() {
  login_ref.value.validate(async (valid) => {
    if (valid) {
      request(form).then((res) => {
        afterLogin(res)
      }).catch((err) => {
        hl.message.error(err, '登录失败')
      })
    }
  })
}

const userStore = useUserStore()
const router = useRouter()

// 登录成功
function afterLogin(data) {
  data = {
    ...data.data,
    token: data.token,
  }
  userStore.initUser(data)
  router.push('/')
}

onMounted(() => {
  clearUserData(router)
})

const route = useRoute()
// 监听是否是认证失败跳过来的
watch(() => route.query, (query) => {
  if (query.msg) {
    setTimeout(() => {
      hl.message.confirm(query.msg, '', {
        showCancelButton: false,
      }).then(() => {
        window.location.href = `${window.location.origin}#/login`
      })
    }, 100)
  }
}, {
  immediate: true,
})
</script>

<template>
  <div v-loading="loading" class="login-wrapper text-center">
    <div class="login-box-wrapper text-[0px]">
      <div class="main-part">
        <div class="left">
          <img class="max-h-full w-[80%] mx-auto" src="@img/login/left.png">
        </div>
        <div class="right">
          <div class="login-container">
            <div class="w-full text-center text-4xl mb-8">
              赋能中心
            </div>
            <div class="login-form">
              <el-form ref="login_ref" :model="form" :rules="rules" label-position="top" size="large">
                <el-form-item label="账号" prop="username">
                  <el-input v-model="form.username" placeholder="请输入账号">
                    <template #prefix>
                      <hl-icon icon="iconoir:user" size="26" color="#409eff" />
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="form.password" placeholder="请输入密码" show-password type="password" @keyup.enter="submitForm">
                    <template #prefix>
                      <hl-icon icon="fluent-emoji-high-contrast:locked" size="23" color="#409eff" />
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>
              <el-button class="login-btn py-0" @click="submitForm">
                登录
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$url: '@img/login/';

* {
  transition: all ease 0.4s;
}

.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url(#{$url}bg.jpg);
  background-size: cover;

  .login-box-wrapper {
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 72%;
    height: 60%;
  }

  .main-part {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 16px;

    .left {
      width: 60%;
      height: 100%;
      padding: 10px;
      background-image: url(#{$url}left-bg.jpg);
      background-size: 100% 100%;
      background-position: center top;
      background-repeat: no-repeat;

      img {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .right {
      width: 40%;
      height: 100%;
      background: #fff;

      .login-container {
        position: relative;
        top: 50%;
        transform: translateY(-50%);

        height: fit-content;
        width: 100%;
        padding: 20%;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-image: linear-gradient(to right, rgb(31, 104, 242), rgb(65, 159, 252));
    text-align: center;
    color: white;
    margin-top: 20px;
    border: none;
  }

  img {
    pointer-events: none;
  }
}

@media screen and (max-width: 1000px) {
  .left {
    display: none;
  }

  .login-box-wrapper {
    max-width: 600px !important;
    height: 500px !important;

    &>img {
      height: 100%;
      width: 100%;
    }
  }

  .right {
    width: 100% !important;
    margin: 0 auto;
    background-color: transparent !important;
    background-image: url(#{$url}left-bg.jpg) !important;
    background-size: 100% 100% !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
  }
}

:deep(.el-form-item__label) {
  width: 100%;
}
</style>
