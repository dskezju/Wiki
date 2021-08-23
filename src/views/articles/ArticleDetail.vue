<template>
  <div style="width: 100%">
    <div class="article clearfix">
      <div
        v-show="!state.isLoading"
        :style="{'width': state.isMobileOrPc ? '100%' : '75%'}"
        class="article-left fl"
      >
        <div class="header">
          <!-- 标题 -->
          <h1 class="title">
            {{state.articleDetail.title}}

            <span>
            <!-- 如果作者是自己就显示编辑按钮，点击进入编辑，用id防止同名同姓 -->
            <el-button
              v-if="state.articleDetail.author.id == $store.state.user.id"
              @click="editArticle"
              style="position: absolute;left: 60%;"
              size="mini"
              round
              icon="el-icon-edit"
            >
              编辑
            </el-button>
            </span>
          </h1>

          <!-- 作者信息 -->
          <div class="author">
            <!-- 头像 -->
            <avatar :src='$store.state.user.avatar'/>
            <!-- 作者名字、发布时间等 -->
            <div class="info">
              <span class="name">
                <span>{{state.articleDetail.author.name}}</span>
              </span>
              <div
                props-data-classes="user-follow-button-header"
                data-author-follow-button=""
              />
              <div class="meta">
                <span class="publish-time">
                  {{state.articleDetail.createDate? formatTime(state.articleDetail.createDate): ''}}
                </span>
                <span class="wordage">
                  字数 {{state.articleDetail.wordNum}}
                </span>
                <span class="views-count">
                  阅读 {{state.articleDetail.viewCounts}}
                </span>
                <span class="comments-count">
                  评论 {{state.articleDetail.commentCounts}}
                </span>
                <span class="likes-count">
                  喜欢 {{state.articleDetail.likes}}
                </span>
                 <span v-if="state.articleDetail.updateTime" class="publish-time">
                  最近更新于：
                  {{formatTime(state.articleDetail.updateTime)}}
                </span>
              </div>
            </div>
            <!-- 标签 -->
            <div
              class="tags "
              title="标签"
            >
              <el-tag
                size="mini"
                v-for="tag in state.articleDetail.tags"
                :key="tag.id"
                class="tag"
                type="success"
              >
                {{tag.tagName}}
              </el-tag>
            </div>
            <span class="clearfix" />
          </div>
        </div>

        <!-- 文章，直接用渲染好的html放上去 -->
        <div class="content">
          <!-- <div
            id="content"
            class="article-detail"
            v-html="state.articleDetail.content"
          >
          </div> -->
          <markdown-editor :editor="state.editor"/>
        </div>

        <!-- 点赞 -->
        <div class="heart">
          <el-button
            type="danger"
            size="large"
            icon="heart"
            :loading="state.isLoading"
            @click="likeArticle"
          >
            点赞
          </el-button>
        </div>

        <!-- 评论框 -->
        <div class="comment">
          <el-input
            placeholder="文明社会，理性评论"
            type="textarea"
            v-model="state.comment_content"
          ></el-input>
          <el-button
            style="margin-top: 15px"
            type="primary"
            :loading="state.btnLoading"
            @click="handleAddComment"
          >发 送</el-button>
        </div>

        <CommentList
          v-if="!state.isLoading"
          :numbers="state.articleDetail.commentCounts"
          :list="state.articleDetail.comments"
          :article_id="state.articleDetail.id"
          :article_author_id='state.articleDetail.author.id'
          @refreshArticle="refreshArticle"
        />
      </div>

      <!-- 右边渲染的目录 -->
      <div
        v-if="!state.isMobileOrPc"
        style="width: 23%"
        class="article-right fr anchor"
        v-html="state.articleDetail.toc"
      ></div>

      <LoadingCustom v-if="state.isLoading"></LoadingCustom>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import {useStore} from 'vuex'
import {key} from "@/store"
import { timestampToTime, isMobileOrPc } from "@/utils/utils";
import markdown from "@/utils/markdown";
import LoadingCustom from "@/components/Loading.vue";
import CommentList from "@/components/CommentList.vue";
import {
  ArticleDetailIF,
} from "@/types";
import {viewArticle, updateArticleLikes} from '@/api/article'
import {getCommentsByArticle, publishComment} from '@/api/comment'
import Avatar from '@/components/Avatar.vue'
import MarkdownEditor from '@/components/markdown/MarkdownEditor.vue'

