import fetch from './handler'

const headers =  {
  Authorization: "Bearer " + localStorage.getItem("token"),
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Credentials": "true",
}

export const getApplications = () => {
  return fetch({
    method: 'GET',
    url: '/application',
    headers: headers
  })
}

export const addApplication = (application) => {
  console.log(application)
  return fetch({
    method: "POST",
    url: "/application",
    body: JSON.stringify(application.applicationData),
    headers: {...headers, "Content-Type": "application/json"}
  });
};

export const editApplication = (application) => {
  console.log(JSON.stringify({application}))
  return fetch({
    method: "POST",
    url: "/updateapplications",
    body: JSON.stringify({application}),
    headers: headers
  });
};

export const deleteApplication = (applicationid) => {
  return fetch({
    method: "DELETE",
    url: `/application/${applicationid}`,
    headers: headers
  });
};


export const getResume = () => {
  return fetch({
    method: 'GET',
    url: '/resume',
    headers: {...headers, "Content-Type": "multipart/form-data"}
  }).then(res => console.log(res)).catch(err => console.log(err))
}

export const addResume = (file) => {
  console.log(file)
  return fetch({
    method: "POST",
    url: "/resume",
    body: file,
    headers: {...headers, "Content-Type": "multipart/form-data"}
  }).then(res => console.log("Resume added successfully")).catch(err => console.log(err))
};