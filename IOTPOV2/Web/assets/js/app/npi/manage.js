define(['common', 'plugins', 'bootstrap', 'datepicker', 'echarts'], function ($, util, template) {
    var rootUrl = OP_CONFIG.rootUrl;

    $('.DateFormonth').datepicker({
        format: 'yyyy/m',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        startView: 1,
        maxViewMode: 2,
        minViewMode: 1,
        language: 'zh-CN'
    });
    
    $('#Chart1Query').on('click', function () {

        var myChart1 = echarts.init(document.getElementById('chart1'));
        var option1 = {
            legend: {
                show: true,
                data: ['A级', 'B级', 'C级', 'D级'],
                orient: 'vertical',
                x: 'right',
                y: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [
                {
                    type: 'category',
                    data: []
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'A级',
                    type: 'bar',
                    data: [1, 2, 6, 1]
                },
                {
                    name: 'B级',
                    type: 'bar',
                    data: [1, 3, 4, 1]
                },
                {
                    name: 'C级',
                    type: 'bar',
                    data: [2, 1, 3, 1]
                },
                {
                    name: 'D级',
                    type: 'bar',
                    data: [4, 3, 4, 1]
                }
            ]
        }

        var zzr = $('#chart1ZRR').data('data');
        var zrr = ($('#chart1ZRR').val() == '') ? '' : zzr.Badge;

        $.post(rootUrl + 'NPI/GetChart1', {
            beginTime: $('#beginTime').val(),
            endTime: $('#endTime').val(),
            level: $('#level').val(),
            zrr:zrr
        }, function (res) {
            if (res.state) {
                $.tips('生成成功！', 0);

                for (var i = 0; i < res.data.length; i++)
                {
                    
                    option1.xAxis[0].data.push(res.data[i].yearmonth);
                }
                alert(JSON.stringify(option1));
                myChart1.setOption(option1);
            } else {
                $.tips(res.msg, 0);
            }
        });
        
    });

    

    var myChart2 = echarts.init(document.getElementById('chart2'));
    var option2 = {
        legend: {
            show: true,
            data: ['当月问题总数', '当月问题关闭数', '单月关闭率', '累计关闭率','目标'],
            //orient: 'vertical',
            //x: 'right',
            y: 'bottom'
        },
        tooltip:{
            trigger: 'axis',
            formatter: '{b}<br>{a0} : {c0}<br>{a1} : {c1}<br>{a2} : {c2}%<br>{a3} : {c3}%<br>{a4} : {c4}%'
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitNumber: 6
            },
            {
                type: 'value',
                min: 0,
                max: 120,
                splitNumber: 6,
                axisLabel: {
                    formatter: function (value) {
                        return value + '%';
                    }
                }
            }
        ],
        series: [
            {
                name: '当月问题总数',
                type: 'bar',
                data: [45, 33, 38],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            },
            {
                name: '当月问题关闭数',
                type: 'bar',
                data: [40, 32, 35],
                itemStyle: {
                    normal: {
                        label: {
                            show: true
                        }
                    }
                }
            },
            {
                name: '单月关闭率',
                type: 'line',
                data: [98,97,92],
                smooth: true,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{c}%'
                        }
                    }
                }
            },
            {
                name: '累计关闭率',
                type: 'line',
                data: [98,92,92],
                smooth: true,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{c}%'
                        }
                    }
                }
            },
            {
                name: '目标',
                type: 'line',
                data: [85,85,85],
                smooth: true,
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{c}%'
                        }
                    }
                }
            }
        ]
    }
    myChart2.setOption(option2);

    var myChart3 = echarts.init(document.getElementById('chart3'));
    var option3 = {
        legend: {
            orient: 'vertical',
            x: 'left',
            data: ['设计', '工艺', '物料', '制程', '测试']
        },
        series: [
            {
                name: 'NPI缺陷问题类别统计',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 12, name: '设计' },
                    { value: 13, name: '工艺' },
                    { value: 44, name: '物料' },
                    { value: 47, name: '制程' },
                    { value: 116, name: '测试' }
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'outer',
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: { show: true }
                    }
                }
            }
        ]
    }
    myChart3.setOption(option3);
})