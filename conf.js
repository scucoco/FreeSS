const conf = {
    base_url: "http://global.ishadowx.net/",//这玩意儿是关键
    qrdecodParseeUrl: "https://zxing.org/w/decode?u=", //解析二维码图片
    mail: {
        host: "smtp.qq.com",
        port: 465,
        auth: {
            user: "397369",//邮箱用户名
            pass: "lsl801201^"//邮箱密码
        },
        mailOptions: {
            from: "SSman <xxx@xxx.com>",
            to: "397369@qq.com, 985835531@qq.com",
            subject: "最新账号",
            html: "",
        }
    }
};

module.exports = conf;
