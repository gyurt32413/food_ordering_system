import axios from "axios";
import $ from "jquery";

// const testData = {
//   name: "測試先生",
//   phone: "0912345678",
//   time: "2018/02/10 22:46:00",
//   order: "鹹酥雞 * 1",
//   price: "40",
// };

export default {
  getStoreInfo(storeName) {
    return axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/values/${storeName}?alt=json&key=AIzaSyAe-zDjqngmdcB2SlOctNzf8RJWuBj--xU`
    );
  },
  getAllStore() {
    return axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/values/total-store!A2:C?alt=json&key=AIzaSyAe-zDjqngmdcB2SlOctNzf8RJWuBj--xU`
    );
  },
  sendOrder(data) {
    return $.ajax({
      type: "post",
      // api url - google appscript 產出的 url
      url: "https://script.google.com/macros/s/AKfycbyhluk8hq_c24n_Azv4F53NFgHdQOuD2LugT-P80drNF4Y9zLk34_7ZKReOxJj7pMJv/exec",
      // 剛剛整理好的資料帶入
      data,
    });
  },
  sendEmail(data) {
    return $.ajax({
      // 這邊用get type
      type: "post",
      // api url - google appscript 產出的 url
      url: "https://script.google.com/macros/s/AKfycbxoZ3DDxuh6PdwY0NfA7F5fyVfGT-zMC8RJiQeQGrCaxcM_t6pmKniZv0blw14B2z_7/exec",
      // 剛剛整理好的資料帶入
      data,
    });
  },
};
