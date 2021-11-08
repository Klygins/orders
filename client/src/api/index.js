import axios from "axios";

const url = process.env.REACT_APP_backend_url



export const getRole = (token, callback) =>
    axios.get(url + '/get-role', { headers: { 'Authorization': 'Bearer ' + token } })
        .then((res) => {
            callback(res)
        }).catch(err => {
            callback(err)
        });

export const getProfile = (token, callback) =>
    axios.get(url + '/get-profile', { headers: { 'Authorization': 'Bearer ' + token } })
        .then((res) => {
            callback(res)
        }).catch(err => {
            callback(false, err)
        });

export const getOrders = (token, callback) =>
    axios.get(url + '/get-orders', { headers: { 'Authorization': 'Bearer ' + token } })
        .then((res) => {
            callback(res)
        })

export const sendDataToOG = (token, data, callback) =>
    axios({
        method: "POST",
        data: data,
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/send-data-to-og'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })

export const updateOrderData = (token, data, callback) =>
    axios({
        method: "POST",
        data: data,
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/update-order-data'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })

export const deleteOrder = (token, id, callback) =>
    axios({
        method: "POST",
        data: { orderId: id },
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/delete-order'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(false, err)
    })

export const takeOrder = (token, id, callback) =>
    axios({
        method: "POST",
        data: { orderId: id },
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/take-order'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })

export const markOrderAsDone = (token, id, callback) =>
    axios({
        method: "POST",
        data: { orderId: id },
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/mark-as-done'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(err)
    })

export const checkLoggedIn = (token, callback) =>
    axios.get(url + '/login/verify', { headers: { 'Authorization': 'Bearer ' + token } })
        .then((res) => {
            callback(res)
        }).catch(err => {
            callback(false, err)
        });

export const createOrder = (token, parameters, callback) => {
    console.log(token, parameters);
    axios({
        method: "POST",
        data: parameters,
        headers: { "Authorization": `Bearer ${token}` },
        url: url + '/create-order'
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        callback(false, err)
    })
}
export const login = (data, callback) =>
    axios({
        method: 'POST',
        data: {
            username: data.username,
            password: data.password,
        },
        url: url + '/login',
    }).then((res) => {
        callback(res)
    }).catch((err) => {
        if (err.message.includes('401'))
            callback(false, 'Wrong credentials')
        else
            callback(false, err.toString())
    })