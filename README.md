# order_system
![github](https://github.com/gyurt32413/food_ordering_system/blob/main/%E6%93%B7%E5%8F%96.PNG)

## 簡介
簡易的訂餐系統，支援手機形式。在填完訂單之後，將訂單資訊傳至[googlesheet](https://docs.google.com/spreadsheets/d/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/edit#gid=1529696619)中，方便訂餐者統整所有訂單；且同時會寄一封mail到自己所填的email，以避免忘記自己訂了什麼餐點的窘境。

## 功能
+ 使用者可以瀏覽「今日店家」的所有餐點
+ 使用者可以點擊餐點加入至購物車
+ 使用者可以直接在購物車內選取該餐點的數量
+ 使用者在訂餐後會將訂餐資訊傳至[googlesheet](https://docs.google.com/spreadsheets/d/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/edit#gid=1529696619)
+ 使用者在訂餐後會將訂餐資訊mail至指定的信箱

## 使用方法
1. 先在[googlesheet](https://docs.google.com/spreadsheets/d/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/edit#gid=1529696619)的total-store分頁勾選今日店家  
![demonstration-img](https://github.com/gyurt32413/food_ordering_system/blob/main/readme_img1.PNG)

2. 進入頁面後在導覽列僅會看到勾選的店家名

3. 選擇餐點後填寫名稱及email後送出訂單

4. 在[googlesheet](https://docs.google.com/spreadsheets/d/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/edit#gid=1529696619)的order-list分頁顯示該筆訂單資訊  
![demonstration-img](https://github.com/gyurt32413/food_ordering_system/blob/main/readme_img4.PNG)

5. 在指定的email收到該筆訂單資訊  
![demonstration-img](https://github.com/gyurt32413/food_ordering_system/blob/main/readme_img5.PNG)

##本地執行專案
1. 確認使用環境已有node.js及npm
2. 下載(clone)此專案
    ```
    git clone https://github.com/gyurt32413/food_ordering_system
    ```
3. 透過終端機安裝npm套件
    ```
    npm install
    ```
4. 透過終端機執行該專案
    ```
    npm run serve
    ```
5. 於瀏覽器輸入`http://localhost:8080/` 即可進入該網頁

## 新增店家
1. 在[googlesheet](https://docs.google.com/spreadsheets/d/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/edit#gid=1529696619)新增分頁(名稱為store-{數字英文})，店家的格式請參照store-one分頁
2. 在total-store分頁新增新店家的路由及名稱
3. 在本地專案src/router/index.js 新增路由(路由名稱需跟googlesheet分頁名稱相同)
```
{
    path: "/store3",
    name: "store-three",
    component: () => import("../views/StoreThree.vue"),
}
```
4. 在src/views中新增對應路由的檔案
```
<template>
  <StoreMenu />
</template>

<script>
import StoreMenu from "../components/StoreMenu.vue";

export default {
  components: {
    StoreMenu,
  },
};
</script>
```
5. 重新執行專案後便可在導覽頁看到新增的餐廳(需勾選為本日餐廳)

## 優化方向
該專案較適合菜單簡易的店家，使用者能快速的建置新的菜單，然部分店家的菜單較為複雜，如飲料店樣式眾多，有size和加料等需求。  
日後將針對這種較複雜的店家進行模板優化。

## 備註
以上操作googlesheet的部分有權限限制，如需獲得權限，可將email留言給我，或是自行串接成自己的googlesheet

## 開發工具
+ Node.js 16.16.0
+ Vue 3.2.13
+ Vue-router 4.0.3
+ Apps Script
