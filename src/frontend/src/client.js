import fetch from "unfetch";

const url = "api/v1/students";

const checkStatus = response => {

    if(response.ok) {
        return response;
    }

    //convert non-2xx HTTP responses to errors
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}


export const getAllStudents = () => {

   return fetch(url)
        .then(checkStatus);
}

export const addNewStudent = student => {

    return fetch(url, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(student)
    })
    .then(checkStatus);
}

export const deleteStudent = student => {

    console.log(student);

    return fetch(url, { 
        headers: {
            "Content-Type": "application/json"
        },
        method: "DELETE",
        body: JSON.stringify(student)
    }).then(checkStatus);
}