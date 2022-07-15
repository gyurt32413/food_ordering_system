import axios from "axios";

export default {
  getStoreInfo(storeName) {
    return axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/1piyvpDX-TwZ3MiljL_42Gj3iZpGzr06abymAHciyUDo/values/${storeName}?alt=json&key=AIzaSyAe-zDjqngmdcB2SlOctNzf8RJWuBj--xU`
    );
  },
};
