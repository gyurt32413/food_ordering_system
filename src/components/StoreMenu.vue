<template>
  <main>
    <div class="vendor-section">
      <div class="vendor-container">
        <div class="store-info">
          <h1 class="storeName">{{ storeInfo.storeName }}</h1>
          <h3 class="phone">{{ storeInfo.phone }}</h3>
          <h3 class="address">{{ storeInfo.address }}</h3>
        </div>
        <div class="store-menu">
          <div class="product-categories">
            <div
              v-for="(category, index) in categories"
              :key="index"
              class="category"
              @click="changeCurrentCategory(category)"
            >
              {{ category }}
            </div>
          </div>
          <ul class="product-items">
            <li
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
            </li>
          </ul>
        </div>
      </div>
    </div>
    <aside class="cart-section">
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
            <span>總計金額</span>
            <span>$ {{ countTotalPrice }}</span>
          </div>
          <button
            type="button"
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#checkout-modal"
            :class="{ disabled: !cartItems.length }"
          >
            訂餐
          </button>
        </div>
      </div>
    </aside>
  </main>

  <!-- 結帳彈出視窗 -->
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
          <div class="cart-footer">
            <div class="orderer-info">
              <div class="orderer-name">
                <input
                  type="text"
                  class="form-control"
                  placeholder="你是誰?"
                  v-model="ordererName"
                />
              </div>
              <div class="orderer-email">
                <input
                  type="email"
                  class="form-control"
                  placeholder="請輸入你的e-mail"
                  v-model="ordererEmail"
                />
              </div>
            </div>
            <div class="total-price">
              <span>總計金額</span>
              <span>$ {{ countTotalPrice }}</span>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="submit"
            data-bs-dismiss="modal"
            class="btn btn-primary"
            @click="sendEmailToOrder()"
          >
            確認訂餐
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import googleApi from "../apis/googleAPI";
import moment from "moment";
moment.locale("zh-tw");

export default {
  name: "StoreMenu",
  data() {
    return {
      categories: [],
      storeInfo: {},
      currentCategory: "",
      cartItems: [
        // {
        //   itemId: "1",
        //   itemName: "魚丸湯",
        //   itemPrice: 30,
        //   itemNum: 1,
        // },
        // {
        //   itemId: "2",
        //   itemName: "肉羹麵",
        //   itemPrice: 55,
        //   itemNum: 1,
        // },
      ],
      ordererName: "",
      ordererEmail: "",
    };
  },
  created() {
    this.fetchStoreInfo();
  },
  computed: {
    // 計算購物車金額
    countTotalPrice() {
      let totalPrice = 0;
      this.cartItems.forEach((item) => {
        totalPrice += item.itemNum * item.itemPrice;
      });
      return totalPrice;
    },
  },
  methods: {
    // 渲染店家資料
    async fetchStoreInfo() {
      try {
        const { data } = await googleApi.getStoreInfo(this.$route.name);

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

    // 選取食物類別
    changeCurrentCategory(category) {
      this.currentCategory = category;
    },

    // 選取餐點至購物車
    addProductToCart(item) {
      // 判定該餐點是否已在購物車
      let cartIdArray = this.cartItems.map((property) => property.itemId);
      let currentCartId = cartIdArray.indexOf(item.itemId);
      // 若購物車不存在則新增餐點
      if (currentCartId === -1) {
        this.cartItems.push({
          itemId: item.itemId,
          itemName: item.itemName,
          itemPrice: item.price,
          itemNum: 1,
        });
        // 若購物車存在餐點數量+1
      } else {
        this.cartItems[currentCartId].itemNum++;
      }
    },

    // 刪除購物車餐點
    deleteProductFromCart(itemId) {
      let cartIdArray = this.cartItems.map((property) => property.itemId);
      let currentCartId = cartIdArray.indexOf(itemId);
      this.cartItems.forEach((property) => {
        if (property.itemId === itemId) {
          this.cartItems.splice(currentCartId, 1);
        }
      });
    },

    // add餐點數量
    addProductNum(itemId) {
      this.cartItems.forEach((property) => {
        if (property.itemId === itemId) {
          property.itemNum++;
        }
      });
    },
    // minus餐點數量
    minusProductNum(itemId) {
      this.cartItems.forEach((property) => {
        if (property.itemId === itemId) {
          property.itemNum--;
        }
      });
    },
    // 計算單個餐點價錢
    countProductPrice(item) {
      return item.itemNum * item.itemPrice;
    },
    //將訂單寄給使用者
    sendEmailToOrder() {
      //檢查是否有填訂單資料
      if (!this.ordererName || !this.ordererEmail) {
        alert("請填入訂購人名稱及e-mail");
        return;
      }
      let items = "";
      this.cartItems.forEach((item) => {
        items += `${item.itemName}*${item.itemNum} `;
      });
      let self = this;
      googleApi
        .sendEmail({
          mail: this.ordererEmail,
          orderInfo: items,
        })
        .done(function () {
          console.log("success");
          //當信箱正確時才會將訂單資料傳給googlesheet
          self.handleSubmit();
          alert("訂購成功!");
        })
        .fail(function () {
          console.log("error");
          alert("無法訂購餐點，請確認是否填入正確信箱");
        });
    },
    //送出訂單至googlesheet
    async handleSubmit() {
      let items = "";
      this.cartItems.forEach((item) => {
        items += `${item.itemName}*${item.itemNum} `;
      });
      let order = {
        name: this.ordererName,
        mail: this.ordererEmail,
        time: moment().format("lll"),
        store: this.storeInfo.storeName,
        items,
        totalPrice: this.countTotalPrice,
      };
      try {
        const response = await googleApi.sendOrder(order);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
main {
  width: 100%;
  display: flex;
}
.vendor-section {
  flex: 1;
}

.vendor-container {
  width: 70%;
  margin: 0 auto;
}

.cart-section {
  width: 352px;
  height: 100vh;
  box-shadow: -2px 0px 5px 1px rgba(0, 0, 0, 0.08);
}
.cart-container {
  width: 80%;
  margin: 0 auto;
}
.vendor-section {
}
.cart-item {
  min-height: 70px;
  position: relative;
  margin-top: 30px;
  padding: 10px;
  /* box-shadow: 0px 0px 5px 1px rgba(166, 80, 80, 0.3); */
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

.phone {
  margin: 15px 0;
}
.product-categories {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.category {
  font-size: 25px;
  padding: 10px;
  border-radius: 20px;
}
.category:hover {
  cursor: pointer;
  background: rgb(217, 220, 90);
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
  font-size: 20px;
  box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
}
.blank {
  flex: 1;
  content: "";
}

.product-item:hover {
  cursor: pointer;
  background-color: rgb(185, 135, 135);
}
</style>
