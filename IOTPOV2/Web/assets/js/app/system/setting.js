define(['common', 'util', 'template', 'plugins'], function ($, util, template) {
    var rootUrl = OP_CONFIG.rootUrl;
    var projectStageId = OP_CONFIG.projectStageId;

    //增加集
    $('#add-set').on('click', function (e) {
        $.content({
            theme: 'blue',
            header: '增加集',
            content: {
                width: 400,
                html: '<div class="item item-row">' +
                            '<div class="item-name required">集名称：</div>' +
                            '<div class="item-value"><input type="text" name="Text" class="form-control" /></div>' +
                        '</div>'
            },
            footer: [{
                style: 'primary',
                text: '确定',
                callback: function () {
                    if (checkRequired(this)) {
                        return false;
                    }

                    var data = {
                        Text: $('input', this).val()
                    }

                    $.post(rootUrl + 'System/SaveValueSet', { valueSetJson: JSON.stringify(data) }, function (res) {
                        if (res.state) {
                            var set = res.data;
                            $('#add-set').before(
                                '<li class="list-group-item" data-id="' + set.Id + '">' +
                                    '<span class="list-group-item-opt">' +
                                        '<i class="glyphicon glyphicon-cog" title="设置"></i>' +
                                        '<i class="glyphicon glyphicon-remove" title="删除"></i>' +
                                    '</span>' +
                                    '<span class="list-group-item-text">' + set.Text + '</span>' +
                                '</li>'
                            );
                            $.tips(res.msg, 3);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }]
        });

        e.preventDefault();
    });

    //设置集
    $(document).on('click', '.list-group-item-opt .glyphicon-cog', function (e) {
        var listItem = $(this).parents('.list-group-item');
        var id = listItem.data('id');

        $.get(rootUrl + 'System/GetValueSetById?id=' + id, function (res) {
            if (res.state) {
                var set = res.data;

                $.content({
                    theme: 'blue',
                    header: '设置集',
                    content: {
                        width: 400,
                        html: '<div class="item item-row">' +
                                    '<div class="item-name required">集名称：</div>' +
                                    '<div class="item-value">' +
                                        '<input type="text" class="form-control" name="fieldName" value="' + set.Text + '" />' +
                                    '</div>' +
                                '</div>'
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            if (checkRequired(this)) {
                                return false;
                            }

                            set = $.extend(set, {
                                Id: id,
                                Text: $('input', this).val()
                            });

                            $.post(rootUrl + 'System/SaveValueSet', { valueSetJson: JSON.stringify(set) }, function (res) {
                                if (res.state) {
                                    listItem.find('.list-group-item-text').text(res.data.Text);
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }]
                });
            } else {
                $.tips(res.msg, 0);
            }
        });

        e.stopPropagation();
    });

    //删除集
    $(document).on('click', '.list-group-item-opt .glyphicon-remove', function (e) {
        var listItem = $(this).parents('.list-group-item');
        var id = listItem.data('id');

        $.confirm('确定要删除该集吗？', function (result) {
            if (result) {
                $.get(rootUrl + 'System/DeleteValueSet?id=' + id, function (res) {
                    if (res.state) {
                        $.tips('删除成功！', 3);
                        if (listItem.hasClass('active')) {
                            $('.list-group-item:eq(0)').click();
                        }
                        listItem.remove();
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });

        e.stopPropagation();
    });

    //获取值列表
    $(document).on('click', '#setList .list-group-item:not(#add-set)', function (e) {
        $('#setList .list-group-item').removeClass('active');
        $(this).addClass('active');

        var id = $(this).data('id');

        $.get(rootUrl + 'System/GetValueList?id=' + id, function (res) {
            if (res.state) {
                var dataList = res.data || [];
                var html = '';

                dataList.forEach(function (data) {
                    html += '<tr data-id="' + data.Id + '">' +
                                '<td>' + data.Value + '</td>' +
                                '<td>' + data.Text + '</td>' +
                                '<td>' + data.SortId + '</td>' +
                                '<td>' + (data.IsEnable ? '是' : '否') + '</td>' +
                                '<td>' + (data.IsDefault ? '是' : '否') + '</td>' +
                                '<td>' +
                                    '<button class="btn btn-mini btn-info value-setting">设置</button> ' +
                                    '<button class="btn btn-mini btn-danger value-del">删除</button>' +
                                '</td>' +
                            '</tr>';
                });

                $('#valueList tbody').html(html);
            } else {
                $.tips(res.msg, 0);
            }
        });

        e.preventDefault();
    });

    //默认展开第一个值集
    $('#setList .list-group-item:not(#add-set)').eq(0).trigger('click');

    //增加值
    $('#add-value').on('click', function () {
        var setId = $('#setList .list-group-item.active').data('id');
        var html = template('Add-Value', {});


        $.content({
            theme: 'blue',
            header: '增加值',
            content: {
                width: 400,
                html: html
            },
            footer: [{
                style: 'primary',
                text: '确定',
                callback: function () {
                    if (checkRequired(this)) {
                        return false;
                    }

                    var data = {
                        SetId: setId,
                        Value: $('[name="Value"]', this).val(),
                        Text: $('[name="Text"]', this).val(),
                        SortId: $('[name="SortId"]', this).val() || 0,
                        IsEnable: $('[name="IsEnable"]:checked', this).val() == '1',
                        IsDefault: $('[name="IsDefault"]:checked', this).val() == '1',
                        Extra: $('[name="Extra"]').val()
                    }

                    if (isNaN(data.SortId)) {
                        alert('排序只能为数字！');
                        return;
                    }

                    $.post(rootUrl + 'System/SaveValueSet', { valueSetJson: JSON.stringify(data) }, function (res) {
                        if (res.state) {
                            var data = res.data;
                            var tr = '<tr data-id="' + data.Id + '">' +
                                        '<td>' + data.Value + '</td>' +
                                        '<td>' + data.Text + '</td>' +
                                        '<td>' + data.SortId + '</td>' +
                                        '<td>' + (data.IsEnable ? '是' : '否') + '</td>' +
                                        '<td>' + (data.IsDefault ? '是' : '否') + '</td>' +
                                        '<td>' +
                                            '<button class="btn btn-mini btn-info value-setting">设置</button> ' +
                                            '<button class="btn btn-mini btn-danger value-del">删除</button>' +
                                        '</td>' +
                                    '</tr>';

                            $('#valueList tbody').append(tr);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                if (setId == projectStageId) {
                    var input = $('[name="Extra"]', this);
                    require(['uploadify'], function () {
                        $('#mainPoints').uploadify({
                            swf: rootUrl + 'assets/js/lib/uploadify.swf',
                            uploader: rootUrl + 'System/ConvertWordToHtml',
                            defaultTemplate: false,
                            multi: false,
                            fileTypeExts: '*.doc; *.docx',
                            onUploadSuccess: function (file, res) {
                                res = JSON.parse(res);

                                if (res.state) {
                                    var file = res.data.substring(res.data.lastIndexOf('\\') + 1) + ' <a href="#">删除</a>';
                                    input.prev().html(file);
                                    input.val(res.data);
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            }
                        });
                    });
                }
            }
        });
    });

    //设置值
    $(document).on('click', '#valueList .value-setting', function () {
        var tr = $(this).parents('tr');
        var id = tr.data('id');

        $.get(rootUrl + 'System/GetValueSetById?id=' + id, function (res) {
            if (res.state) {
                var data = res.data;
                var html = template('Add-Value', data);

                //项目阶段需要额外字段保存预审要点文档
                if (data.SetId == projectStageId) {
                    var file = '';

                    if (data.Extra) {
                        file = data.Extra.substring(data.Extra.lastIndexOf('\\') + 1) + ' <a href="#">删除</a>';
                    }

                    html += '<div class="item item-row">' +
                                '<div class="item-name">预审要点：</div>' +
                                '<div class="item-value">' +
                                    '<button class="btn btn-sm btn-primary" id="mainPoints">选择文件</button>' +
                                    '<p id="mainPoints-file">' + file + '</p>' +
                                    '<input type="hidden" name="Extra" value="' + data.Extra + '">' +
                                '</div>' +
                            '</div>';
                }

                $.content({
                    theme: 'blue',
                    header: '设置值',
                    content: {
                        width: 400,
                        html: html
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            if (checkRequired(this)) {
                                return false;
                            }

                            data = {
                                Id: id,
                                SetId: data.SetId,
                                Value: $('[name="Value"]', this).val(),
                                Text: $('[name="Text"]', this).val(),
                                SortId: $('[name="SortId"]', this).val() || 0,
                                IsEnable: $('[name="IsEnable"]:checked', this).val() == '1',
                                IsDefault: $('[name="IsDefault"]:checked', this).val() == '1',
                                Extra: $('[name="Extra"]', this).val()
                            }

                            if (isNaN(data.SortId)) {
                                alert('排序只能为数字！');
                                return false;
                            }

                            $.post(rootUrl + 'System/SaveValueSet', { valueSetJson: JSON.stringify(data) }, function (res) {
                                if (res.state) {
                                    var data = res.data;
                                    var html = '<td>' + data.Value + '</td>' +
                                                '<td>' + data.Text + '</td>' +
                                                '<td>' + data.SortId + '</td>' +
                                                '<td>' + (data.IsEnable ? '是' : '否') + '</td>' +
                                                '<td>' + (data.IsDefault ? '是' : '否') + '</td>' +
                                                '<td>' +
                                                    '<button class="btn btn-mini btn-info value-setting">设置</button> ' +
                                                    '<button class="btn btn-mini btn-danger value-del">删除</button>' +
                                                '</td>';

                                    tr.html(html);
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }],
                    onInit: function () {
                        if (data.SetId == projectStageId) {
                            var input = $('[name="Extra"]', this);
                            require(['uploadify'], function () {
                                $('#mainPoints').uploadify({
                                    swf: rootUrl + 'assets/js/lib/uploadify.swf',
                                    uploader: rootUrl + 'System/ConvertWordToHtml',
                                    defaultTemplate: false,
                                    multi: false,
                                    fileTypeExts: '*.doc; *.docx',
                                    onUploadSuccess: function (file, res) {
                                        res = JSON.parse(res);

                                        if (res.state) {
                                            var file = res.data.substring(res.data.lastIndexOf('\\') + 1) + ' <a href="#">删除</a>';
                                            input.prev().html(file);
                                            input.val(res.data);
                                        } else {
                                            $.tips(res.msg, 0);
                                        }
                                    }
                                });
                            });
                        }
                    }
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    });

    //删除预审要点文档
    $(document).on('click', '#mainPoints-file a', function (e) {
        $('#mainPoints-file').next().val('');
        $('#mainPoints-file').empty();

        e.preventDefault();
    });

    //删除值
    $(document).on('click', '#valueList .value-del', function () {
        var tr = $(this).parents('tr');
        var id = tr.data('id');

        $.confirm('确定要删除该值吗？', function (result) {
            if (result) {
                $.get(rootUrl + 'System/DeleteValueSet?id=' + id, function (res) {
                    if (res.state) {
                        $.tips('删除成功！', 3);
                        tr.remove();
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });
    });

    //增加用户权限
    $('#addUserRight').on('click', function () {
        var html = template('layer-rights', {
            rightList: ''
        });

        $.content({
            theme: 'blue',
            header: '增加用户权限',
            content: {
                html: html
            },
            footer: [{
                style: 'primary',
                text: '确定',
                callback: function () {
                    var userList = $('#user-list').data('data') || [];
                    var rightList = [];
                    
                    $('#right-list input:checked', this).each(function () {
                        rightList.push($(this).val());
                    });

                    if (!userList.length) {
                        $.tips('请选择员工！', 0);
                        return false;
                    }

                    if (!rightList.length) {
                        $.tips('请选择权限！', 0);
                        return false;
                    }
                    
                    for (var i = 0, l = userList.length; i < l; i++) {
                        var data = {
                            Id:0,
                            RightUser: userList[i].Badge,
                            RightName: rightList.join(',')
                        }

                        $.ajax({
                            type: 'post',
                            url: rootUrl + 'System/SaveRight',
                            data: {
                                dataJson: JSON.stringify(data)
                            },
                            async: false,
                            success: function (res) {
                                if (!res.state) {
                                    $.tips(res.msg, 0);
                                }
                            }
                        });
                    }

                    rightTable.table('reload');
                }
            }, {
                text: '取消'
            }]
        });
    });

    //设置用户权限
    $(document).on('click', '.right-setting', function () {
        var tr = $(this).parents('.table-tr');
        var id = tr.data('id');

        $.get(rootUrl + 'System/GetRightById?id=' + id, function (res) {
            if (res.state) {
                var data = res.data;
                var rightList = data.RightName.split(',');

                var html = template('layer-rights', {
                    user: data.RightUserExp,
                    rightList: rightList
                });

                $.content({
                    theme: 'blue',
                    header: '修改用户权限',
                    content: {
                        html: html
                    },
                    footer: [{
                        style: 'primary',
                        text: '确定',
                        callback: function () {
                            var rights = [];

                            $('#right-list input:checked', this).each(function () {
                                rights.push($(this).val());
                            });

                            if (!rights.length) {
                                $.tips('请选择权限！', 0);
                                return false;
                            }

                            var data = {
                                Id: id,
                                RightName: rights.join()
                            }

                            $.post(rootUrl + 'System/SaveRight', { dataJson: JSON.stringify(data) }, function (res) {
                                if (res.state) {
                                    var data = res.data;

                                    $.tips('修改成功！', 3);
                                    tr.find('.table-td:eq(2) .table-td-text').text(data.OperatorExp);
                                    tr.find('.table-td:eq(3) .table-td-text').text(data.OperateTimeExp);
                                    tr.find('.table-td:eq(4) .table-td-text').text(data.RightName);
                                } else {
                                    $.tips(res.msg, 0);
                                }
                            });
                        }
                    }, {
                        text: '取消'
                    }]
                });
            } else {
                $.tips(res.msg, 0);
            }
        });
    });

    //删除用户权限
    $('#deleteUserRight').on('click', function () {
        var idArr = [];

        $('#userRightList .table-body input:checked').each(function () {
            var id = $(this).parents('.table-tr').data('id');
            idArr.push(id);
        });

        if (idArr.length == 0) {
            $.tips('请选择要删除的用户权限！', 0);
            return false;
        }

        $.confirm('确定要删除所选中的用户权限吗？', function (result) {
            if (result) {
                $.post(rootUrl + 'System/DeleteRight', { ids: idArr.join() }, function (res) {
                    if (res.state) {
                        $.tips('删除成功！', 3);
                        rightTable.table('reload');
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
            }
        });
    });

    //加载权限列表
    var rightTable = $('#userRightList').table({
        url: rootUrl + 'System/GetRightList',
        data: function () {
            return {
                rightUser: $('#searchRight').val()
            };
        },
        resizable: false,
        checkbox: true,
        rowParam: function (data) {
            return {
                id: data.Id
            }
        },
        colOptions: [{
            name: '员工',
            field: 'RightUser',
            width: 150,
            handler: function (value, data) {
                return data.RightUserExp + '[' + value + ']';
            }
        }, {
            name: '操作人',
            field: 'OperatorExp',
            width: 100
        }, {
            name: '操作时间',
            field: 'OperateTimeExp',
            width: 130
        }, {
            name: '权限',
            field: 'RightName'
        }, {
            name: '操作',
            width: 150,
            handler: function () {
                return '<button class="btn btn-mini btn-info right-setting">设置</button>';
            }
        }],
        resultVerify: function (res) {
            return {
                state: res.state,
                msg: res.msg
            }
        }
    });

    //搜索权限
    $('#searchRight').on('keydown', function (e) {
        if (e.which == 13) {
            rightTable.table('reload');
        }
    });
    $('#searchRight-btn').on('click', function () {
        rightTable.table('reload');
    });

    //检查必填项
    function checkRequired(thisObj) {
        var err = false;
        var names = [];

        $('.required', thisObj).each(function () {
            var item = $(this).parent().next('.item-value, item-staitc');
            var val = item.find('input[type="text"]').val();

            if (val === '') {
                var name = $(this).parent().text().substring(1);
                if (name[name.length - 1] == '：') {
                    name = name.substring(0, name.length - 1);
                }
                names.push(name);
            }
        });

        if (names.length > 0) {
            alert(names + ' 不能为空！');
            err = true;
        }

        return err;
    }
});