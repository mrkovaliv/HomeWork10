"use strict";
window.addEventListener("DOMContentLoaded", () => {
  "use strict";
  const inputElement = document.querySelector(".inputData");
  const findBtn = document.querySelector(".findBtn");
  const userInfo = document.querySelector(".userInfo");
  const noUser = document.querySelector(".noUser");
  const userImg = document.querySelector(".userImg");
  const userName = document.querySelector(".userName");
  const numberFollowers = document.querySelector(".numberFollowers");
  const numberRepos = document.querySelector(".numberRepos");
  const userPage = document.querySelector(".userPage");
  const followList = document.querySelector(".followList");
  const repoList = document.querySelector(".repoList");
  let isExist = true;

  async function getJSON(url) {
    const response = await fetch(url);
    if (response.status === 404) {
      isExist = false;
      return;
    } else {
      isExist = true;
      return response.json();
    }
  }
  const getData = (name, type) => {
    if (type === "name") {
      return getJSON(`https://api.github.com/users/${name}`);
    } else if (type === "followers") {
      return getJSON(`https://api.github.com/users/${name}/followers`);
    } else if (type === "repositories") {
      return getJSON(`https://api.github.com/users/${name}/repos`);
    }
  };
  const createElem = (list, name, url) => {
    const elemLi = document.createElement("li");
    elemLi.classList.add("elementList");
    const elemA = document.createElement("a");
    elemA.innerHTML = name;
    elemA.href = url;
    elemA.setAttribute("target", "_blank");
    elemLi.append(elemA);
    list.append(elemLi);
  };
  const clearElements = (elems) => {
    elems.forEach((item) => item.remove());
  };
  const updateUser = async () => {
    let name = inputElement.value;
    clearElements(document.querySelectorAll(".elementList"));
    const user = await getData(name, "name");
    if (isExist) {
      if (!user.name) {
        user.name = "No name";
      }
      userName.innerHTML = `User name: ${user.name}`;
      numberFollowers.innerHTML = `Number of followers: ${user.followers}`;
      numberRepos.innerHTML = `Number of repositories: ${user.public_repos}`;
      userImg.src = user.avatar_url;
      userPage.href = user.html_url;

      if (user.followers > 0) {
        const followers = await getData(name, "followers");
        for (let follower of followers) {
          createElem(followList, follower.login, follower.html_url);
        }
      }

      if (user.public_repos > 0) {
        const repositories = await getData(name, "repositories");
        for (let repository of repositories) {
          createElem(repoList, repository.name, repository.html_url);
        }
      }
      userInfo.style.display = "block";
      noUser.style.display = "none";
    } else {
      userInfo.style.display = "none";
      noUser.style.display = "block";
    }
  };

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  let debounced = debounce(updateUser, 1000);

  findBtn.addEventListener("click", updateUser);
  inputElement.addEventListener("input", debounced);
});
