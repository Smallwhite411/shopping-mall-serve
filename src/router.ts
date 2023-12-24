import express from "express"
import DBconfig from "./db"

const router = express.Router()
const DBconfigs = new DBconfig()

router.post('/users/login',async(request,response) => {
    console.log("成功拿到数据",request.body)
    const data = request.body
    let message = await DBconfigs.getUserPasswordMessages({
        data
    })
    response.send({
        code:0,
        data: {
          token: "x-token"  ,
          message: message.message,
          username: request.body.username,
          isLogin: message.isLogin
        }
    })
})

router.get('/users/info',async(request,response) => {
    console.log("正在获取用户权限",request.query)
    let username = request.query.username;
    let management: any = await DBconfigs.getPersonMessages(username)
    response.send({
        code:0,
        data: {
            username: management[0].username,
            roles: [management[0].roles]
        }
    })
})

router.get('/users/table', async(request,response) => { //查询
    const data = request.query;
    let management: any = await DBconfigs.getPersonMessages(data.username)
    console.log("正在获取用户权限",request.query,management)

    response.send({
        code:0,
        data: {
            list: management
        }
    })
})

router.post('/users/addtable',(request,response) => { //增加
    const data = request.body;
    console.log("我是新增用户",request.body)
    DBconfigs.createPersonMessage(data.username, data.password);
    response.send({
        code:0,
        data: {
            username: data.username
        }
    })
})

router.delete("/users/deletetable/:id", async (req, res) => {
    console.log("我收到了delete请求",req.params.id)
    let status = await DBconfigs.removePersonMultiply(req.params.id)

    res.send({
        code:0,
        data: {
            status: status
        }
    })
})

export default router;