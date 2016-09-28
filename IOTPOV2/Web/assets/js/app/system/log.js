define(['common', 'plugins', 'datepicker'], function ($) {
    var rootUrl = OP_CONFIG.rootUrl;

    //设置语言
    $.fn.datepicker.dates['zh-CN'] = {
        days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        daysShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
        daysMin: ["日", "一", "二", "三", "四", "五", "六"],
        months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        monthsShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        today: "今日",
        clear: "清除",
        format: "yyyy年mm月dd日",
        titleFormat: "yyyy年mm月",
        weekStart: 1
    };

    var resultTable = $('#search-result').table({
        url: rootUrl + 'System/GetLogList',
        data: function () {
            return {
                type: $('[name="Type"]').val(),
                logOperator: ($('[name="Operator"]').data('data')==undefined ?"":$('[name="Operator"]').data('data').Badge),
                startTime: $('[name="StartTime"]').val(),
                endTime: $('[name="EndTime"]').val()
            };
        },
        colOptions: [{
            name: '日志类型',
            field: 'TypeExp',
            width: 100
        }, {
            name: '操作人',
            field: 'OperatorExp',
            width: 80
        }, {
            name: '操作模块',
            field: 'OperateModule',
            width: 100
        }, {
            name: '操作时间',
            field: 'OperateTimeExp',
            width: 130
        },  {
            name: '日志内容',
            field: 'Msg'
        }],
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    $('.datepicker').datepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    });

    //搜索
    $('#searchLog').on('click', function () {

        resultTable.table('reload');
    });

    //重置
    $('#resetSearch').on('click', function () {
        $('[name="Type"]').val('');
        $('[name="Operator"]').val('').removeData('badge');
        $('[name="Operator"]').removeData('data');
        $('[name="StartTime"]').val('');
        $('[name="EndTime"]').val('');
        resultTable.table('reload');
    });

    //导出
    $('#exportLog').on('click', function () {
        $(this).attr('href', rootUrl + 'System/ExportLog?type=' + $('[name="Type"]').val() + '&logOperator=' + ($('[name="Operator"]').data('badge') || '') + '&startTime=' + $('[name="StartTime"]').val() + '&endTime=' + $('[name="EndTime"]').val());
    });

    

});