<template>
  <el-card shadow="hover">
    <div style="text-align:center;">
      <el-image
        style="width: 100px; height: 100px;border-radius:50%"
        :src="user.avatar"
        fit="cover"
        :preview-src-list="[user.avatar]"
      ></el-image>
      <el-button v-if="changing" type="text" @click="changeAvatar=true" size="small">更改头像</el-button>
      <el-dialog
        v-model='changeAvatar'
        width="40%"
        height='80%'
        title="上传图片"
      >
        <div style='text-align:center'>
          <upload-image @add-image='setAvatar' @remove-image="()=>{}"/>
        </div>

      </el-dialog>

      <div class="me-author-name">{{$store.state.user.name}}</div>
    </div>
    <div class="me-author-description">
      <el-descriptions
        title="基本信息"
        :column="1"
        size="medium"
      >
        <template #extra>
          <el-button v-if='$route.params.id==$store.state.user.id' type="primary" size="small" @click="change">
            <span v-if="!changing">更改</span>
            <span v-else>保存</span>
          </el-button>
        </template>
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-s-custom"></i>
            Account
          </template>
          <span v-if="changing">
            <el-input v-model="user.account"/>
          </span>
          <span v-else>{{user.account}}</span>
        </el-descriptions-item>

        <!-- name不允许改变 -->
        <el-descriptions-item>
          <template #label>
            <i class="el-icon-user"></i>
            Name
          </template>
            {{user.name}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-s-data"></i>
            Gender
          </template>
          <span v-if="changing">
            <el-radio-group v-model="user.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </span>
          <span v-else>{{user.gender}}</span>
        </el-descriptions-item>


        <el-descriptions-item>
          <template #label>
            <i class="el-icon-mobile-phone"></i>
            Telephone
          </template>
          <span v-if="changing">
            <el-input v-model="user.phone"/>
          </span>
          <span v-else>{{user.phone}}</span>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-location-outline"></i>
            Place
          </template>
          <span v-if="changing">
            <el-input v-model="user.place"/>
          </span>
          <span v-else>{{user.place}}</span>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-tickets"></i>
            Remarks
          </template>
          <el-tag size="small">School</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-office-building"></i>
            Address
          </template>
          <span v-if="changing">
            <el-input v-model="user.address"/>
          </span>
          <span v-else>{{user.address}}</span>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-link"></i>
            Github
          </template>
          <span v-if="changing">
            <el-input v-model="user.github"/>
          </span>
          <a :href="user.github" target="_blank" v-else>{{user.github}}</a>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-message"></i>
            E-mail
          </template>
          <span v-if="changing">
            <el-input v-model="user.email"/>
          </span>
          <a :href="'mailto:'+user.email" target="_blank" v-else>{{user.email}}</a>
        </el-descriptions-item>

        <el-descriptions-item>
          <template #label>
            <i class="el-icon-date"></i>
            BirthDay
          </template>
          <span v-if="changing">
            <el-date-picker
              v-model="user.birth"
              type="date"
            />
          </span>
          <span v-else>{{user.birth}}</span>
        </el-descriptions-item>

      </el-descriptions>
    </div>
  </el-card>
</template>

<script>
  import {updateUser} from '@/api/login'
  import Avatar from '@/components/common/Avatar.vue'
  import UploadImage from '@/components/upload/UploadImage.vue'

  export default {
    name: 'CardMe',
    components: {
      Avatar,
      UploadImage,
    },
    data() {
      return {
        changing: false,
        changeAvatar: false,
        user: {
          name: this.$store.state.user.name,
          account: this.$store.state.user.account,
          phone: this.$store.state.user.phone,
          place: this.$store.state.user.place,
          address: this.$store.state.user.address,
          github: this.$store.state.user.github,
          email: this.$store.state.user.email,
          avatar: this.$store.state.user.avatar,
          birth: this.$store.state.user.birth,
          gender: this.$store.state.user.gender,
        },
      }
    },
    methods: {
      setAvatar(url){
        this.user.avatar = url
        this.changeAvatar = false
      },
      async change(){
        this.changing = !this.changing
        if(this.changing == false){
          await updateUser({
            id: this.$store.state.user.id,
            ...this.user,
          })
          await this.$store.dispatch('getUserInfo')
          this.$message({
            type: 'success',
            message: '更新成功',
          })
        }
      },

    }
  }
</script>

<style scoped>

  .el-descriptions__label { /**不知道为什么还是改不了宽度 */
    width: 150px, !important;
  }
  .is-bordered-label{
    width: 150px, !important;
  }
  .is-left {
    width: 150px, !important;
  }
  .me-author-name {
    text-align: center;
    font-size: 30px;
    top:10px;
    border-bottom: 1px solid #0f0f0f;
  }

  .me-author-description {
    padding: 8px 0;
  }

  .me-icon-job {
    padding-left: 16px;
  }

  .me-author-tool {
    text-align: center;
    padding-top: 10px;
  }

  .me-author-tool i {
    cursor: pointer;
    padding: 4px 10px;
    font-size: 30px;
  }
</style>
