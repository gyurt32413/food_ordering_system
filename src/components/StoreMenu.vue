<template>
  <SpinnerAnimation v-if="isLoading" />
  <main v-else>
    <div class="vendor-section">
      <div class="food-picture-wrapper">
        <img v-show="!isLoading" :src="storePicture" alt="food-picture" />
      </div>
      <div class="vendor-container">
        <div class="store-info">
          <h3 class="storeName">{{ storeInfo.storeName }}</h3>
          <h3 class="phone">{{ storeInfo.phone }}</h3>
          <h3 class="address">{{ storeInfo.address }}</h3>
        </div>
        <div class="product-categories-wrapper">
          <div class="product-categories">
            <button
              v-for="(category, index) in categories"
              :key="index"
              class="category"
              @click="changeCurrentCategory(category)"
              :class="{ focus: category === currentCategory }"
            >
              {{ category }}
            </button>
          </div>
        </div>
        <div class="product-items">
          <button
            v-for="item in storeInfo.items"
            :key="item.itemId"
            v-show="item.category === currentCategory"
            class="product-item"
            @click="addProductToCart(item)"
          >
            <div class="item-name">
              {{ item.itemName }}
            </div>
            <div class="item-price">$ {{ item.price }}</div>
          </button>
        </div>
      </div>
    </div>
    <input type="checkbox" id="cart-toggle" />
    <label @click="toTop" class="cart-toggle-label" for="cart-toggle">
      <div class="total-cart-num">{{ totalCartNum }}</div>
      <font-awesome-icon class="bag-icon" icon="fa-solid fa-bag-shopping"
    /></label>
    <aside class="cart-section">
      <font-awesome-icon
        class="cancel-button"
        icon="fa-regular fa-circle-xmark"
        @click="cancelCart"
      />
      <div class="cart-container">
        <div class="cart-header">
          <h4>{{ storeInfo.storeName }}</h4>
        </div>
        <div class="cart-items-wrapper">
          <ul class="cart-items">
            <li v-for="item in cartItems" :key="item.itemId" class="cart-item">
              <div class="cart-item-name">{{ item.itemName }}</div>
              <div class="cart-item-price">$ {{ countProductPrice(item) }}</div>
              <div class="cart-item-amount">
                <div
                  v-if="item.itemNum === 1"
                  @click="deleteProductFromCart(item.itemId)"
                >
                  <i class="bi bi-trash"></i>
                </div>
                <div v-else @click="minusProductNum(item.itemId)">
                  <i class="bi bi-dash-circle"></i>
                </div>
                <div class="cart-item-num">{{ item.itemNum }}</div>
                <div @click="addProductNum(item.itemId)">
                  <i class="bi bi-plus-circle"></i>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="cart-footer">
          <div class="total-price">
            <span>????????????</span>
            <span>$ {{ countTotalPrice }}</span>
          </div>
          <button
            type="button"
            class="btn btn-primary order-btn"
            data-bs-toggle="modal"
            data-bs-target="#checkout-modal"
            :class="{ disabled: !cartItems.length }"
          >
            ??????
          </button>
        </div>
      </div>
    </aside>
  </main>
  <!-- ?????????????????? -->
  <div
    class="modal fade"
    id="checkout-modal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="staticBackdropLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="staticBackdropLabel">
            {{ storeInfo.storeName }}
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="cart-items-wrapper">
            <ul class="cart-items">
              <li
                v-for="item in cartItems"
                :key="item.itemId"
                class="cart-item"
              >
                <div class="cart-item-name">{{ item.itemName }}</div>
                <div class="cart-item-price">
                  $ {{ countProductPrice(item) }}
                </div>
                <div class="cart-item-amount">
                  <div class="cart-item-num">X {{ item.itemNum }}</div>
                </div>
              </li>
            </ul>
          </div>
          <div class="total-price">
            <span>????????????</span>
            <span>$ {{ countTotalPrice }}</span>
          </div>
          <div class="cart-footer">
            <div class="orderer-info">
              <div class="orderer-name">
                <input
                  type="text"
                  class="form-control"
                  placeholder="??????????"
                  v-model="ordererName"
                />
              </div>
              <div class="orderer-email">
                <input
                  type="email"
                  class="form-control"
                  placeholder="???????????????e-mail"
                  v-model="ordererEmail"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            ??????
          </button>
          <button
            type="submit"
            class="btn btn-primary"
            data-bs-dismiss="modal"
            @click="sendEmailToOrder()"
          >
            ????????????
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  import
*/
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import googleApi from "../apis/googleAPI";
import moment from "moment";
import nonePicture from "../assets/food-picture.jpeg";
import swal from "sweetalert";
import SpinnerAnimation from "../components/SpinnerAnimation.vue";

moment.locale("zh-tw");

const route = useRoute();
let isLoading = ref(false);

/* 
  ??????????????????
*/
let storeInfo = ref({});
let categories = ref([]);

