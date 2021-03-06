var express =require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var app_port = process.env.VCAP_APP_PORT || 3000;

var app =express();

app.use(express.static(__dirname + '/home'));

app.get('/msg', function (req, res, next) {
    // 用 superagent 去抓取 https://cnodejs.org/ 的内容
    superagent.get('https://cnodejs.org/')
        .end(function (err, sres) {
            // 常规的错误处理
            if (err) {
                return next(err);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
            // 剩下就都是 jquery 的内容了
            var $ = cheerio.load(sres.text);
            var items = [],
                items2=[];
            //console.log($)
            $('#topic_list .topic_title').each(function (idx, element) {
                var $element = $(element);
                items.push({
                    title: $element.attr('title'),
                    href: $element.attr('href')
                });
            });
            $('#topic_list .user_avatar img').each(function(i,ele){
                var $element = $(ele);
                items2.push({
                    imgurl: $element.attr('src'),
                    author: $element.attr('title')
                });
            })
            for(var i in items){
                items[i].imgurl=items2[i].imgurl;
                items[i].author=items2[i].author;

            }
            res.send(items);
        });
});

var server = app.listen(app_port, function(req, res){
    console.log('Listening on port %d', server.address().port);
});