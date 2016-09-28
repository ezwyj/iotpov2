require(['common', 'plugins'], function ($) {
    var rootUrl = OP_CONFIG.rootUrl;
    $('#pendList').table({
        url: rootUrl + 'NPI/GetPendList',
        paging: {
            enable: true,
            localPage: true,
            pageSize: 10
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

                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId +'" target="_blank" title="'+data.ZY+'">' + value + '</a>';
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
            name: '缺陷状态',
            field: 'StateExp',
            width: 80
        }, {
            name: '提交日期',
            field: 'CreateTimeExp',
            width: 120
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
            name: '当前阶段',
            width: 120,
            field: 'StageExp'
        }, {
            name: '提交人',
            field: 'TJRExp',
            width: 60
        }, {
            name: '操作',
            width: 60,
            handler: function (value, data) {
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId + '" target="_blank">审批</a>';
            }
        }],
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    var submitTable = $('#submitList').table({
        url: rootUrl + 'NPI/GetSubmitList',
        data: function () {
            return {

                keyword: $('#submitKeyword').val(),

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
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId + '" target="_blank" title="'+data.ZY+'">' + value + '</a>';
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
            name: '缺陷状态',
            field: 'StateExp',
            width: 80
        }, {
            name: '提交日期',
            field: 'CreateTimeExp',
            width: 120
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
            name: '当前阶段',
            width: 120,
            field: 'StageExp'
        }, {
            name: '当前审批人',
            field: 'Approvers',
            handler: function (value) {
                return '<div class="text-ellipsis" title="' + value + '">' + value + '</div>';
            },
            width: 80
        }, {
            name: '操作',
            width: 60,
            handler: function (value, data) {
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId + '" target="_blank">操作</a>';
            }
        }],
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    var handleTable= $('#handleList').table({
        url: rootUrl + 'NPI/GetHandleList',
        tableClass: 'table-condensed',
        data: function () {
            return {

                keyword: $('#handleKeyword').val(),

            };
        },
        colOptions: [{
            name: '序号',
            field: 'Id',
            width: 50,
            align: 'center'
        }, {
            name: '缺陷摘要',
            field: 'ZYMini',
            
            handler: function (value, data) {
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' +data.InstanceId + '" target="_blank" title="'+data.ZY+'">' + value + '</a>';
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
            name: '缺陷状态',
            field: 'StateExp',
            width: 80
        }, {
            name: '提交日期',
            field: 'CreateTimeExp',
            width: 120
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
            name: '当前阶段',
            width: 120,
            field: 'StageExp'
        }, {
            name: '当前审批人',
            field: 'Approvers',
            handler: function (value) {
                return '<div class="text-ellipsis" title="' + value + '">' + value + '</div>';
            },
            width: 80
        }, {
            name: '操作',
            width: 60,
            handler: function (value, data) {
                return '<a href="' + rootUrl + 'NPI/Detail?instanceId=' + data.InstanceId +  '" target="_blank">' + '查看</a>';
            }
        }],
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    $('#searchSubmit').on('click', function (e) {
        submitTable.table('reload');
    });

    $('#searchHandle').on('click', function (e) {
        handleTable.table('reload');
    });

});