//  ????????????????????????
const fetchStoreInfo = async () => {
  try {
    isLoading.value = true;
    const { data } = await googleApi.getStoreInfo(route.name);
    //  ??????????????????
    storeInfo.value.storeName = data.values[0][0];
    storeInfo.value.phone = data.values[1][0];
    storeInfo.value.address = data.values[2][0];
    storeInfo.value.picture = data.values[3][0];
    //  ??????????????????
    let items = [];
    let title = data.values[4];
    for (let i = 5; i < data.values.length; i++) {
      items.push({
        [title[0]]: data.values[i][0],
        [title[1]]: data.values[i][1],
        [title[2]]: data.values[i][2],
        [title[3]]: data.values[i][3],
      });
    }

    //  ??????????????????
    items.forEach((item) => {
      if (!categories.value.includes(item.category)) {
        categories.value.push(item.category);
      }
    });
    storeInfo.value.items = items;
    isLoading.value = false;
  } catch (error) {
    console.log(error);
    isLoading.value = false;
    swal({
      text: "??????????????????????????????????????????",
      icon: "error",
    });
  }
};
fetchStoreInfo();
//  ??????????????????
const storePicture = computed(() => {
  return storeInfo.value.picture ? storeInfo.value.picture : nonePicture;
});

/* 
  ??????????????? 
*/
let cartItems = ref([]);
//  ???????????????????????????
const totalCartNum = computed(() => {
  let totalNum = 0;
  cartItems.value.forEach((item) => (totalNum += item.itemNum));
  return totalNum;
});

//  ?????????????????????
const countTotalPrice = computed(() => {
  let totalPrice = 0;
  cartItems.value.forEach((item) => {
    totalPrice += item.itemNum * item.itemPrice;
  });
  return totalPrice;
});

//  ?????????????????????????????????localStorage
watch(
  cartItems,
  () => {
    localStorage.setItem(route.name, JSON.stringify(cartItems.value));
  },
  { deep: true }
);

//  ??????????????????localStorage?????????????????????
cartItems.value = JSON.parse(localStorage.getItem(route.name));
cartItems.value = cartItems.value ? cartItems.value : [];

//  ?????????????????????
const cancelCart = () => {
  const checkbox = document.getElementById("cart-toggle");
  checkbox.checked = false;
};
//  ???????????????????????????
const toTop = () => {
  window.scroll(0, 0);
};

/*
  ???????????? 
*/
//  ??????????????????
let currentCategory = ref("");
const changeCurrentCategory = (category) => {
  currentCategory.value = category;
};

//  ????????????????????????
const addProductToCart = (item) => {
  //  ????????????????????????????????????
  let cartIdArray = cartItems.value.map((property) => property.itemId);
  let currentCartId = cartIdArray.indexOf(item.itemId);
  //  ????????????????????????????????????
  if (currentCartId === -1) {
    cartItems.value.push({
      itemId: item.itemId,
      itemName: item.itemName,
      itemPrice: item.price,
      itemNum: 1,
    });
    //  ??????????????????????????????+1
  } else {
    cartItems[currentCartId].itemNum++;
  }
  swal({
    text: "????????????????????????",
    icon: "success",
  });
};

//  ????????????
const deleteProductFromCart = (itemId) => {
  let cartIdArray = cartItems.value.map((property) => property.itemId);
  let currentCartId = cartIdArray.indexOf(itemId);
  cartItems.value.forEach((property) => {
    if (property.itemId === itemId) {
      cartItems.value.splice(currentCartId, 1);
    }
  });
};

//  add????????????
const addProductNum = (itemId) => {
  cartItems.value.forEach((property) => {
    if (property.itemId === itemId) {
      property.itemNum++;
    }
  });
};
//  minus????????????
const minusProductNum = (itemId) => {
  cartItems.value.forEach((property) => {
    if (property.itemId === itemId) {
      property.itemNum--;
    }
  });
};
//  ????????????????????????
const countProductPrice = (item) => {
  return item.itemNum * item.itemPrice;
};

/* 
  ??????????????????
*/
let ordererName = ref("");
let ordererEmail = ref("");
//  ????????????????????????
const sendEmailToOrder = async () => {
  //  ??????????????????????????????
  if (!ordererName.value || !ordererEmail.value) {
    swal({
      text: "???????????????????????????e-mail",
      icon: "warning",
    });
    return;
  }
  let items = "";
  cartItems.value.forEach((item) => {
    items += `${item.itemName}*${item.itemNum} `;
  });
  isLoading.value = true;
  try {
    const response = await googleApi.sendEmail({
      mail: ordererEmail.value,
      orderInfo: items,
    });
    if (response === "??????") {
      //  ?????????????????????????????????????????????googlesheet
      handleSubmit();
      swal({
        text: "????????????!",
        icon: "success",
      });
      isLoading.value = false;
      cartItems.value = [];
    }
  } catch (error) {
    console.log("error");
    swal({
      text: "??????????????????????????????????????????????????????-mail",
      icon: "error",
    });
    isLoading.value = false;
  }
};

