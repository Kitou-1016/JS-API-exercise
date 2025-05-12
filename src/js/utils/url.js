const getParams = () => {
  const params = new URLSearchParams(window.location.search);
  return params;
};

const queryParse = (query) => {
  const queryKey = query.split("=")[0];
  if (window.location.search === "") {
    return `?${query}`;
  }
  if (window.location.search.includes(queryKey)) {
    const params = getParams().get(queryKey);
    return window.location.search.replace(`${queryKey}=${params}`, query);
  }
  return `${window.location.search}&${query}`;
};

const parseFindNewQuery = (params, queryIdx) => {
  const { search } = window.location;
  const promiseVal = getParams().get(params);
  let newPath = "";
  if (search[queryIdx - 1] === "&") {
    newPath = search.replace(`&${params}=${promiseVal}`, "");
  }
  if (search[queryIdx - 1] === "?") {
    newPath = search.replace(`${params}=${promiseVal}&`, "");
  }
  return newPath;
};

// 添加 query 參數 push
const routerQueryPush = (params) => {
  const { pathname } = window.location;
  const query = queryParse(params);
  window.history.pushState({ params }, null, `${pathname}${query}`);
};

// 添加 query 參數 replace
const routerQueryReplace = (params) => {
  const { pathname } = window.location;
  const query = queryParse(params);
  window.history.replaceState({ params }, null, `${pathname}${query}`);
};

// 刪除 query 參數 push, params 裡面是 "child"
const routerQueryRemove = (params) => {
  const { search } = window.location;
  const queryIdx = search.indexOf(params);

  if (["?", "&"].includes(search[queryIdx - 1])) {
    const query = parseFindNewQuery(params, queryIdx);
    const { pathname } = window.location;
    window.history.pushState({}, null, `${pathname}${query}`);
  }
};

// 刪除 query 參數 replace
const routerQueryReplaceRemove = (params) => {
  const { search } = window.location;
  const queryIdx = search.indexOf(params);

  if (["?", "&"].includes(search[queryIdx - 1])) {
    const query = parseFindNewQuery(params, queryIdx);
    const { pathname } = window.location;
    window.history.replaceState({}, null, `${pathname}${query}`);
  }
};

export { routerQueryPush, routerQueryReplace, routerQueryRemove, routerQueryReplaceRemove, getParams };
