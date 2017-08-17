var superagent = require('superagent');
var cheerio = require('cheerio');
var nodemailer = require('nodemailer');

var targetUrl = 'http://ss8.6gg6.net/#free'; //地址可能会换
var hostRe = /http[s]?:\/\/\w+.\w+.\w+\//;
var host = hostRe.exec(targetUrl);
host = host[0];

var smtpTransport = nodemailer.createTransport({
    host: "smtp.qq.com",
    secureConnection: true,
    port: 465,
    auth: {
        user: "邮箱账号",
        pass: "邮箱密码"
    }
});

var mailOptions = {
    from: "SSman <发送的邮箱账号>",
    to: "接收的邮箱账号1, 接收的邮箱账号2",
    subject: "最新账号",
    html: ""
}

var imgSrc = [];

superagent.get(targetUrl)
    .end(function(err, res) {
        if (err) {
            return console.error(err);
        }
        var $ = cheerio.load(res.text);
        var re = /http[s]?:\/\/.+/;

        $('.container .icon-grid section img').each(function(idx, element) {
            var $element = $(element);
            var src = $element.attr("src");
            if (!re.test(src)) {
                _imgUrl = host + src;
                imgSrc.push('<img src="' + _imgUrl + '" />');
            }
        });

        var html = imgSrc.join("<br/>");
        mailOptions.html = html;
        smtpTransport.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + JSON.stringify(response));
            }
            smtpTransport.close();
        });
    });

//定时任务(每4个小时的第一分钟获取一下)
//1 */4 * * * node app.js
