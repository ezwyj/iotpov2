require(['common', 'util', 'plugins', 'bootstrap', 'datepicker'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    //////////////////////
    //页面初始化
    //////////////////////

    $('.datepicker').datepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    });

    var resultTable = $('#result-list').table({
        url: rootUrl + 'Npi/SearchList',
        maxHeight: $('#main').height() - 270,
        data: function () {
            var zzr = $('#ZRR').data('data');
            var zrr = ($('#ZRR').val() == '') ?'' : zzr.Badge;    
            return {
                pageIndex: 0,
                pageSize : 20,
                number: $.trim($('#number').val()),
                beginTime: $('#beginTime').val(),
                endTime: $('#endTime').val(),
                keyword: $.trim($('#qxms').val()),
                QXstate: $('#QxState').find("option:selected").val(),
                level: $('#QXDJ').find("option:selected").val(),
                TJBM : $.trim($('#TJBM').val()),
                CPX: $.trim($('#CPX').val()),
                CPXH: $.trim($('#CPXH').val()),
                WPBM: $.trim($('#WPBM').val()),
                ZRBM: $.trim($('#ZRBM').val()),
                ZRR: zrr
            };
            },
        tableClass: 'table-condensed',
        colOptions: [{
            name: '序号',
            field: 'Id',
            width: 50,
            align: 'center'
        }, {
            name: '缺陷摘要',
            field: 'ZYMini',
            handler: function (value, data) {
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId + '" title=' + data.ZY + '" target="_blank">' + data.ZYMini + '</a>';

            }
        }, {
            name: '缺陷等级',
            field: 'QXDJExp',
            width: 80
        }, {
            name: '缺陷分类',
            field: 'QXFL',
            width: 80
        }, {
            name: '责任部门',
            field: 'ZRBMExp',
            width: 80
        },{
            name: '责任人',
            field: 'ZRRExp',
            width: 80
        },{
            name: '缺陷状态',
            field: 'StateExp',
            width: 80
        }, {
            name: '提交日期',
            field: 'CreateTimeExp',
            width: 130
        }, {
            name: '产品线',
            field: 'CPX',
            width: 70
        }, {
            name: '项目代码',
            field: 'XMDM',
            width: 80
        }, {
            name: '物品编码',
            field: 'WPBM',
            width: 100
        }, {
            name: '物品型号',
            field: 'WPXH',
            width: 150
        }, {
            name: '提交人',
            field: 'TJRExp',
            width: 60
        }]
    });

    //////////////////////
    //事件绑定
    //////////////////////


    $('#query').on('click', function () {
        resultTable.table('reload');
    });

    
    $('#export').on('click', function () {
        
            var zzr = $('#ZRR').data('data');
            var zrr = ($('#ZRR').val() == '') ?'' : zzr.Badge;    
            $(this).attr('href', rootUrl + 'Npi/Export?number=' + $.trim($('#number').val()) + '&beginTime=' + $('#beginTime').val() + '&endTime=' + $('#endTime').val() + '&keyword=' + $.trim($('#qxms').val()) + '&QXstate=' + $('#QxState').find("option:selected").val() + '&level=' + $('#QXDJ').find("option:selected").val() + '&TJBM=' + $.trim($('#TJBM').val()) + '&CPX=' + $.trim($('#CPX').val()) + '&CPXH=' + $.trim($('#CPXH').val()) + '&wpbm=' + $.trim($('#WPBM').val()) + '&ZRBM=' + $.trim($('#ZRBM').val()) + '&ZRR=' + zrr);
            

    });
    
    $('#clean').on('click', function () {
        $('input').val('');
        $('#QxState').val('');
        $('#QXDJ').val('');
    })
   
});