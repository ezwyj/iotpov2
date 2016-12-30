require(['common', 'mqtt'], function ($, mqtt) {
    var rootUrl = OP_CONFIG.rootUrl;

    

    

    $('#file_input').on('change', function () {
        
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#previewIMG')
                .attr('src', e.target.result)
                .width(250)
                .height(200);
            getPiel();
        };
        var input = $(this)[0];
        reader.readAsDataURL(input.files[0]);
    });
    var lmvas;
    var pmvas;
    function getPiel()
    {
        var zxwe = 40;
        var zxwh = 40;
        var zfim = $('#previewIMG')[0];
        lmvas = $('#canvas')[0];
        lmvas.height = lmvas.width = 0;

        var context = lmvas.getContext('2d');
        var cimw = zxwe;
        var cimh = zxwh;
        lmvas.width = cimw;
        lmvas.height = cimh;
        //context.drawImage(zfim, 0, 0, zxwe, zxwh);


        pmvas = $('#canvas2')[0];
        context2 = pmvas.getContext('2d');
        
        pmvas.width = 40;
        pmvas.height = 40;
        context2.drawImage(zfim, 0, 0, 40,40);

        
    }

    var username = 'chengdu_pov/testdevice';
    var password = 'nd2J/DGjNcYL3kDN1yy8GxxTmKJ0QdLuJIpTu3FFoYA=';
    var hostname = 'chengdu_pov.mqtt.iot.gz.baidubce.com'

    // Create a client instance
    client = new Paho.MQTT.Client(hostname, Number(8884), "sdfadsfdasclientId");
    
    // set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // connect the client
    client.connect({ onSuccess: onConnect,useSSL:true });


    // called when the client connects
    function onConnect() {
        // Once a connection has been made, make a subscription and send a message.
        console.log("onConnect");
        client.subscribe("State", { qos: Number(1) });
        client.subscribe("Content", { qos: Number(1) });

    }

    // called when the client loses its connection
    function onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
        }
    }

    // called when a message arrives
    function onMessageArrived(message) {
        console.log("onMessageArrived:" + message.payloadString);
        

    }


    $(document).ready(function () {
       

    });




    $('#SendPicture').on('click', function () {
        var count=100; //100份扇形
        var angle = 0; //当前取数据角度
        var angleStep = 360 / count; //每步度数
        var context = pmvas.getContext('2d');
        var contextTarget = lmvas.getContext('2d');
        var c = 0;

        try{
            for (c = 0; c < count; c++) { 
                var x = 0, y = 0; //X,Y轴
                var send = "";
                for (r = 0; r < 20; r++)  { //r半径来取
                    x = 20 +   r * Math.cos(angle * Math.PI / 180); //换成X坐标
                    y = 20 +   r * Math.sin(angle * Math.PI / 180); //换成Y坐标
                    var imageData = context.getImageData(x, y, 1, 1); //取X，Y 指定点的一个像素高宽的数据
                    red = imageData.data[0]; //红色值 
                    green = imageData.data[1];  //绿色值 
                    blue = imageData.data[2]; //蓝色值
                    hexi = ("0" + parseInt(green, 10).toString(16)).slice(-2) + ("0" + parseInt(red, 10).toString(16)).slice(-2) + ("0" + parseInt(blue, 10).toString(16)).slice(-2);
                    //组成一个RGB串
                    send =  send + hexi;
                
                    //console.log(x + "_" + y+":"+red+ ' '+green+' '+blue );
                    contextTarget.putImageData(imageData, x, y);
                }
                angle += angleStep; //角度加一步
                angle %= 360;
                var sendResult = ("00" + parseInt(c, 10)).slice(-3) + send;
            
                //console.log(sendResult); //本地打印
                message = new Paho.MQTT.Message(sendResult);
                message.retained = false;
                message.destinationName = "Content";
                message.qos = 1;
                client.send(message);
            
            }
            
        }
        catch (err) {
            
            alert(err.message);
            console.log(err.message);
            
        }



    })
    var sleep = 9;
    $('#ChangePicture').on('click', function () {
        var workStateMessageStart = new Paho.MQTT.Message("0");
        workStateMessageStart.retained = false;
        workStateMessageStart.destinationName = "State";
        workStateMessageStart.qos = 2;
        client.send(workStateMessageStart);

        sleep = sleep - 1;
        if (sleep == 0) {
            sleep = 0;
        }
        message = new Paho.MQTT.Message(sleep.toString());
        message.retained = false;
        message.destinationName = "Sleep";
        message.qos = 2;
        client.send(message);
        workStateMessageEnd = new Paho.MQTT.Message("1");
        workStateMessageEnd.retained = false;
        workStateMessageEnd.destinationName = "WorkState";
        workStateMessageEnd.qos = 2;
        client.send(workStateMessageEnd);
            



    })

    $('#SelectPicture').on('click', function () {
        return $("#file_input").click();
    })
});