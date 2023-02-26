
var wifi = require('Wifi');
var http = require('http');
// wifi名称
var WIFI_NAME = "X30_5G";
// wifi 参数
var WIFI_OPTIONS = {
    password: "12345678",
};
console.log("connecting...");
//已连接wifi的事件
wifi.on('connected', function () {
    wifi.getIP((err, info) => {
        if (err !== null) {
            throw err;
        }
        //获取一下所在wifi下的局域网IP地址
        console.log(info.ip, 'connected');
        startServer()
    });
});
// 连接wifi
wifi.connect(WIFI_NAME, WIFI_OPTIONS, err => {
    if (err !== null) {
        throw err;
    }
});

// 开启服务的函数
function startServer() {
    var PORT = 1314;
    http.createServer(serverCallback).listen(PORT);
    console.log(`server is running listen ${PORT}`);
}

// 服务的回调函数
function serverCallback(req, res) {
    //使用url 模块对请求地址进行解析
    var URL = url.parse(req.url, true);
    //判断请求是不是post 并且路径名称是不是/led
    if (req.method === 'POST' && URL.pathname == '/led') {
        var data = ''
        req.on('data', (chunk) => {
            data += chunk
        })
        req.on('end', () => {
            var params = JSON.parse(data)
            // 0 和 1  0是低电平开启灯   1是高电平关闭等
            digitalWrite(NodeMCU.D4, params.status);
            res.end('ok');
        })
    } else {
        return res.end('err')
    } 
}