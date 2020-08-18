import axios from 'axios'
import Vue from 'vue'
import router from './router'

const http = axios.create({
    baseURL : 'http://localhost:3000/admin/api'
})
//挂载请求头的authorization，用于服务器登录校验
http.interceptors.request.use(config=>{
    if(localStorage.token){
        config.headers.Authorization = 'Bearer '+localStorage.token
    }
    return config
},err=>{
    return Promise.reject(err)
})
//响应拦截器
http.interceptors.response.use(res=>{
    return res
},err=>{
    if(err.response.data.message){
        Vue.prototype.$message({
            type:'error',
            message:err.response.data.message
        })
    }
    if(err.response.status===401){
        router.push('/login')
    }

    return Promise.reject(err)
})



export default http