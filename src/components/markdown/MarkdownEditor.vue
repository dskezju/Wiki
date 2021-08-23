<template>
  <v-md-editor
    v-model="editor.value"
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
    v-bind="editor"
    :include-level="[1,2,3,4]"
  ></v-md-editor>
</template>


<script>
  import {upload} from '@/api/upload'
  import VueMarkdownEditor, { xss } from '@kangc/v-md-editor';

  export default {
    name: 'MarkdownEditor',
    props: {
      editor: Object
    },
    data() {
      return {}
    },
    mounted() {
      //vue3没有$set，因为用reactive可以直接改
      // this.$set(this.editor, 'ref', this.$refs.md)
    },
    methods: {
      //如果写在这里，再由外面通过this.$refs.md.toHtml(value)调用的话，不知道为什么就变成纯文本了
      // toHtml(text){
      //   return xss.process(VueMarkdownEditor.vMdParser.themeConfig.markdownParser.render(text));
      // },
      handleUploadImage(event, insertImage, files) {
        // Get the files and upload them to the file server, then insert the corresponding content into the editor
        console.log(files[0]);
        // const form = new FormData()
        // form.append("file", files[0])
        upload(files[0]).then(res => {
          insertImage({
            url:
              res.data.url,
            desc: '',
            width: 'auto',
            height: 'auto',
          });
        })
        // Here is just an example

      },
      // imgAdd(pos, $file) {
      //   let that = this
      //   let formdata = new FormData();
      //   formdata.append('image', $file);

      //   upload(formdata).then(data => {
      //     // 第二步.将返回的url替换到文本原位置![...](./0) -> ![...](url)
      //     if (data.code == 0) {

      //       that.$refs.md.$img2Url(pos, data.data.url);
      //     } else {
      //       that.$message({message: data.msg, type: 'error', showClose: true})
      //     }

      //   }).catch(err => {
      //     that.$message({message: err, type: 'error', showClose: true});
      //   })
      // },
      // async onUploadImg(files, callback) {
      //   const res = await Promise.all(
      //       Array.from(files).map((file) => {
      //       return new Promise((rev, rej) => {
      //           const form = new FormData();
      //           form.append('file', file);

      //           // axios
      //           // .post('/api/img/upload', form, {
      //           //     headers: {
      //           //     'Content-Type': 'multipart/form-data'
      //           //     }
      //           // })
      //           // .then((res) => rev(res))
      //           // .catch((error) => rej(error));
      //           rev({data: {url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg'}})
      //       });
      //       })
      //   );

      //   callback(res.map((item) => item.data.url));
      //   }
    },
    components: {
    }
  }
</script>
<style scoped>

  .v-note-wrapper.fullscreen {
    top: 60px !important
  }
</style>
