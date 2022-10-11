<template>
  <main>
    <div class="banner"></div>
    <div class="slogan">
      <p>肚子餓了嗎?趕快點餐吧~</p>
    </div>
  </main>
</template>

<style scoped>
main {
  position: relative;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(https://www.netcostmarket.com/wp-content/uploads/2019/10/food-background-1.jpg);
}
.banner {
  position: absolute;
  top: 0;
  height: 360px;
  width: 100%;
  background: #dddddd
    url("https://assets-lighthouse.s3.amazonaws.com/uploads/image/file/5720/restaurants-list-cover.jpg")
    center center;
  background-size: cover;
  filter: blur(3px);
}
.slogan {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 300px;
  width: 380px;
  height: 80px;
  border-radius: 10px;
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.1);
  background: rgba(232, 213, 199, 0.931);
}
.slogan p {
  margin-bottom: 0;
  font-size: 20px;
  letter-spacing: 2px;
  color: rgb(198, 51, 14);
}
@media screen and (min-width: 768px) {
  .slogan {
    width: 600px;
    height: 120px;
  }
  .slogan p {
    font-size: 30px;
  }
}
</style>
