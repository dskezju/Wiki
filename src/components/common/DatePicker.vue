<template>
  <el-date-picker
    v-model="time"
    type="date"
    placeholder="Pick a day"
    :disabled-date="disabledDate"
    :shortcuts="shortcuts"
  />
</template>

<script lang="ts">

export default {
  name: 'DatePicker',
  props: {
    time: {
      type: Object,
      required: true,
    }
  },
  methods: {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
  },
  data(){
    return {
      shortcuts: [
        {
          text: 'Today',
          value: new Date(),
        },
        {
          text: 'Yesterday',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            return date
          },
        },
        {
          text: 'A week ago',
          value: () => {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            return date
          },
        },
      ],
    }
  }

}
</script>
