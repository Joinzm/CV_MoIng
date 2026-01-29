"use strict";

// element toggle function
const elementToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () {
  elementToggleFunc(sidebar);
});

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
// const testimonialsModalFunc = function () {
//   modalContainer.classList.toggle("active");
//   overlay.classList.toggle("active");
// };
const testimonialsModalFunc = function () {
  if (!modalContainer || !overlay) return;

  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
};
// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector(
      "[data-testimonials-title]"
    ).innerHTML;
    modalText.innerHTML = this.querySelector(
      "[data-testimonials-text]"
    ).innerHTML;

    testimonialsModalFunc();
  });
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () {
  elementToggleFunc(this);
});

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
// const filterItems = document.querySelectorAll("[data-filter-item]");
let filterItems = [];

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "全部") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// // page navigation variables
// const navigationLinks = document.querySelectorAll("[data-nav-link]");
// const pages = document.querySelectorAll("[data-page]");

// // add event to all nav link
// for (let i = 0; i < navigationLinks.length; i++) {
//   navigationLinks[i].addEventListener("click", function () {

//     for (let i = 0; i < pages.length; i++) {
//       if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
//         pages[i].classList.add("active");
//         navigationLinks[i].classList.add("active");
//         window.scrollTo(0, 0);
//       } else {
//         pages[i].classList.remove("active");
//         navigationLinks[i].classList.remove("active");
//       }
//     }

//   });
// }

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// 读取 URL 参数（注意：不要只读一次，后面 popstate 还要读）
function getPageFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("page");
}

// 统一规范化（去掉首尾空格）
function norm(s) {
  return (s || "").trim();
}

// 激活指定页面的函数
function activatePage(pageName, options = { updateURL: true, push: true }) {
  const target = norm(pageName);
  if (!target) return;

  let matched = false;

  for (let i = 0; i < pages.length; i++) {
    const pageKey = norm(pages[i].dataset.page);

    const isActive = target === pageKey;
    pages[i].classList.toggle("active", isActive);

    // ⚠️ 你这里假设 pages 和 navigationLinks 数量/顺序一致
    // 为稳一点，加个存在判断
    if (navigationLinks[i]) {
      navigationLinks[i].classList.toggle("active", isActive);
    }

    if (isActive) matched = true;
  }

  // 如果没匹配到，什么都不做（避免把所有页面都隐藏）
  if (!matched) return;

  window.scrollTo(0, 0);

  // 更新 URL 参数但不刷新页面
  if (options.updateURL) {
    const url = new URL(window.location.href);
    url.searchParams.set("page", target);

    // pushState：点击会产生历史记录，浏览器后退能回到上一页
    if (options.push) {
      history.pushState({ page: target }, "", url);
    } else {
      // replaceState：不产生历史记录，只替换当前记录
      history.replaceState({ page: target }, "", url);
    }
  }
}

// 页面加载时检查并恢复之前的页面状态
window.addEventListener("DOMContentLoaded", function () {
  const currentPageFromURL = getPageFromURL();

  if (currentPageFromURL) {
    activatePage(currentPageFromURL, { updateURL: false });
  } else {
    // 如果没有page参数，检查当前是否有active页面
    let activePageName = null;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].classList.contains("active")) {
        activePageName = pages[i].dataset.page;
        break;
      }
    }

    // 如果没有active页面，激活第一个页面
    if (!activePageName && pages.length > 0) {
      activePageName = pages[0].dataset.page;
      activatePage(activePageName, { updateURL: true, push: false }); // 初始用 replace
    } else if (activePageName) {
      // 将当前active页面的状态同步到URL
      const url = new URL(window.location.href);
      url.searchParams.set("page", norm(activePageName));
      history.replaceState({ page: norm(activePageName) }, "", url);
    }
  }
});

// 支持浏览器前进/后退：根据 URL 切页面
window.addEventListener("popstate", function () {
  const p = getPageFromURL();
  if (p) activatePage(p, { updateURL: false });
});

// 为所有导航链接添加点击事件
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    const pageName = this.dataset.page || (this.textContent || "").trim();
    activatePage(pageName, { updateURL: true, push: true });
  });
}

fetch("./timeline.yaml")
  .then((res) => res.text())
  .then((yamlText) => {
    const data = jsyaml.load(yamlText);
    const container = document.getElementById("timeline");

    container.innerHTML = data.timeline
      // 按年倒序，双保险
      .sort((a, b) => Number(b.year) - Number(a.year))
      .map(
        (item) => `
          <li class="timeline-item" data-year="${item.year}">
            <h4 class="h4 timeline-item-title">${item.year}</h4>

            <ul class="timeline-sublist">
              ${item.title
                .map((award) => `<li class="timeline-text">${award}</li>`)
                .join("")}
            </ul>
          </li>
        `
      )
      .join("");
  })
  .catch((err) => {
    console.error("Failed to load timeline.yaml", err);
  });

(() => {
  const PROJECTS_YAML = "./projects.yaml";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function renderProjects(projects) {
    const list = $("#project-list");
    const tpl = $("#project-item-template");
    if (!list || !tpl) return;

    list.innerHTML = "";
    const frag = document.createDocumentFragment();

    projects.forEach((p) => {
      const node = tpl.content.cloneNode(true);

      const li = $("li.project-item", node);
      const a = $("a.project-link", node);
      const img = $("img.project-thumb", node);
      const title = $("h3.project-title", node);
      const cat = $("p.project-category", node);
      const sub = $("p.project-subtitle", node);

      li.dataset.category = p.category || "";
      a.href = p.link || "#";
      img.src = p.image || "";
      img.alt = p.alt || p.title || "";
      title.textContent = p.title || "";
      cat.textContent = p.categoryLabel || p.category || "";
      sub.textContent = p.subtitle || "";

      frag.appendChild(node);
    });

    list.appendChild(frag);
  }

  document.addEventListener("click", (e) => {
    const filterBtn = e.target.closest("[data-filter-btn]");
    const selectItem = e.target.closest("[data-select-item]");
    const trigger = filterBtn || selectItem;
    if (!trigger) return;

    // 优先用 data-category；没有就用按钮文字（兼容老模板）
    const category =
      trigger.dataset.category || (trigger.textContent || "").trim();

    // 更新按钮 active（只针对 filter-btn）
    if (filterBtn) {
      $$("[data-filter-btn]").forEach((b) => b.classList.remove("active"));
      filterBtn.classList.add("active");
    }

    filterFunc(category);
  });

  // 加载 YAML 并渲染
  fetch(PROJECTS_YAML)
    .then((res) => res.text())
    .then((yamlText) => {
      const data = jsyaml.load(yamlText);
      const projects = (data && data.projects) || [];
      renderProjects(projects);
      filterItems = document.querySelectorAll("[data-filter-item]");

      filterFunc("全部"); // 初始显示全部
    })
    .catch((err) => {
      console.error("Load projects.yaml failed:", err);
    });
})();
