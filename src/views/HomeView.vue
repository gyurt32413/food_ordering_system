<template>
  <div class="store-info">
    <h1>{{ storeInfo.storeName }}</h1>
    <h3>{{ storeInfo.phone }}</h3>
    <h3>{{ storeInfo.address }}</h3>
  </div>
  <div class="categories">
    <div v-for="(category, index) in categories" :key="index" class="categorie">
      {{ category }}
    </div>
  </div>
</template>

<script>
import googleApi from "../apis/googleSheet";

export default {
  name: "HomeView",
  data() {
    return {
      categories: [],
      storeInfo: {},
    };
  },
  created() {
    this.fetchStoreInfo();
  },
  methods: {
    async fetchStoreInfo() {
      try {
        const { data } = await googleApi.getStoreInfo("50嵐");

        // 取得店家資料
        this.storeInfo.storeName = data.values[0][0];
        this.storeInfo.phone = data.values[1][0];
        this.storeInfo.address = data.values[2][0];

        // 取得食物資料
        let items = [];
        let title = data.values[3];
        for (let i = 4; i < data.values.length; i++) {
          items.push({
            [title[0]]: data.values[i][0],
            [title[1]]: data.values[i][1],
            [title[2]]: data.values[i][2],
            [title[3]]: data.values[i][3],
            [title[4]]: data.values[i][4],
          });
        }

        // 取得食物種類
        items.forEach((item) => {
          if (!this.categories.includes(item.category)) {
            this.categories.push(item.category);
          }
        });

        this.storeInfo.items = items;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
