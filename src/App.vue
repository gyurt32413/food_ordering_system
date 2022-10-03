<template>
  <nav class="nav-bar">
    <div class="title">
      <font-awesome-icon class="food-icon" icon="fa-solid fa-utensils" />
      <h1>今天吃甚麼？</h1>
    </div>
    <router-link
      v-for="store in selectedStore"
      :key="store.router"
      :to="'/' + store.router"
      >{{ store.name }}</router-link
    >
  </nav>
  <router-view />
  <footer>
    <div class="footer-container">
      <span>Copyright © 2022-2022 今天吃甚麼？</span>
    </div>
  </footer>
</template>

<script>
import googleAPI from "./apis/googleAPI";
export default {
  name: "App",
  data() {
    return {
      selectedStore: [],
    };
  },
  created() {
    this.getSelectedStore();
  },
  methods: {
    async getSelectedStore() {
      try {
        const { data } = await googleAPI.getAllStore();
        const filterData = data.values.filter((item) => item[2] === "TRUE");
        filterData.forEach((item) => {
          this.selectedStore.push({
            router: item[0],
            name: item[1],
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
/* Css reset */

*:where(:not(html, iframe, canvas, img, svg, video):not(svg *, symbol *)) {
  all: unset;
  display: revert;
}

/* Preferred box-sizing value */
*,
*::before,
*::after {
  box-sizing: border-box;
}

.h1,
.h2,
.h3,
.h4,
.h5,
.h6,
h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
}

/* Reapply the pointer cursor for anchor tags */
a,
button {
  cursor: revert;
}

/* Remove list styles (bullets/numbers) */
ol,
ul,
menu {
  list-style: none;
}

/* For images to not be able to exceed their container */
img {
  max-width: 100%;
}

/* removes spacing between cells in tables */
table {
  border-collapse: collapse;
}

/* Safari - solving issue when using user-select:none on the <body> text input doesn't working */
input,
textarea {
  -webkit-user-select: auto;
}

/* revert the 'white-space' property for textarea elements on Safari */
textarea {
  white-space: revert;
}

/* minimum style to allow to style meter element */
meter {
  -webkit-appearance: revert;
  appearance: revert;
}

/* reset default text opacity of input placeholder */
::placeholder {
  color: unset;
}

/* fix the feature of 'hidden' attribute.
   display:revert; revert to element instead of attribute */
:where([hidden]) {
  display: none;
}

/* revert for bug in Chromium browsers
   - fix for the content editable attribute will work properly.
   - webkit-user-select: auto; added for Safari in case of using user-select:none on wrapper element*/
:where([contenteditable]:not([contenteditable="false"])) {
  -moz-user-modify: read-write;
  -webkit-user-modify: read-write;
  overflow-wrap: break-word;
  -webkit-line-break: after-white-space;
  -webkit-user-select: auto;
}

/* apply back the draggable feature - exist only in Chromium and Safari */
:where([draggable="true"]) {
  -webkit-user-drag: element;
}

* {
  margin: 0;
  padding: 0;
  border: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding-top: 10px;
  padding-bottom: 10px;
  /* border: 1px solid #000; */
  display: flex;
  box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.08);
}

nav .title {
  margin-left: 50px;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
nav .title h1 {
  margin: 0;
  margin-left: 5px;
}
nav .title h1,
.food-icon {
  font-size: 24px;
  font-weight: 600;
  color: rgb(231, 35, 165);
}

nav a {
  margin: 10px;
  font-weight: bold;
  color: #42b983;
  text-decoration: none;
}

.footer-container {
  background: #ccc;
  padding: 10px;
  letter-spacing: 0.5px;
  font-weight: 500;
  color: #000;
}
</style>
