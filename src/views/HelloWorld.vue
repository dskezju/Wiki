<template>
  <h1>{{ msg }}</h1>
  <button @click="count++">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>

  <!-- <markdown-editor style='minHeight:400px' :editor='editor'/> -->
  <div>
    <v-md-editor v-model="text" height="400px"></v-md-editor>
    <md-editor
      v-model='text'
      height='600px'
      :onUploadImg='onUploadImg'/>
  </div>
</template>

<script>
import MdEditor from 'md-editor-v3'
import 'md-editor-v3/lib/style.css';
// import MarkdownEditor from './markdown/MarkdownEditor.vue'

export default {
  name: 'HelloWorld',
  components: {
    // MarkdownEditor,
    MdEditor,
  },
  props: {
    msg: String
  },
  data() {
    return {
      editor: {
        value: '',
        ref: '',
      },
      text: '',
      count: 0,
      value1: 0,
      value2: 0,
    }
  },
  methods: {
      async onUploadImg(files, callback) {
        const res = await Promise.all(
            Array.from(files).map((file) => {
            return new Promise((rev, rej) => {
                const form = new FormData();
                form.append('file', file);

                // axios
                // .post('/api/img/upload', form, {
                //     headers: {
                //     'Content-Type': 'multipart/form-data'
                //     }
                // })
                // .then((res) => rev(res))
                // .catch((error) => rej(error));
                rev({data: {url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg'}})
            });
            })
        );

        callback(res.map((item) => item.data.url));
        }
  }
}
</script>