//  ???????????????googlesheet
const handleSubmit = async () => {
  let items = "";
  cartItems.value.forEach((item) => {
    items += `${item.itemName}*${item.itemNum} `;
  });
  let order = {
    name: ordererName.value,
    mail: ordererEmail.value,
    time: moment().format("lll"),
    store: storeInfo.value.storeName,
    items,
    totalPrice: countTotalPrice.value,
  };
  try {
    const response = await googleApi.sendOrder(order);
    console.log(response);
  } catch (error) {
    swal({
      text: "????????????????????????????????????",
      icon: "error",
    });
    console.log(error);
  }
};
</script>

<style scoped>
ul {
  padding: 0;
}
main {
  flex: 1;
  position: relative;
  width: 100%;
  display: flex;
}
.vendor-section {
  flex: 1;
}

.food-picture-wrapper {
  height: 360px;
}
.food-picture-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-info,
.product-categories-wrapper .product-categories,
.product-items {
  width: 90%;
  margin: 0px auto;
}
.product-items {
  margin-bottom: 90px;
}
.store-info {
  margin-top: 20px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.store-info h3 {
  font-size: 18px;
  color: #767676;
}

.store-info .storeName {
  font-weight: 600;
  color: black;
  font-size: 30px;
}

.phone {
  margin: 10px 0;
}
.product-categories-wrapper {
  margin: 20px 0;
  border-top: 1px solid rgb(214, 207, 207);
  padding: 10px;
  box-shadow: 0 5px 5px 0px rgba(0, 0, 0, 0.08);
}
.product-categories {
  margin: 30px 0;
  display: flex;
}
.category {
  margin-right: 30px;
  position: relative;
  font-size: 18px;
  padding: 12px 0px;
  color: #767676;
}
.category:hover {
  cursor: pointer;
}
.category::after {
  content: "";
  width: 100%;
  height: 2px;
  background: rgb(244, 25, 171);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(0, 1);
  transition: transform 0.2s ease-out;
}
.category:hover::after {
  transform: scale(1, 1);
}

.focus::after {
  transform: scale(1, 1);
}

.product-items {
  margin-top: 10px;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-gap: 20px;
}
.product-item {
  padding: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000;
  font-size: 17px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}

.product-item:hover {
  cursor: pointer;
  background-color: rgb(202, 158, 158);
}

#cart-toggle {
  display: none;
}

#cart-toggle:checked ~ .cart-section {
  transform: scale(1, 1);
  opacity: 1;
}
.cart-toggle-label {
  position: fixed;
  top: 90vh;
  right: 30px;
  width: 45px;
  height: 45px;
  padding: 5px;
  border-radius: 50%;
  background: rgb(227, 223, 223);
}
.cart-toggle-label:hover {
  cursor: pointer;
}

.total-cart-num {
  position: absolute;
  top: -10px;
  right: 0;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border-radius: 50%;
  background: red;
  color: #fff;
}

.bag-icon {
  font-size: 30px;
  color: rgb(244, 25, 171);
}

.cart-section {
  position: absolute;
  top: 0px;
  right: 0;
  bottom: 0;
  padding-top: 20px;
  width: 100vw;
  box-shadow: -2px 0px 2px 1px rgba(0, 0, 0, 0.08);
  background: #fff;
  transform: scale(0, 1);
  opacity: 1;
}
.cancel-button {
  position: absolute;
  top: 25px;
  right: 25px;
  font-size: 24px;
}
.cancel-button:hover {
  cursor: pointer;
}
.cart-container {
  width: 70%;
  margin: 50px auto;
}

.cart-item {
  min-height: 70px;
  position: relative;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.cart-item-amount {
  position: absolute;
  display: flex;
  align-items: center;
  top: 40px;
  right: 10px;
  padding: 5px;
}
.cart-item-amount:hover {
  cursor: pointer;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}
.cart-item-num {
  margin: 0 10px;
}

.cart-item-name,
.bi-trash,
.bi-dash-circle,
.bi-plus-circle {
  color: rgb(244, 25, 171);
  font-size: 17px;
  font-weight: 500;
}

.total-price {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(0, 0, 0, 0.5);
  padding: 20px;
}

.order-btn {
  width: 100%;
  border: none;
  background: rgb(244, 25, 171);
}

.modal-body {
  width: 80%;
  margin: 0 auto;
}

.btn-primary {
  border: none;
  background: rgb(244, 25, 171);
}
.btn-primary:hover {
  background: rgb(244, 25, 171);
  opacity: 0.8;
}
.form-control {
  margin: 0 auto;
  width: 60%;
}
.form-control:focus {
  border-color: rgb(162, 119, 222);
  box-shadow: none;
}
.orderer-email {
  margin: 20px auto;
}

@media screen and (min-width: 768px) {
  .cart-section {
    position: static;
    padding-top: 20px;
    width: 350px;
    box-shadow: -2px 0px 2px 2px rgba(0, 0, 0, 0.08);
    transform: scale(1, 1);
    opacity: 1;
  }
  .cart-toggle-label {
    display: none;
  }
  .cancel-button {
    display: none;
  }
  .store-info,
  .product-categories-wrapper .product-categories,
  .product-items {
    width: 70%;
  }
  .category {
    margin-right: 50px;
  }
}

@media screen and (min-width: 1080px) {
  .food-picture-wrapper {
    height: 400px;
  }
}
</style>