declare let document: Document | any;
function click(e) {
  console.log('e:', e)
}
export default defineComponent({
  name: "ArticleDetail",
  components: {
    LoadingCustom,
    CommentList,
    Avatar,
    MarkdownEditor,
  },
  setup() {
    const state = reactive({
      btnLoading: false,
      isLoadEnd: false,
      isLoading: false,
      isMobileOrPc: isMobileOrPc(),
      comment_content: "",
      editor: {
        value: '',
        mode: 'preview', //预览模式
      },
      articleDetail: {
        toc: "", //这个是前端用marked生成的
        id: -1,
        author: {},
        comments: [],
        commentCounts: 0,
        viewCounts: 0,
        likes: 0,
        createDate: "",
        summary: "",
        content: "",
        avatar: "",
        wordNum: 0,
        likedUsers: [],
        state: 1,
        tags: [],
        category: {},
        title: "",
        updateTime: "",
      } as any,
    });

    const store = useStore(key)
    //setup里没有this，也就没有this.$route
    const route = useRoute();
    const router = useRouter();

    const formatTime = (value: string | Date): string => {
      return timestampToTime(value, true);
    };

    //根据state.params搜索文章，渲染markdown
    const handleSearch = async (): Promise<void> => {
      state.isLoading = true;
      //获取文章详情，params是关于文章的类型
      const data: any = await viewArticle(route.params.id)
                                .catch(() => {router.push('/')})
      const comments: any = await getCommentsByArticle(route.params.id)

      state.isLoading = false;
      console.log('article data:', data)
      console.log('comments:', comments)

      state.articleDetail = data.data;
      state.articleDetail.comments = comments.data
      state.articleDetail.content = data.data.body.content
      state.editor.value = data.data.body.content

      //用自定义marked渲染markdown
      const article = markdown.marked(data.data.body.content);
      article.then((res: any) => { //取出渲染结果，包括内容和toc
        state.articleDetail.content = res.content;
        state.articleDetail.toc = res.toc;
      });
      let title = data.data.title;
      document.title = title;
    };

    //当新增评论时刷新文章
    const refreshArticle = (): void => {
      handleSearch();
    };

    const likeArticle = async (): Promise<void> => {
      //未登录不能点赞
      if (!store.state.user.id) {
        ElMessage({
          message: "登录才能点赞，请先登录！",
          type: "warning",
        });
        return;
      }

      const user_id = store.state.user.id
      if(state.articleDetail.likedUsers.find(item=>item.id==user_id)){
        ElMessage({
          message: '已经点赞过了！',
          type: 'warning',
        })
        return;
      }

      //更新文章点赞数
      const data = await updateArticleLikes(state.articleDetail.id, user_id) as any
      console.log('data:', data)
      if(data.data.msg == 'success'){
        state.isLoading = false;
        ++state.articleDetail.likes;
        state.articleDetail.likedUsers.push({id: user_id})
        ElMessage({
          message: "操作成功",
          type: "success",
        });
      }
    };

    //添加评论
    const handleAddComment = async (): Promise<void> => {
      if (!state.comment_content) {
        ElMessage({
          message: "请输入内容!",
          type: "warning",
        });
        return;
      }
      if (!store.state.user.id) {
        ElMessage({
          message: "登录才能评论，请先登录！",
          type: "warning",
        });
        return;
      }

      state.btnLoading = true;
      //增加一条评论，在这里添加的是一级评论
      await publishComment({
        article: {
          id: state.articleDetail.id,
        },
        toUser: '',
        content: state.comment_content,
      });
      state.btnLoading = false;
      state.comment_content = "";
      ElMessage({
        message: "操作成功",
        type: "success",
      });
      handleSearch(); //刷新文章
    };

    const editArticle = () => {
      router.push(`/edit/article/${state.articleDetail.id}`)
    }

    onMounted(() => {
      handleSearch();
    });

    return {
      state,
      formatTime,
      handleSearch,
      handleAddComment,
      likeArticle,
      refreshArticle,
      editArticle,
    };
  },
});
</script>

<style lang="less" scoped>
.anchor {
  display: block;
  position: sticky;
  top: 213px;
  margin-top: 213px;
  border-left: 1px solid #eee;
  .anchor-ul {
    position: relative;
    top: 0;
    max-width: 250px;
    border: none;
    -moz-box-shadow: 0 0px 0px #fff;
    -webkit-box-shadow: 0 0px 0px #fff;
    box-shadow: 0 0px 0px #fff;

    li.active {
      color: #009a61;
    }
  }
  a {
    color: #333;
  }
}
.article {
  width: 100%;
  .header {
    .title {
      margin: 20px 0 0;
      text-align: center;
      font-size: 34px;
      font-weight: bold;
    }
    .author {
      position: relative;
      margin: 30px 0 40px;
      padding-left: 50px;
      .avatar { //这里的样式会覆盖avatar组件里的.avatar样式
        position: absolute;
        left: 0;
        top: 0;
        width: 48px;
        height: 48px;
        border: 1px solid #ddd;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .info {
        float: left;
        vertical-align: middle;
        // display: inline-block;
        margin-left: 8px;
        a {
          color: #333;
        }
      }
      .name {
        margin-right: 3px;
        font-size: 16px;
        vertical-align: middle;
      }
      .meta {
        margin-top: 5px;
        font-size: 12px;
        color: #969696;
        span {
          padding-right: 5px;
        }
      }
      .tags {
        float: right;
        padding-top: 15px;
        // padding-right: 20px;
        .tag {
          // padding: 0 10px;
          margin-left: 5px;
          border-right: 2px solid #eee;
        }
      }
    }
  }
  .content {
    min-height: 300px;
  }
}
.heart {
  height: 60px;
  text-align: center;
  margin: 50px;
}
.loader {
  color: rgb(226, 44, 44);
  text-align: center;
  padding: 50px;
  font-size: 16px;
}
.clearfix {
  clear: both;
}
</style>

