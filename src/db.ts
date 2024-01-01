import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
    username: string;
    password: string;
    roles: string,
    status: boolean,
    createTime: DateConstructor
}

interface IRegister extends Document {
    approvalCode: string
    shopName: string,
    chargePerson: string,
    licenseInformation: string,
    shopLocation: string,
    phone: string,
    email: string,
    isAdmin: boolean,
    isHandle: boolean,
    refuseReason: string,
    type: 'Pass' | 'Refuse' | 'Unapproved',
}

export default class DBconfig {
    private informationManagementSchema: Schema;
    private registerManagementSchema: Schema;
    private RegisterManagementMessage: Model<IRegister>; //注册信息
    private InformationManagementMessage: Model<IUser>; //文档类型
    constructor() {
        this.informationManagementSchema = new Schema({
            username: String,
            password: String,
            roles: String,
            status: Boolean,
            createTime: String
        })

        this.registerManagementSchema = new Schema({
            approvalCode: String,
            shopName: String,
            chargePerson: String,
            licenseInformation: String,
            shopLocation: String,
            phone: String,
            email: String,
            isAdmin: Boolean,
            isHandle: Boolean,
            refuseReason: String,
            type: String
        })

        this.InformationManagementMessage = mongoose.model<IUser>("Management", this.informationManagementSchema)
        this.RegisterManagementMessage = mongoose.model<IRegister>("Register", this.registerManagementSchema)
    }

    public async getUserPasswordMessages(data: any) { //登陆查询，用户名和密码是否正确
        const person = await this.InformationManagementMessage.find({
            username: data.data.username
        })
        const checkout = await this.InformationManagementMessage.find({
            username: data.data.username,
            password: data.data.password
        })
        if (person.length === 0) {
            // console.log("走到这里了")
            return {
                message: "没有找到此账号，请检查是否输入错误",
                isLogin: false
            };
        } else {
            if (checkout.length !== 0) {
                return {
                    message: "账号密码正确",
                    isLogin: true
                }
            }
            return {
                message: "密码输入错误",
                isLogin: false
            };
        }
    }

    public async createPersonMessage(username: string, password: string) { //初始化角色的时候调用
        const personMessage = new this.InformationManagementMessage({
            username: username,
            password: password,
            status: true,
            createTime: new Date(),
            roles: "user"
        })

        const result = await personMessage.save()
        // console.log("我已经添加了", result, personMessage)
        return result;
    }

    public async getPersonMessages(username: any) { //查询用户是否存在
        if (username === undefined) {
            const person = await this.InformationManagementMessage.find({
                username: { $ne: username }
            })
            return person;
        } else {
            const person = await this.InformationManagementMessage.find({
                username: username
            })
            return person;
        }

    }

    public async removePersonMultiply(id: string) { //从集合中删除所有匹配条件的文档。行为与remove()类似，但不管使用哪个选项，都会删除所有符合条件的文档。
        const result = await this.InformationManagementMessage.deleteMany({
            _id: id
        });

        return result.deletedCount;
    }

    // 向数据库内添加申请注册数据
    public async registerAccout(data: IRegister) {
        const registerMessage = new this.RegisterManagementMessage({
            approvalCode: data.email, //code就是手机号 唯一
            shopName: data.shopName,
            chargePerson: data.chargePerson,
            licenseInformation: data.licenseInformation,
            shopLocation: data.shopLocation,
            phone: data.phone,
            email: data.email,
            isAdmin: false,
            isHandle: false,
            refuseReason: '',
            type: 'Unapproved'
        })

        const result = await registerMessage.save()
        return result;
    }
    // 向数据库内添加申请注册数据
    public async getAccountRegisterApprove(data: IRegister) {
        const registerMessage = await this.RegisterManagementMessage.find({
            isHandle: data.isHandle
        })
        return registerMessage;
    }

    // 修改注册审批商户状态
    public async updateManagementStatus(data: IRegister) {
        // 根据id更新数据
        const registerMessage = await this.RegisterManagementMessage.updateOne({
            approvalCode: data.approvalCode
        }, {
            type: data.type,
            isHandle: true,
            refuseReason: data.refuseReason
        })
        return registerMessage;
    }

    // 修改注册审批商户状态
    public async getTotal() {
        // 根据id更新数据
        const untreated = await this.RegisterManagementMessage.find({
            isHandle: false
        })
        const processed = await this.RegisterManagementMessage.find({
            isHandle: true
        })

        const untreatedNumber = untreated.length;
        const processedNumber = processed.length;


        return { untreatedNumber, processedNumber };
    }

    // 获取已审批成功商户
    public async getAccountPage() {
        const registerMessage = await this.RegisterManagementMessage.find({
            isHandle: true,
            type: 'Pass'
        })

        return registerMessage;
    }

    // 上传图片
    public async uploadFile() {
        // const registerMessage = await this.RegisterManagementMessage.find({
        //     isHandle: true,
        //     type: 'Pass'
        // })
        // console.log('我是查询0', registerMessage);

        // return registerMessage;
    } 

}