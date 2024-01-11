import express from "express"
import DBconfig from "./db"
import multer from 'multer'
import fs from 'fs'
import path from 'path'
const router = express.Router()
const DBconfigs = new DBconfig()

const storage = multer.diskStorage({
    // 上传文件目录
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    // 上传文件名称
    filename: function (req, file, cb) {
        // var changedName = (new Date().getTime()) + '-' + file.originalname;
        cb(null, file.originalname);
    }
})

const upload = multer({
    storage
})
// 创建一个接收为编码的二进制数据流的方法实例 接收 name 为 newimg 字段的上传文件，最大接收为 1
// var cpUpload = upload.fields([{ name: 'newimg', maxCount: 1 }])


router.post('/users/login', async (request, response) => {
    const data = request.body
    let message = await DBconfigs.getUserPasswordMessages({
        data
    })
    response.send({
        code: 200,
        data: {
            token: "x-token",
            message: message.message,
            username: request.body.username,
            isLogin: message.isLogin
        }
    })
})

router.get('/users/info', async (request, response) => {
    // console.log("正在获取用户权限", request.query)
    let username = request.query.username;
    let management: any = await DBconfigs.getPersonMessages(username)
    response.send({
        code: 200,
        data: {
            username: management[0].username,
            roles: [management[0].roles]
        }
    })
})

router.get('/users/table', async (request, response) => { //查询
    const data = request.query;
    let management: any = await DBconfigs.getPersonMessages(data.username)
    // console.log("正在获取用户权限", request.query, management)

    response.send({
        code: 200,
        data: {
            list: management
        }
    })
})

router.post('/users/addtable', (request, response) => { //增加
    const data = request.body;
    DBconfigs.createPersonMessage(data.username, data.password);
    response.send({
        code: 200,
        data: {
            username: data.username
        }
    })
})

router.delete("/users/deletetable/:id", async (req, res) => {
    // console.log("我收到了delete请求", req.params.id)
    let status = await DBconfigs.removePersonMultiply(req.params.id)

    res.send({
        code: 200,
        data: {
            status: status
        }
    })
})

// 管理后台申请注册
router.post('/backstage/account-register', (request, response) => { //增加
    const data = request.body;
    DBconfigs.registerAccout(data);
    response.send({
        message: "请等待1-2个工作日"
    })
})

// 管理后台获取审批注册信息
router.post('/backstage/getAccountRegisterApprove', async (request, response) => { //增加
    const data = request.body;
    const registerMessage = await DBconfigs.getAccountRegisterApprove(data);

    response.send({
        code: 200,
        message: "成功",
        data: {
            records: registerMessage
        },
        total: registerMessage.length,
        tableId: 'ddddd'
    })
})
// 修改注册审批商户状态
router.post('/backstage/approval-management/updateStatus', (request, response) => { //修改成绩
    const data = request.body;
    DBconfigs.updateManagementStatus(data)

    response.send({
        code: 200,
        message: "成功",
    })
})

// 获取审批数量
router.get('/backstage/approval-management/getTotal', async (request, response) => { //查询
    let management = await DBconfigs.getTotal()

    response.send({
        code: 200,
        message: "成功",
        data: {
            untreated: management.untreatedNumber,
            processed: management.processedNumber,
        }
    })
})
// 修改注册审批商户状态
router.post('/backstage/merchant-management/page', async (request, response) => { //修改成绩
    const data = request.body;
    const registerMessage = await DBconfigs.getAccountPage()

    response.send({
        code: 200,
        message: "成功",
        data: {
            records: registerMessage
        },
        total: registerMessage.length,
        tableId: 'ddddd'
    })
})

// 上传图片
router.post('/file/upload', upload.single('file'), async (req, res) => { //修改成绩
    const data = req.file;
    // // const registerMessage = await DBconfigs.getAccountPage()
    console.log(data)
    res.send({
        code: 200,
        message: "成功",
        data: {
            fileId: data.path
        },
    })
})

router.post('/client/register', async (req, res) => { //修改成绩
    const data = req.body;

    const userRegisterMessage = await DBconfigs.userRegister(data)

    res.send({
        code: 200,
        message: "注册成功",
        data: data
    })

})

export default router;