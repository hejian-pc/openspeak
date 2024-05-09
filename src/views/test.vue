<template>
    <div>
    <h2>帖子列表</h2>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <h3>{{ post.title }}</h3>
        <p>{{ post.content }}</p>
        <p>作者: {{ post.author }}</p>
      </li>
    </ul>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    setup() {
        
    },
})
</script>
<style>

</style>
