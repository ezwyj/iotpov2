define(['common', 'util', 'uploadify',  'ztree', 'plugins', 'bootstrap'], function ($, util) {
    var rootUrl = OP_CONFIG.rootUrl;

    $('#select-attachment').uploadify({
        swf: rootUrl + 'assets/js/lib/uploadify.swf',
        uploader: rootUrl + 'Common/UploadAttachment',
        fileSizeLimit: '100 MB',
        onSelect: function (file) {
            var queue = $('#' + this.settings.queueID);
            var html = '<div id="#{fileId}" class="uploadify-queue-item">' +
                            '<span class="icon #{fileIcon}"></span>' +
                            '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                            '<div class="uploadify-progress">' +
                                '<div class="uploadify-progress-bar">&nbsp;</div>' +
                            '</div>' +
                            '<span class="data">Waiting</span>' +
                        '</div>';

            var fileData = {
                fileId: file.id,
                fileName: file.name,
                fileIcon: util.getFileIcon(file.name)
            }


            queue.append(util.parseTpl(html, fileData));
        },
        onUploadSuccess: function (file, res) {
            res = JSON.parse(res);

            if (res.state) {
                var data = res.data[0];
                var html = '<div id="#{fileId}" class="finish-queue-item" data-fileid="#{id}">' +
                                '<span class="icon #{fileIcon}"></span>' +
                                '<span class="file-name" title="#{fileName}">#{fileName}</span>' +
                                '<span class="file-size">#{fileSize}</span>' +
                                '<a class="file-operate file-del" href="#">删除</a>' +
                            '</div>';
                var fileData = {
                    id: data.Id,
                    fileId: file.id,
                    fileIcon: util.getFileIcon(file.name),
                    fileName: file.name,
                    fileSize: util.getFileSize(file.size)
                }

                $('#' + file.id).replaceWith(util.parseTpl(html, fileData));

                //删除
                $('#' + file.id).on('click', '.file-del', function () {
                    $('#' + file.id).remove();
                    return false;
                });
            } else {
                $.tips(res.msg);
            }
        }
    });

    
    function submit() {

        var data = {
            Main: {
                ZY: $('[id="qxzy"]').val(),
                QXMS:$('[id="qxms"]').val(),
                CPX: $('[id="cpx"]').val(),
                WPBM:$('[id="wpbm"]').val(),
                WPXH:$('[id="wpxh"]').val(),
                XMDM:$('[id="xmdm"]').val(),
                YJBB:$('[id="yjbb"]').val(),
                RJBB:$('[id="rjbb"]').val(),
                YXJ: $('[id="yxj"]').val()
               
            }
        }

        if (data.Main.ZY == '') {
            $.tips('缺陷摘要不能都为空！');
            return false;
        }

        if (data.Main.QXMS == '') {
            $.tips('缺陷概述不能为空！');
            return false;
        }

        if (data.Main.WPXH == '') {
            $.tips('物品型号不能为空！');
            return false;
        }

        if (data.Main.CPX == '') {
            $.tips('产品线未填写！');
            return false;
        }
        if (data.Main.WPBM == '') {
            $.tips('物品编码不能为空！');
            return false;
        }
        if (data.Main.XMDM == '') {
            $.tips('项目代码不能为空！');
            return false;
        }
       

        //处理附件
        data.MainAttachment = [];

        $('#select-attachment-main-queue .finish-queue-item').each(function () {
            data.MainAttachment.push({
                FileName: $(this).data('filename'),
                FileAddress: $(this).data('filepath')
            });
        });


        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                $.tlayer('close');
                $.loading('提交中，请稍后...');
                $.post(rootUrl + 'NPI/Create', { dataJson: JSON.stringify(data) }, function (res) {
                    $.tlayer('close');
                    var panel = $('.panel-body');
                    if (res.state) {
                        //传附件
                        var attachments = [];

                        panel.find('.finish-queue-item').each(function () {
                            if ($(this).data('fileid')) {
                                attachments.push($(this).data('fileid'));
                            }
                        });

                        if (attachments.length > 0) {

                            $.post(rootUrl + 'NPI/SaveMainAttachment', {
                                instanceId: res.msg,
                                attachments: attachments.join()
                            }, function (res) {
                                if (res.state) {
                                    window.location.href = rootUrl + 'NPI/ApproveList';
                                } else {
                                    $.tips(res.msg, 100);
                                }
                            });
                        } else {
                            window.location.href = rootUrl + 'NPI/ApproveList';
                        }


                    } else {
                        $.tips(res.msg, 0);
                    }
                });
                

                
            }
        });
    }

    $('#submit-create').on('click', function () {
       
        submit();
        
    });

    //搜索项目
    function search() {
        
    }

    function setRevision(bm) {
        
        $("#yjbb").empty();
        $.ajax({
            type: "get",
            async: false,
            url: "http://webapi.maipu.com/Selector/Project/GetRevision?inventory_item_id=" + bm,
            dataType: "jsonp",
            jsonp: "callback",
            success: function (json) {
                $.each(json, function (n, value) {
                    var opt= '<option value="' + value.revision + '">'+value.revision+'</option>';
                    $('#yjbb').append(opt);
                });
            },
            error: function () {
                alert('fail');
            }
        });


    }

    $('#wpbm').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Product/SearchProduct',
            dataType: 'jsonp',
            dataField: null
        },
        width:400,
        template: '<td>#{cpBm}</td><td>#{cpName}</td><td>#{xsxhName}</td>',
        callback: function (data) {
            $('#cpx').val(data.cpxName).data('data', data);
            $('#wpbm').val(data.cpBm).data('data', data);
            $('#wpxh').val(data.cpName).data('data', data);
            setRevision($('#wpbm').val());
        }
    });

    $('#wpxh').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Product/SearchProduct',
            dataType: 'jsonp',
            dataField: null
        },
        width:400,
        template: '<td>#{cpName}</td><td>#{cpBm}</td><td>#{xsxhName}</td>',
        callback: function (data) {
            $('#wpbm').val(data.cpBm).data('data', data);
            $('#wpxh').val(data.cpName).data('data', data);
            $('#cpx').val(data.cpxName).data('data', data);
            setRevision($('#wpbm').val());
        }
    });

    $('#xmdm').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Project/GetProjectCodes',
            dataType: 'jsonp',
            dataField: null
        },
        maxNum: 10,
        width:400,
        template: '<td>#{segment1}</td><td>#{description}</td>',
        callback: function (data) {
            $('#xmdm').val(data.segment1).data('data', data);

        }
    });
});