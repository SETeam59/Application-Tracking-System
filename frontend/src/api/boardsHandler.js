import fetch from "./handler";

const headers =  {
  Authorization: "Bearer " + localStorage.getItem("token"),
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Credentials": "true"
}

export const getDataFunction = () => {
  return fetch({
    url: "/getBoards",
    method: "GET",
    headers: headers,
  })
}

export const createNewBoard = (board) => {
  console.log(JSON.stringify({ board }))
  fetch({
    method: "POST",
    url: "/boards",
    body: JSON.stringify({ board }),
    headers: headers
  })
    .then((res) => {
      console.log("board created", board);
      // let boardid = res.success.split(": ")[1].slice(0, -1);
      // return boardid
    })
    .catch((err) => console.log(err));
};

export const updateBoard = (board) => {
  fetch({
    method: "PUT",
    url: "/boards",
    body: JSON.stringify({ board }),
    headers: headers
  })
    .then((res) => {
      console.log("board updated", board);
      let boardid = res.success.split(": ")[1].slice(0, -1);
      return boardid
    })
    .catch((err) => console.log(err));
};

export const deleteBoard = (board_id) => {
  return fetch({
    method: "DELETE",
    url: `/boards/${board_id}`,
    headers: headers
  })
    .then((res) => {
      // console.log("board deleted", res);
    })
    .catch((err) => console.log(err));
};

export const addColumn = (column) => {
  console.log({column})
  console.log(JSON.stringify({column}))
  return fetch({
    method: "POST",
    url: '/columns',
    body: JSON.stringify({column: {...column, tasks: column.tasks || []}}),
    headers: {...headers, "Content-Type": "application/json"}
  })
    .then((res) => {
      console.log("column created", res);
    })
    .catch((err) => console.log(err));
};

export const updateColumn = (column) => {
  return fetch({
    method: "POST",
    url: `/editcolumns`,
    body: JSON.stringify({column: {...column, id: column._id}}),
    headers: {...headers, "Content-Type": "application/json"}
  })
    .then((res) => {
      // console.log("column updated", res);
    })
    .catch((err) => console.log(err));
};

export const deleteColumn = (col_id) => {
  return fetch({
    method: "DELETE",
    url: `/columns/${col_id}`,
    headers: headers
  })
    .then((res) => {
      // console.log("column deleted", res);
    })
    .catch((err) => console.log(err));
};
