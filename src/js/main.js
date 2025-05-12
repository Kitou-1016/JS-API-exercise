/*eslint-disable*/
import "../css/normalize.css";
import "../css/style.css";
import { routerQueryReplace, routerQueryPush, routerQueryRemove, getParams } from "./utils/url";
import { apiGetTagsList, apiGetTagsProduct } from "../api";
import loading from "./utils/load.js";

const tagParent = document.querySelector(".parent");
const tagChild = document.querySelector(".child");
const content = document.querySelector(".content");
let tagsArr = [];
let productsArr = []; // 存 抓取產品資料
let tagsHtml = "";
let tagsChildHtml = "";
let productsHtml = "";

// 產品列表渲染
const productsRender = () => {
  productsHtml = "";
  if (productsArr.length === 0) {
    productsHtml = "<h1 class='no_data'>目前尚無任何資料</h1>";
  } else {
    productsArr.forEach((item) => {
      productsHtml += `
        <div class="card">
          <h1>${item.title}</h1>
          <a href="${item.url}" target="_blank">${item.url}</a>
          <p>${item.content}</p>
        </div>
      `;
    });
  }
  content.innerHTML = productsHtml;
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// 抓取產品資料
const fetchProducts = async () => {
  try {
    const params = {};
    const tagQuery = getParams().get("tag");
    const childQuery = getParams().get("child");

    if (tagQuery) params.tag = tagQuery;
    if (childQuery) params.child = childQuery;
    const res = await apiGetTagsProduct(params);
    productsArr = res.data;
  } catch (error) {
    console.error(error);
  }
};

// 第一層 tags 渲染
const tagsRender = () => {
  tagsHtml = "";
  const queryTag = getParams().get("tag");
  tagsArr.forEach((item) => {
    tagsHtml += `<a id="${item.id}" class="${queryTag === item.id ? "active" : ""}">
      ${item.name}
    </a>`;
  });
  tagParent.innerHTML = tagsHtml;
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// 第二層 tags 渲染
const tagChildRender = () => {
  tagsChildHtml = "";
  const queryTag = getParams().get("tag");
  const childTag = getParams().get("child");
  const queryTagArr = tagsArr.filter((item) => item.id === queryTag);
  queryTagArr.forEach((childItem) => {
    childItem.child.forEach((item) => {
      tagsChildHtml += `<a id="${item.id}" class="${childTag === item.id ? "active" : ""}">${item.name}</a>`;
    });
  });
  tagChild.innerHTML = tagsChildHtml;
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// 抓 tags 所有資料
const fetchTags = async () => {
  try {
    const res = await apiGetTagsList();
    tagsArr = res.data;
    console.log("tagsArr:", tagsArr);
  } catch (error) {
    console.error(error);
  }
};

// 1. 確認有沒有query網址, 沒有就新增
const routeCheck = () => {
  if (window.location.search === "") {
    routerQueryReplace("tag=frontEnd");
    routerQueryReplace("child=javascript");
  }
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// 抓產品資料 跟 渲染
const fetchProductsRender = async () => {
  await fetchProducts(); // 抓取產品資料
  await productsRender(); // 產品列表渲染
};

// 第一層 tag event listener
const addTagListener = () => {
  const tagParentAll = document.querySelectorAll(".parent > a");

  tagParentAll.forEach((aLink) => {
    aLink.addEventListener("click", async (e) => {
      loading.show();
      const tagId = e.target.id;
      routerQueryPush(`tag=${tagId}`);
      tagParentAll.forEach((item) => {
        item.classList.toggle("active", item.id === tagId);
      });
      routerQueryRemove("child");
      await tagChildRender();
      await fetchProductsRender();
      await addTagChildListener();
      loading.hidden();
    });
  });
  return new Promise((resolve) => setTimeout(resolve, 0));
};

// 第二層 tag event listener
const addTagChildListener = async () => {
  const tagChildAll = document.querySelectorAll(".child > a");
  tagChildAll.forEach((aLink) => {
    aLink.addEventListener("click", async (e) => {
      loading.show();
      const tagId = e.target.id;
      routerQueryPush(`child=${tagId}`);
      tagChildAll.forEach((item) => item.classList.remove("active"));
      e.target.classList.add("active");
      await fetchProductsRender();
      loading.hidden();
    });
  });
};

// 初始化
const init = async () => {
  loading.show();
  await routeCheck(); // 網址確認
  await fetchTags(); // 抓 tags 所有資料
  await tagsRender(); // 第一層 tags 渲染
  await tagChildRender(); // 第二層 tags 渲染
  await fetchProductsRender(); // 抓產品資料以及渲染
  loading.hidden();
  addTagListener();
  addTagChildListener();
};

init();

window.addEventListener("popstate", async (e) => {
  loading.show();
  await tagsRender();
  await tagChildRender();
  await fetchProductsRender();

  // 第一層 tag active 樣式切換
  const tagParentAll = document.querySelectorAll(".parent > a");
  const queryTag = getParams().get("tag");
  tagParentAll.forEach((alink) => {
    alink.classList.toggle("active", alink.id === queryTag);
  });

  // 第二層 tag active 樣式切換
  const tagChildAll = document.querySelectorAll(".child > a");
  const childTag = getParams().get("child");
  tagChildAll.forEach((alink) => {
    alink.classList.toggle("active", alink.id === childTag);
  });

  addTagListener();
  addTagChildListener();
  loading.hidden();
});
