
<template>
  <div class="comment-list">
    <div class="top-title">
      <span>{{numbers}} 条评论</span>
    </div>
    <div
      v-for="(item, i) in list"
      :key="item.id"
      class="item"
    >
      <!-- 评论的人的信息，名字、头像、时间 -->
      <div class="item-header">
        <div class="author">
          <avatar :src="item.author.avatar"/>
        </div>
        <div class="info">
          <div class="name">
            {{item.author.name}}
            {{item.author.id === article_author_id ? '(作者)' : ''}}
          </div>
          <div class="time">
            {{formatTime(item.createDate)}}
          </div>
        </div>
      </div>
      <!-- 评论内容 -->
      <div class="comment-detail">
        {{item.content}}&nbsp;&nbsp;&nbsp;
        <!-- 如果是当前用户的评论，则显示删除按钮 -->
        <el-button
          v-if="$store.state.user.id==item.author.id"
          type="text"
          @click='del(item.id)'
        >
          删除
        </el-button>
      </div>
      <!-- 回复按钮，点击显示Comment组件 -->
      <div class="item-comment">
        <div
          @click="showCommentModal(item.id, item.author)"
          class="message"
        >
          <el-button size="small">回复</el-button>
        </div>
      </div>

      <!-- 当前评论的子评论 -->
      <div
        v-for="e in item.children"
        :key="e.id"
        class="item-other"
      >
        <!-- 评论作者信息 -->
        <div class="item-header">
          <div class="author">
            <avatar :src='e.author.avatar'/>
          </div>
          <div class="info">
            <div class="name">
              {{e.author.name}}
              {{e.author.id === article_author_id ? '(作者)' : ''}}
            </div>
            <div class="time">
              {{formatTime(e.createDate)}}
            </div>
          </div>
        </div>
        <div class="comment-detail">
          <!-- 如果是2级评论，评论的回复里的回复才是2级 -->
          <span v-if='e.level==2'>
            <!-- @xxx(作者?)： -->
            {{'@' + e.toUser.name}}
            {{e.toUser.id === article_author_id ? '(作者)' : ''}}：
          </span>
          {{e.content}}
          &nbsp;&nbsp;&nbsp;
          <!-- 如果是当前用户的评论，则显示删除按钮 -->
          <el-button
            v-if="$store.state.user.id==e.author.id"
            type="text"
            @click='del(e.id)'
          >
            删除
          </el-button>

        </div>
        <div class="item-comment">
          <div class="message">
            <!-- 哪怕是回复里面的回复，parent即第一个参数也是item.id -->
            <el-button
              @click="showCommentModal(item.id, item.author, e.author)"
              size="small"
            >
              回复
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 点击回复时显示 -->
    <Comment
      :visible="state.visible"
      :to_user="state.to_user"
      :parent_id="state.parent_id"
      :article_id="article_id"
      @ok="handleOk"
      @cancel="handleCancel"
    />
  </div>
</template>


<script lang="ts">
import { ElMessage } from "element-plus";
import { defineComponent, defineAsyncComponent, reactive } from "vue";
import { timestampToTime } from "../utils/utils";
import { ToAuthor } from "../types/index";
import {useStore} from 'vuex'
import {key} from '@/store'
import Avatar from '@/components/Avatar.vue'
import {deleteCommentById} from '@/api/comment'

export default defineComponent({
  name: "CommentList",
  components: {
    Comment: defineAsyncComponent(() => import("./Comment.vue")),
    Avatar,
  },
  props: {
    list: {
      // type: Array<never>,
      default: [] as any,
    },
    numbers: {
      type: Number,
      default: 0,
    },
    article_id: {
      type: Number,
      default: -1,
      required: true,
    },
    article_author_id: {
      type: Number,
      required: true,
    }
  },
  emits: ['refreshArticle'],
  setup(props, context) {
    const state = reactive({
      visible: false,
      parent_id: "", //就是被点击回复的评论的id
      to_user: {} //用来在回复的时候传给Comment组件
    });
    const store = useStore(key)

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    const handleCancel = (): void => { //取消，隐藏
      state.visible = false;
    };

    const handleOk = (): void => { //真正发表评论在Comment组件里，这里就只要刷新就行了
      state.visible = false;
      context.emit("refreshArticle"); //触发外部事件，刷新文章
    };

    const del = async (id) => {
      await deleteCommentById(id)
      ElMessage({type: 'success', message: '操作成功', showClose: true})
      context.emit('refreshArticle') //直接刷新算了，在list里删除太麻烦了
    }

    // 点击回复，显示Comment组件
    const showCommentModal = (
      comment_id: string, //大的comment的id，即parent id
      author: ToAuthor, //大的comment的作者
      secondAuthor?: ToAuthor
    ): boolean | void => {
      if (!store.state.user.id) {
        ElMessage({
          message: "登录才能点赞，请先登录！",
          type: "warning",
        });
        return false;
      }
      state.visible = true;
      state.parent_id = comment_id; //设置Comment组件的props
      // 添加2级评论
      if (secondAuthor) {
        state.to_user = secondAuthor;
      } else {
        // 添加1级评论，这里的author是0级评论的作者
        // state.to_user = author;
        state.to_user = '' //1级评论不需要toUser
      }
    };

    return {
      state,
      showCommentModal,
      handleOk,
      handleCancel,
      formatTime,
      del,
    };
  },
});
</script>
<style lang="less" scoped>
.comment-list {
  text-align: center;
}
.comment-list {
  position: relative;
  text-align: left;
  padding-top: 30px;
  margin-top: 30px;
  border-top: 1px solid #eee;
  .avatar {
    position: absolute;
    left: 0px;
  }
  .el-icon-circle-plus {
    font-size: 40px;
  }
}
.clearfix {
  clear: both;
}
.comment-list {
  margin-top: 30px;
  .top-title {
    padding-bottom: 20px;
    font-size: 17px;
    font-weight: 700;
    border-bottom: 1px solid #f0f0f0;
  }
  .item {
    padding: 20px 0 30px;
    border-bottom: 1px solid #f0f0f0;
    .item-header {
      position: relative;
      padding-left: 45px;
      padding-bottom: 10px;
      .author {
        position: absolute;
        left: 0;
        display: inline-block;
        .avatar {
          display: inline-block;
          margin-right: 5px;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .info {
        display: inline-block;
        .name {
          font-size: 15px;
          color: #333;
        }
        .time {
          font-size: 12px;
          color: #969696;
        }
      }
    }
    .comment-detail {
      min-height: 40px;
    }
    .item-comment {
      .like {
        margin-right: 20px;
      }
    }
  }
}
.item-other {
  margin: 20px;
  padding: 10px;
  border-left: 2px solid #f0f0f0;
  .item-header {
    position: relative;
    padding-left: 45px;
    padding-bottom: 10px;
    .author {
      position: absolute;
      left: 0;
      display: inline-block;
      .avatar {
        display: inline-block;
        margin-right: 5px;
        width: 38px;
        height: 38px;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .info {
      display: inline-block;
      .name {
        font-size: 15px;
        color: #333;
      }
      .time {
        font-size: 12px;
        color: #969696;
      }
    }
  }
  .comment-detail {
    min-height: 40px;
    border-bottom: 1px dashed #f0f0f0;
  }
  .message {
    padding: 10px;
  }
}
</style>

