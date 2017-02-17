require(['common', 'mqtt'], function ($, mqtt) {
    var rootUrl = OP_CONFIG.rootUrl;

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: JsSdkPackageAppId, // 必填，公众号的唯一标识
        timestamp: JsSdkPackageTimestamp, // 必填，生成签名的时间戳
        nonceStr: JsSdkPackageNonceStr, // 必填，生成签名的随机串
        signature: JsSdkPackageSignature,// 必填，签名
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
        alert(res);
    });

    wx.ready(function () {
        

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

    var images = {
        localId: [],
        serverId: []
    };

    $('#selectImage').on('click', function () {
        //wx.chooseImage({
        //    success: function (res) {
        //        var localIds = res.localIds;
        //        $("#previewIMG").attr('src', localIds[0]);
        //        var canvas = document.getElementById("canvas");
        //        var ctx = canvas.getContext('2d');
        //        var img = $('#previewIMG')[0]
        //        ctx.drawImage(img, 0, 0, 270, 360);
        //        //syncUpload(localIds, 'img');
        //    }
        //});
        $("#previewIMG").attr('src', rootUrl + 'assets/img/color3.png');
        $("#previewIMG").addClass("carousel-inner img-responsive img-rounded");

        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');
        var img = $('#previewIMG')[0]
        ctx.drawImage(img, 0, 0, 40, 40);
        //syncUpload(localIds, 'img');
    });

    $('#SendPicture').on('click', function () {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext('2d');

        getPiexl(ctx);

    });



    var getPiexl = function (ctx) {
        var count = 180; //180份扇页
        var angle = 0; //当前取数据角度
        var angleStep = 360 / count; //每步度数
        var context = ctx;
        var c = 0;
        var imageLines = [];
        try {
            for (c = 0; c < count; c++) {
                var x = 0, y = 0; //X,Y轴
                var send = "";
                for (r = 0; r < 20; r++) { //r半径来取
                    x = 20 + r * Math.cos(angle * Math.PI / 180); //换成X坐标
                    y = 20 + r * Math.sin(angle * Math.PI / 180); //换成Y坐标
                    var imageData = context.getImageData(x, y, 1, 1); //取X，Y 指定点的一个像素高宽的数据
                    red = imageData.data[0]; //红色值 
                    green = imageData.data[1];  //绿色值 
                    blue = imageData.data[2]; //蓝色值
                    hexi = ("0" + parseInt(green, 10).toString(16)).slice(-2) + ("0" + parseInt(red, 10).toString(16)).slice(-2) + ("0" + parseInt(blue, 10).toString(16)).slice(-2);
                    //组成一个RGB串
                    send = send + hexi;

                    //console.log(x + "_" + y+":"+red+ ' '+green+' '+blue );

                }
                angle += angleStep; //角度加一步
                angle %= 360;
                var sendResult = ("00" + parseInt(c, 10)).slice(-3) + send;
                //console.log(sendResult); //本地打印
                imageLines.push(sendResult);
            }
            upModelData.ImageLines = imageLines;


            $.post(rootUrl + 'DEMO/FirstPost', {
                dataJson: JSON.stringify(upModelData)
            }, function (res) {
                console.log(res.msg);
            });

        }
        catch (err) {

            console.log(err.message);
        }

    }
    

});