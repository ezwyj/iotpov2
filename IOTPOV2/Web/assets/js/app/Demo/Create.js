require(['common', 'mqtt'], function ($, mqtt) {
    var rootUrl = OP_CONFIG.rootUrl;

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: '@Model.JsSdkPackage.AppId', // 必填，公众号的唯一标识
        timestamp: '@Model.JsSdkPackage.Timestamp', // 必填，生成签名的时间戳
        nonceStr: '@Model.JsSdkPackage.NonceStr', // 必填，生成签名的随机串
        signature: '@Model.JsSdkPackage.Signature',// 必填，签名
        jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2。详见：http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html
    });

    wx.error(function (res) {
        console.log(res);
        alert('验证失败');
    });

    wx.ready(function () {
        var images = {
            localId: [],
            serverId: []
        };

        $('#ImageSelect').on('click', function () {
            wx.chooseImage({
                success: function (res) {
                    var localIds = res.localIds;
                    $("#img").attr('src', localIds[0]);
                    syncUpload(localIds, 'img');
                }
            });
        });

        var syncUpload = function (localIds, targetInput) {
            var localId = localIds.pop();


            wx.uploadImage({
                localId: localId,
                isShowProgressTips: 1,
                success: function (res) {
                    var serverId = res.serverId; // 返回图片的服务器端ID
                    $("#" + targetInput).data(serverId);
                    //其他对serverId做处理的代码
                    //if (localIds.length > 0) {
                    //    syncUpload(localIds);
                    //}
                }
            });
        };


        //转发到朋友圈
        wx.onMenuShareTimeline({
            title: 'JSSDK朋友圈转发测试',
            link: '',
            imgUrl: '',
            success: function () {
                $Tips('转发成功！');
            },
            cancel: function () {
                $Tips('转发失败！');
            }
        });
        //转发给朋友
        wx.onMenuShareAppMessage({
            title: 'JSSDK朋友圈转发测试',
            desc: '转发给朋友',
            link: '',
            imgUrl: '',
            type: 'link',
            dataUrl: '',
            success: function () {
                alert('转发成功！');
            },
            cancel: function () {
                alert('转发失败！');
            }
        });

    });


    var username = 'chengdu_pov/testdevice';
    var password = 'nd2J/DGjNcYL3kDN1yy8GxxTmKJ0QdLuJIpTu3FFoYA=';
    var hostname = 'chengdu_pov.mqtt.iot.gz.baidubce.com'

    var mqtt = require('mqtt');
    var client = mqtt.connect(hostname, {
        username: username,
        password: password
    });


    client.on('connect', function () {
        client.subscribe('OnLine');
        //        client.publish('OnLine', 'Hello mqtt');
        client.subscribe('OnLine', function () {
            client.on('message', function (topic, message, packet) {
                console.log(topic + ": '" + message);
            });
        });
    });


    $('#ButtonSend').on('click', function () {
        for (var x = 0; x < 36; x++) {
            var sendMessage = "";
            for (var y = 0; y <= 200; y += 10) {
                sendMessage = sendMessage + pick(x, y);
                //var message = x + "_" + y;
                //console.log(message);

            }
            client.publish('OnLine', sendMessage);
        }

    })

    var img = new Image();
    img.src = rootUrl + '/assets/img/test1.png';
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    img.onload = function () {
        ctx.drawImage(img, 0, 0, 270, 360);
        img.style.display = 'none';
    };
    var color = document.getElementById('color');
    function pick(x, y) {
        var pixel = ctx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        var rgba = 'rgba(' + data[0] + ',' + data[1] +
                   ',' + data[2] + ',' + data[3] + ')';
        color.style.background = rgba;
        return RGB2HTML(data[2], data[0], data[1]);
    }


    //function rgbToHex(R, G, B) { return toHex(R) + toHex(G) + toHex(B) }
    function toHex(n) {
        n = parseInt(n, 10);
        if (isNaN(n)) return "00";
        n = Math.max(0, Math.min(n, 255));
        return "0123456789ABCDEF".charAt((n - n % 16) / 16)
             + "0123456789ABCDEF".charAt(n % 16);
    }

    function padRight(str, lenght) {
        if (str.length >= lenght)
            return str;
        else
            return padRight(str + "0", lenght);
    }

    function RGB2HTML(red, green, blue) {
        var decColor = red + 256 * green + 65536 * blue;
        return decColor.toString(16);
    }

    //client.on('message', function (topic, message) {
    //    // message is Buffer

    //    client.end();
    //});

});