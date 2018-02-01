const superagent = require('superagent');
const cheerio = require('cheerio');
const async = require('async');
const nodemailer = require('nodemailer');
const conf = require('./conf');

let url = conf.base_url;
let qrdecodeParseUrl = conf.qrdecodParseeUrl;

superagent.get(url).end(function(err, res) {
    if (err) {
        return console.error(err);
    }

    let $ = cheerio.load(res.text);
    let _redirect_url = $('#portfolio > div.container > div.row.text-center.center > a').attr('href');
    superagent.get(_redirect_url).end(function(err, res) {
        if (err) {
            return console.error(err);
        }

        let _redirects = res.redirects;
        let _domain = _redirects[0]; //这里才是包含ss账号的网址
        if (_domain != undefined) {
            var imgs = [];
            imgs.push(_domain + '/img/qr/jpaxxoo.png');
            imgs.push(_domain + '/img/qr/jpbxxoo.png');
            imgs.push(_domain + '/img/qr/jpcxxoo.png');

            //这里是把二维码解析成字符串
            async.mapLimit(imgs, 5, function(obj, callback) {
                superagent.get(qrdecodeParseUrl + obj).end(function(err, res) {
                    if (err) {
                        return console.error(err);
                    }
                    let _obj = {
                        src: obj,
                        ssTxt: res.text,
                    };
                    callback(null, _obj);
                });

            }, function(err, result) {
                makeMessage(result);
            });
        }
    });
});

function makeMessage(data) {
    let html = '<!DOCTYPE html><html><head><meta charset="utf-8" /><title>ssaccount</title></head><body><table>';
    for (let i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.ssTxt != 'error') {
            let str = "";
            str += "<tr>";
            str += "<td><img src='" + item.src + "'/></td>";
            str += "<td>" + item.ssTxt + "</td>";
            str += "</tr>";
            html += str;
        }
    }
    html += "</table></body></html>";
    sendMail(html);
}

function sendMail(message) {
    let mail_conf = conf.mail;
    let smtpTransport = nodemailer.createTransport({
        host: mail_conf.host,
        secureConnection: true,
        port: mail_conf.port,
        auth: {
            user: mail_conf.auth.user,
            pass: mail_conf.auth.pass
        }
    });

    let mailOptions = {
        from: mail_conf.mailOptions.from,
        to: mail_conf.mailOptions.to,
        subject: mail_conf.mailOptions.subject,
        html: ""
    }

    mailOptions.html = message;
    smtpTransport.sendMail(mailOptions, function(err, response) {
        if (err) {
            return console.error(err);
        }

        console.log("Message sent: " + JSON.stringify(response));
        smtpTransport.close();
    });
}
