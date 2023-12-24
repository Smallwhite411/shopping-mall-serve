import mongoose, { Document, Model, Schema } from "mongoose";

interface IUser extends Document {
    username: string;
    password: string;
    roles: string,
    status: boolean,
    createTime: DateConstructor
}

export default class DBconfig {
    private informationManagementSchema: Schema;
    private InformationManagementMessage: Model<IUser>; //文档类型
    constructor() {
        this.informationManagementSchema = new Schema({
            username: String,
            password: String,
            roles: String,
            status: Boolean,
            createTime: String
        })
        this.InformationManagementMessage = mongoose.model<IUser>("Management", this.informationManagementSchema)
    }

    public async getUserPasswordMessages(data: any) { //登陆查询，用户名和密码是否正确
        const person = await this.InformationManagementMessage.find({
            username: data.data.username
        })
        const checkout = await this.InformationManagementMessage.find({
            username: data.data.username,
            password: data.data.password
        })
        console.log(person,data)
        if (person.length === 0) {
            console.log("走到这里了")
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
                username: {$ne: username}
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
}