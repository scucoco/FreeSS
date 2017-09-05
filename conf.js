const conf = {
    base_url: "http://ss.ishadowx.com/",//这玩意儿是关键
    qrdecodParseeUrl: "http://xxxxx.xxxx.xxx", //解析二维码图片
    mail: {
        template: "<!DOCTYPEhtml><html><head><title>ssaccount</title></head><body><table></table></body></html>",
        host: "smtp.qq.com",
        port: 465,
        auth: {
            user: "xxxxx",//邮箱用户名
            pass: "xxxxx"//邮箱密码
        },
        mailOptions: {
            from: "SSman <xxx@xxx.com>",
            to: "xxxx@qq.com, xxx@qq.com",
            subject: "最新账号",
            html: "",
        }
    }
};

module.exports = conf;