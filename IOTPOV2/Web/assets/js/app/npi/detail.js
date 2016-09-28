require(['common', 'util', 'template', 'plugins', 'uploadify', 'datepicker', 'bootstrap'], function ($, util, template) {
    var rootUrl = OP_CONFIG.rootUrl;
    var instanceId = $('[name="InstanceId"]').val();
    var npi_mainId = $('[name="NpiMainId"]').val();
    var operater = $('[name="operater"]').val();
    var operaterName = $('[name="operaterName"]').val();
    var cycCommon = '<p style="margin-top:15px;">常用词：</p>' +
                      '<select class="form-control" name="cyc">' +
                            '<option value="1">同意</option>' +
                            '<option value="2">原则同意</option>' +
                            '<option value="3">通过</option>' +
                             '<option value="4">不同意</option>' +
                             '<option value="5">不通过</option>' +
                     '</select>'
    //////////////////////
    //页面初始化
    //////////////////////
    //上传附件
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
                                '<a class="file-operate file-del" href="#" id="DelFile_#{id}">删除</a>' +
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

    //删除已上传附件
    $('.file-delete').on('click', function () {
        var atta = $(this).data('data');
        $.confirm('是否删除附件？', function (result) {
            if (result) {
                
                $.post(rootUrl + 'Common/DeleteAttachment', {
                    instanceId: atta.instanceId,
                    type: atta.type,
                    id: atta.id
                }, function (res) {
                    if (res.state) {
                        $.tips('删除成功！', 0);
                    } else {
                        $.tips(res.msg, 0);
                    }
                });
                //删除附件
                $(this).parent().remove();
            }
        });
    });

    function GetModel() {
        var qxlbs = $('.qxlb_step1_value');
        var qxfxEntity = [];  //缺陷分析

        $('.qxlb_step1_value').each(function () {
            var data = $(this).data('data');
            qxfxEntity.push(data)

        });
        NPIModel.Main.TRDPXJS = $('[id="TRDPXJS"]').val();
        NPIModel.Main.CPJD = $('[id="cpjd"]').val();
        NPIModel.Main.QXDJ = $('[name="DefectLevel"]:checked').val();
        

        NPIModel.Main.PQEPGNR = $('#pqepgnr').val();
        NPIModel.Main.PQEPass = $('input[name="rd"]:checked').val();

        
        $('.qxfx_step2').each(function () {
            var defectType = {
                Id: $(this).attr('data'),
                YYFX: $(this).val(),
                Npi_main: npi_mainId
            }
            qxfxEntity.push(defectType)

        });


        var yfcsEntity = []; //预防措施
        $('.yfcs_step2_value').each(function () {
            yfdata = $(this).data('data');
            var precautionary = {
                Id: yfdata.Id,
                Npi_main: npi_mainId,
                ZRR: yfdata.zrr,
                YFCS: yfdata.yfcs,
                NDRQ: yfdata.yfndsj,
                InputUser: operater,
                YJBB: yfdata.yfcsyjbb,
                JHGBSJ: yfdata.yfjhgbsj
            }
            yfcsEntity.push(precautionary)

        });

        var jzcsEntity = []; //纠正措施
        $('.jz_step2_value').each(function () {
            jzdata = $(this).data('data');

            var corrective = {
                Id: jzdata.Id,
                Npi_main: npi_mainId,
                NDJ: operater,
                JZCS: jzdata.jzcs,
                NDRQ: jzdata.jzndsj,
                ZRR: jzdata.zrr,
                JHGBSJ: jzdata.jhgbsj,
                YJBB: jzdata.jzcsyjbb,
                InputUser: operater
            }
            jzcsEntity.push(corrective)

        });

        NPIModel.DefectTypes = qxfxEntity;
        NPIModel.Correctives = jzcsEntity;
        NPIModel.PrecautionaryActions = yfcsEntity;

        var implementEntity = [];
        $('.cssc_step3_value').each(function () {
            var rowData = $(this).data('data');
            var NpiImplement = {
                Id: rowData.Id,
                CompleteTime: rowData.sswcsj,
                Npi_main: npi_mainId,
                Record: rowData.ssjl,
                isFix: rowData.gxqxzt_id == 0 ? "true" : "false",
                noFixRemark: rowData.fgdsm,
                ImplementZRR: rowData.zrr

            }
            implementEntity.push(NpiImplement)

        });
        NPIModel.Implements = implementEntity

        NPIModel.Main.ConfirmInfo = $('#qrxx').val();

        NPIModel.Main.PGNR = $('#pgnr').val();
        NPIModel.Main.IsAccept = $('input[name="accept"]:checked').val();

        
        NPIModel.Main.YYSM = $('#YYSM').val();

        
        NPIModel.Main.NZ = $('#nznr').val();
        NPIModel.Main.BZ = $('#NZremark').val();
        NPIModel.Main.NZR = operater;

        return NPIModel;

    }


    $('.datepicker').datepicker({
        format: 'yyyy/m/d',
        autoclose: true,
        clearBtn: true,
        todayHighlight: true,
        language: 'zh-CN'
    });

    //////////////////////
    //事件绑定
    //////////////////////
    //缺陷等级说明
    $('#Defect_description').on('click', function () {
        var html = template('layer-defect', {});

        $.content({
                theme: 'blue',
                header: '缺陷等级说明',
                content: {
                    html: html
                },
                footer: [{
                    text: '确定',
                    callback: function () {
                        $.tlayer('close');
                    }
                }]
         });
    });

    //添加责任人
    $('#addZrr').on('click', function () {
        var html = template('layer-zrr', {});

        $.content({
            theme: 'blue',
            header: '添加责任人',
            content: {
                html: html
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var user = $('[name="zrr_step1"]').data('data');

                    if (user == null || user == undefined) {
                        $.tips('未选择责任人', 0);
                        return false;
                    }

                    var data = {
                        id: 0,
                        Npi_main: 0,
                        QXLB: $('[name="qxlb_step1"]').val(),
                        qxlbName: $('[name="qxlb_step1"] option:selected').text(),
                        QXZRR: user.Badge,
                        zrrName: user.Name,
                        AssignInputUser: operater
                    }
                    var tr = $(
                                '<tr class="qxlb_step1_value">' +
                                    '<td >' + data.qxlbName + '</td>' +
                                    '<td>' + data.zrrName + '</td>' +
                                    '<td>' +
                                        '<a class="btn-link btn-del">删除</a>' +
                                    '</td>' +
                                '</tr>'
                                ).data('data', data);
                    $('#zrrResult tbody').append(tr);
                }
            }, {
                text: '取消',
                callback: function () {
                    $.tlayer('close');

                }
            }]
        });
    });

    //责任人删除行
    $('#zrrResult').on('click', '.btn-del', function () {
        var tr = $(this).parents('tr');
        $.confirm('确认删除责任人？', function (result) {
            if (result) {

                var data = tr.data('data');
                if (data.id != 0) {
                    $.post(rootUrl + 'NPI/DeleteDistribute', {
                        instanceId: instanceId,
                        mainId: data.id
                    }, function (res) {
                        if (res.state) {
                            $.tips('删除成功！', 0);
                        } else {
                            $.tips(res.msg, 0);
                        }

                    });
                }
                tr.remove();
            }
        });
    });

    //纠正措施
    $('#AddCorrective').on('click', function () {
        var html = template('layer-Corrective', {});

        $.content({
            theme: 'blue',
            header: '添加纠正措施',
            content: {
                html: html
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var user = $('[name="zrr_step2"]',this).data('data');
                    
                    if (user == null || user == undefined) {
                        $.tips('未选择责任人', 0);
                        return false;
                    }
                    if ($('[name="jzjhgbsj_step2"]').val() == '') {
                        $.tips('未填写计划关闭时间', 0);
                        return false;
                    }
                    if ($('[name="jzcsyjbb_step2"]').val() == '') {
                        $.tips('未填写硬件版本', 0);
                        return false;
                    }
                    if ($('[name="jzcs_step2"]').val() == '') {
                        $.tips('未填写纠正措施', 0);
                        return false;
                    }
                    if ($('[name="jzndsj_step2"]').val() == '') {
                        $.tips('未填写纠正拟定时间', 0);
                        return false;
                    }

                    var dateAStr = $("#trdpxjs").val();
                    var arrA = dateAStr.split("/");
                    var dateA = new Date(arrA[0], arrA[1], arrA[2]);
                    var dateAT = dateA.getTime();
                    var dateBStr = $('[name="jzjhgbsj_step2"]').val();
                    var arrB = dateBStr.split("/");
                    var dateB = new Date(arrB[0], arrB[1], arrB[2]);
                    var dateBT = dateB.getTime();
                    if (dateAT < dateBT) {
                        $.tips('计划关闭时间不得晚于TR评审时间', 0);
                        return false;
                    }

                    var data = {
                        jzcs: $('[name="jzcs_step2"]',this).val(),
                        jzndsj: $('[name="jzndsj_step2"]',this).val(),
                        jzcsyjbb: $('[name="jzcsyjbb_step2"]',this).val(),
                        jhgbsj: $('[name="jzjhgbsj_step2"]',this).val(),
                        zdr: $('[name="zdr_step2"]',this).val(),
                        zrr: user.Badge,
                        zrrName: user.Name,
                        Id: 0
                    }
                    var tr = $(
                                '<tr class="jz_step2_value">' +
                                    '<td>' + operaterName + '</td>' +
                                    '<td >' + data.jzcs + '</td>' +
                                    '<td>' + data.zrrName + '</td>' +
                                    '<td>' + data.jzndsj + '</td>' +
                                    '<td>' + data.jzcsyjbb + '</td>' +
                                    '<td>' + data.jhgbsj + '</td>' +
                                    
                                    '<td>' +
                                        '<a class="btn-link btn-del">删除</a>' +
                                    '</td>' +
                                '</tr>'
                                 ).data('data', data);
                    $('#jzResult tbody').append(tr);
                }
            }, {
                text: '取消',
                callback: function () {
                    $.tlayer('close');

                }
            }],
            onInit: function () {
                $('.datepicker', this).datepicker({
                    format: 'yyyy/m/d',
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true,
                    language: 'zh-CN'
                });
            }
        });
    });

    //纠正措施删除行
    $('#jzResult').on('click', '.btn-del', function () {
        var tr = $(this).parents('tr');
        $.confirm('确认删除纠正措施吗？', function (result) {
            if (result) {
                var data = tr.data('data');
                if (data.Id != 0) {
                    $.post(rootUrl + 'NPI/DeleteCorrective', {
                        instanceId: instanceId,
                        Id: data.Id
                    }, function (res) {
                        if (res.state) {
                            $.tips('删除成功！', 0);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
                tr.remove();
            }
        });
    });

    //预防措施
    $('#AddPrecautionary').on('click', function () {
        var html = template('layer-Precautionary', {});

        $.content({
            theme: 'blue',
            header: '添加预防措施',
            content: {
                html: html
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {

                    var yfcs = $('[name="yfcs_step2"]', this).val();
                    if (yfcs == '') {
                        $.tips('请填写预防措施！', 0);
                        return false;
                    }

                    var user = $('[name="yf_zrr_step2"]').data('data');
                    if (user == undefined || user == null) {
                        $.tips('责任人为空！', 0);
                        return false;
                    }

                    if ($('[name="yfndsj_step2"]').val() == '') {
                        $.tips('请填写拟定时间！', 0);
                        return false;
                    }
                    if ($('[name="yfjhgbsj_step2"]').val() == '') {
                        $.tips('请填写关闭时间！', 0);
                        return false;
                    }

                    var dateAStr = $("#trdpxjs").val();
                    var arrA = dateAStr.split("/");
                    var dateA = new Date(arrA[0], arrA[1], arrA[2]);
                    var dateAT = dateA.getTime();
                    var dateBStr = $('[name="yfjhgbsj_step2"]').val();
                    var arrB = dateBStr.split("/");
                    var dateB = new Date(arrB[0], arrB[1], arrB[2]);
                    var dateBT = dateB.getTime();
                    if (dateAT < dateBT) {
                        $.tips('计划关闭时间不得晚于TR评审时间', 0);
                        return false;
                    }

                    var data = {
                        Id: 0,
                        yfcs: $('[name="yfcs_step2"]',this).val(),
                        yfndsj: $('[name="yfndsj_step2"]',this).val(),
                        yfcsyjbb: $('[name="yfcsyjbb_step2"]',this).val(),
                        yfjhgbsj: $('[name="yfjhgbsj_step2"]',this).val(),
                        yfzdr: $('[name="yfzdr_step2"]',this).val(),
                        zrr: user.Badge,
                        zrrName: user.Name
                    }
                    var tr = $(
                                '<tr class="yfcs_step2_value">' +
                                    '<td>' + operaterName + '</td>' +
                                    '<td>' + data.yfcs + '</td>' +
                                    '<td>' + data.zrrName + '</td>' +
                                    '<td>' + data.yfndsj + '</td>' +
                                    '<td>' + data.yfcsyjbb + '</td>' +
                                    '<td>' + data.yfjhgbsj + '</td>' +
                                    '<td>' +
                                        '<a class="btn-link btn-del">删除</a>' +
                                    '</td>' +
                                '</tr>'
                             ).data('data', data);
                    $('#yfResult tbody').append(tr);
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('.datepicker', this).datepicker({
                    format: 'yyyy/m/d',
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true,
                    language: 'zh-CN'
                });
            }
        });
    });

    //预防措施删除行
    $('#yfResult').on('click', '.btn-del', function () {
        var tr = $(this).parents('tr');
        $.confirm('确认删除纠正措施吗？', function (result) {
            if (result) {
               
                var data = tr.data('data');
                if (data.Id != 0) {
                    $.post(rootUrl + 'NPI/DeletePrecautionary', {
                        instanceId: instanceId,
                        Id: data.Id
                    }, function (res) {
                        if (res.state) {
                            $.tips('删除成功！', 0);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
                tr.remove();
            }
        });
    });

    //措施实施
    $('#AddImplement').on('click', function () {
        var html = template('layer-Implement', {});
        
        $.content({
            theme: 'blue',
            header: '添加措施实施',
            content: {
                html: html
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {

                    var user = $('[name="ssr_step3"]', this).data('data');
                    var data = {
                        Id:0,
                        ssjl: $('[name="ssjl_step3"]', this).val(),
                        sswcsj: $('[name="sswcsj_step3"]', this).val(),
                        gxqxzt_id: $('[name="gxqxzt_step3"]:checked', this).val(),
                        fgdsm: $('[name="fgdsm_step3"]', this).val(),
                        zrr: user.Badge,
                        zrrName: user.Name
                    }




                    if (data.ssjl == '') {
                        $.tips('请填写实施记录', 0);
                        return false;
                    }

                    if (data.gxqxzt_id == '' || data.gxqxzt_id == undefined) {
                        $.tips('请选择缺陷状态', 0);
                        return false;
                    }

                    if (data.gxqxzt_id == 1 & data.fgdsm == '') {
                        $.tips('请填写非固定说明', 0);
                        return false;
                    }

                    var tr = $(
                                '<tr class="cssc_step3_value">' +
                                    '<td>' + data.zrrName + '</td>' +
                                    '<td>' + data.sswcsj + '</td>' +
                                    '<td>' + data.ssjl + '</td>' +
                                    '<td>' +
                                        '<span class="defect-state"><span class="glyphicon ' + (data.gxqxzt_id == '0' ? 'glyphicon-ok-circle' : 'glyphicon-remove-circle') + '"></span>固定</span>' +
                                        '<span class="defect-state"><span class="glyphicon ' + (data.gxqxzt_id == '1' ? 'glyphicon-ok-circle' : 'glyphicon-remove-circle') + '"></span>非固定</span>' +
                                    '</td>' +
                                    '<td>' + data.fgdsm + '</td>' +
                                    '<td>' +
                                       
                                        '<a class="btn-link btn-del">删除</a>' +
                                    '</td>' +
                                '</tr>'
                            ).data('data', data);


                    $('#csResult tbody').append(tr);
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('.datepicker', this).datepicker({
                    format: 'yyyy/m/d',
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true,
                    language: 'zh-CN'
                });

                //非固定说明
                $('[name="gxqxzt_step3"]', this).on('change', function () {
                    if ($(this).val() == '1') {
                        $('#noFixed').css('display', 'block');
                    } else {
                        $('#noFixed').css('display', 'none');
                    }
                });

                $('[name="ssr_step3"').data('data', { Badge: operater, Name: operaterName });
            }
        });
    });
   
    //措施实施删除行
    $('#csResult').on('click', '.btn-del', function () {
        var tr = $(this).parents('tr');
        $.confirm('确认删除纠正措施吗？', function (result) {
            if (result) {
                var data = tr.data('data');
                if (data.Id != 0) {
                    $.post(rootUrl + 'NPI/DeleteImplement', {
                        instanceId: instanceId,
                        Id: data.Id
                    }, function (res) {
                        if (res.state) {
                            $.tips('删除成功！', 0);
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
                tr.remove();
            }
        });
    });

    //措施实施编辑行
    $('#csResult').on('click', '.btn-edit', function () {
        var tr = $(this).parents('tr');
        var data = tr.data('data');

        var html = template('layer-Implement', data);

        $.content({
            theme: 'blue',
            header: '编辑措施实施',
            content: {
                html: html
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var ssjl = $('[name="ssjl_step3"]', this).val();

                    if (ssjl = '') {
                        $.tips('请填写实施记录', 0);
                        return false;
                    }

                    var user = $('[name="ssr_step3"]', this).data('data');
                    var newData = {
                        ssjl: $('[name="ssjl_step3"]', this).val(),
                        sswcsj: $('[name="sswcsj_step3"]', this).val(),
                        gxqxzt_id: $('[name="gxqxzt_step3"]:checked', this).val(),
                        fgdsm: $('[name="fgdsm_step3"]', this).val(),
                        zrr: user.Badge,
                        zrrName: user.Name
                    }               

                    var newTr = $(
                                    '<tr>' +
                                        '<td>' + newData.zrrName + '</td>' +
                                        '<td>' + newData.sswcsj + '</td>' +
                                        '<td>' + newData.ssjl + '</td>' +
                                        '<td>' +
                                            '<span class="glyphicon ' + (newData.gxqxzt_id == '0' ? 'glyphicon-ok-circle' : 'glyphicon-remove-circle') + ' defect-state">固定</span>' +
                                            '<span class="glyphicon ' + (newData.gxqxzt_id == '1' ? 'glyphicon-ok-circle' : 'glyphicon-remove-circle') + ' defect-state">非固定</span>' +
                                        '</td>' +
                                        '<td>' + newData.fgdsm + '</td>' +
                                        '<td>' +
                                            '<a class="btn-link btn-edit">编辑</a> ' +
                                            '<a class="btn-link btn-del">删除</a>' +
                                        '</td>' +
                                    '</tr>'
                                ).data('data', newData);

                    tr.replaceWith(newTr);
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('.datepicker', this).datepicker({
                    format: 'yyyy/m/d',
                    autoclose: true,
                    clearBtn: true,
                    todayHighlight: true,
                    language: 'zh-CN'
                });

                //非固定说明
                $('[name="gxqxzt_step3"]', this).on('change', function () {
                    if ($(this).val() == '1') {
                        $('#noFixed').css('display', 'block');
                    } else {
                        $('#noFixed').css('display', 'none');
                    }
                });

                $('[name="ssr_step3"]', this).data('data', {
                    Badge: data.zrr,
                    Name: data.zrrName
                }).val(data.zrrName);
            }
        });
    });    

    $('[name="UpdateDefectWay"]').on('change', function () {
        if ($('[name="UpdateDefectWay"]:checked').val() == '2') {
            $('#noDefectWayDesc').removeClass('dis-none');
        } else {
            $('#noDefectWayDesc').addClass('dis-none');
        }
    });

    function postAttachment(source, target) {
        var attachments = [];
        var panel = $('#' + source);
        panel.find('.finish-queue-item').each(function () {
            if ($(this).data('fileid')) {
                attachments.push($(this).data('fileid'));
            }
        });

        if (attachments.length > 0) {

            $.post(rootUrl + 'NPI/' + target, {
                instanceId: instanceId,
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
    }

    $('#submit_cancel').on('click', function () {
        $.confirm('确定要删除本缺陷吗？', function (result) {
            if (result) {
                $.loading('提交中，请稍后...');
                $.post(rootUrl + 'NPI/SubmitCancel', {
                    instanceId: instanceId,
                    remark: '发起者取消流程'
                }, function (res) {
                    $.tlayer('close');
                    window.location.href = rootUrl + 'NPI/ApproveList';
                });



            }
        });

    });

    $('#submit_back').on('click', function () {



        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>'+cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {


                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/ReturnApproveToLast', {
                        instanceId: instanceId,
                        remark: remark
                    }, function (res) {
                        $.tlayer('close');
                        if (res.state) {
                            $.tips('驳回成功！', 3, function () {
                                window.location = rootUrl + 'npi/ApproveList';
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }]
        });
    });

    //提交确认
    $('#submitConfirm').on('click', function () {

        upModelData = GetModel();

        if (upModelData.Main.ConfirmInfo == '') {
            $.tips('确认意见不能为空！', 0);
            return false;
        }

        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {


                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitConfirm', {
                        instanceId: instanceId,
                        dataJson:JSON.stringify(upModelData),
                        remark: remark
                    }, function (res) {
                        $.tlayer('close');
                        if (res.state) {
                            $.tips('确认成功！', 3, function () {
                                postAttachment('ConfirmPanel', 'SaveConfirmAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });


    //提交协办完成
    $('#submitCoOrganizerComplete').on('click', function () {



        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>'+cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {


                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
            return false;
        }

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/submitCoOrganizerComplete', {
                        instanceId: instanceId,
                        remark: remark
                    }, function (res) {
                        $.tlayer('close');
                        if (res.state) {
                            $.tips('协办成功！', 3, function () {
                                window.location = rootUrl + 'npi/ApproveList';
                            });
                        } else {
                            $.tips(res.msg, 0);
        }
                    });
        }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });

    $('#UpdateState').on('change', function () {
        if ($('#UpdateState').prop("checked")) {
            $('#submit-Co-organizer').css('display', 'none');
        }
        else
        {
            $('#submit-Co-organizer').css('display', 'inline-block');
        }

    })

    //驳回到发起人
    $('#return-distribute').on('click', function () {
        $.content({
            theme: 'blue',
            header: '驳回',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>'+ cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('驳回意见不能为空！', 0);
                        return false;
                    }

                    $.tlayer('close');
                    $.loading('驳回中，请稍后...');
                    $.post(rootUrl + 'NPI/ReturnApproveToBegin', {
                        instanceId: instanceId,
                        remark: remark
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('驳回成功！', 3, function () {
                                window.location = rootUrl + 'npi/ApproveList';
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
   
    //协办发起
    $('#submit-Co-organizer').on('click', function () {


            var html = template('layer-Co-organizer', {});
            $.content({
                theme: 'blue',
                header: '协办',
                content: {
                    html: html
                },
                footer: [{
                    text: '确定',
                    style: 'primary',
                    callback: function () {
                        var remark = $('textarea', this).val();

                        if (remark == '') {
                            $.tips('协办意见不能为空！', 0);
                            return false;
                        }

                        var upModelData = GetModel();

                        var user = $('#Co-organizerPerson').data('data');
                        if (user == undefined || user == null) {
                            $.tips('未选择责任人！', 0);
                            return false;
                        }
                    

                        for (var i = 0, l = user.length; i < l; i++) {
                            user[i] = user[i].Badge;
                        }


                        $.tlayer('close');
                        $.loading('协办操作，请稍后...');
                        $.post(rootUrl + 'NPI/SubmitAssist', {
                            instanceId: instanceId,
                            toUser: user.join(','),
                            remark: remark,
                            dataJson: JSON.stringify(upModelData)
                        }, function (res) {
                            $.tlayer('close');

                            if (res.state) {
                                $.tips('协办成功！', 3, function () {
                                    window.location = rootUrl + 'npi/ApproveList';
                                });
                            } else {
                                $.tips(res.msg, 0);
                            }
                        });
                    }
                }, {
                    text: '取消'
                }],
                onInit: function () {
                    $('[name="cyc"]', this).on('change', function () {
                        var cyc = $(this).find("option:selected").text();
                        $('[name="cycbj"]').val('').val(cyc);
                    })
                }
            });
    
    });    
    //缺陷分配提交
    $('#submit-distribute').on('click', function () {
        
        upModelData = GetModel();

        if (upModelData.Main.QXDJ == '' || upModelData.Main.QXDJ == undefined) {
            $.tips('未选择缺陷等级！', 0);
            return false;
        }

        if (upModelData.DefectTypes.length == 0) {
            $.tips('未选择相关责任人！', 0);
            return false;
        }

        if (upModelData.Main.TRDPXJS == '') {
            $.tips('未填写TR点评审时间', 0);
            return false;
        }
        if (upModelData.Main.CPJD == '') {
            $.tips('未填写产品阶段', 0);
            return false;
        }
        
        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;" name="cycbj"></textarea>' + cycCommon
                      
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {


                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }


                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitDistribute', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('AssignPanel', 'SaveAssignAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
    //缺陷分析提交
    $('#submit_analysis').on('click', function () {

        upModelData = GetModel();
        var msg = "";

        $(".qxfx_step2:not([readonly])").each(function () {
            if ($(this).val() == '') {
                msg = '请填写原因分析！';
                
            }
        });


        if (upModelData.Correctives.length == 0) {
            msg +=' 请填写纠正措施！';
        }
        if(msg!='')
        {
            $.tips(msg, 0);
            return;
        }
        
        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    

                    

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitAnalysis', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('analysisPanel', 'SaveReasonAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });


    });
    //实施提交
    $('#submitImplement').on('click', function () {

        upModelData = GetModel();

        if (NPIModel.Implements.length == 0) {
            $.tips('请填写相关实施记录！', 0);
            return false;
        }

        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    

                    

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitImplement', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('panel-implement', 'SaveImplementAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
    //验证
    $('#submitVerified').on('click', function () {

        upModelData = GetModel();
        upModelData.Main.State = $('#UpdateState').is(':checked') == true ? 5 : 6;


        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    
                    
                    

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitVerify', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('panel-verifa', 'SaveVerifAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
    $('#submitPQEAssess').on('click', function () {
        upModelData = GetModel();
        var msg='';

        if (upModelData.Main.PQEPGNR=='') {
            msg = '请填写评估内容！';
        }

        if (upModelData.Main.PQEPass == undefined) {
            msg += '请选择是否通过！';
        }
        if (msg != '') {
            $.tips(msg, 0);
            return false;
        }

        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }


                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitPQEAssess', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('panel-pqeAssess', 'SaveAssessPQEAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
    //总工评估
    $('#submitAssess').on('click', function () {

        upModelData = GetModel();
        var msg = '';

        if (upModelData.Main.IsAccept == undefined) {
            msg = '请选择接收意见！';
        }

        if (upModelData.Main.PGNR == '') {
            msg += '请填写评估内容！';
        }
        if (msg != '') {
            $.tips(msg, 0);
            return false;
        }

        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitAssess', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('panel-Assess', 'SaveAssessAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });
    //挂起
    $('#submitComplete').on('click', function () {

        upModelData = GetModel();
        

       if (upModelData.Main.YYSM == '') {
            $.tips('原因说明不能为空！', 0);
            return false;
       }

        NPIModel.Main.State = $('#qxState').val();
        $.content({
            theme: 'blue',
            header: '提交',
            content: {
                html: '<textarea class="form-control" style="height: 100px;"  name="cycbj"></textarea>' + cycCommon
            },
            footer: [{
                text: '确定',
                style: 'primary',
                callback: function () {
                    var remark = $('textarea', this).val();

                    if (remark == '') {
                        $.tips('提交意见不能为空！', 0);
                        return false;
                    }

                    $.tlayer('close');
                    $.loading('提交中，请稍后...');
                    $.post(rootUrl + 'NPI/SubmitHangUp', {
                        instanceId: instanceId,
                        remark: remark,
                        dataJson: JSON.stringify(upModelData)
                    }, function (res) {
                        $.tlayer('close');

                        if (res.state) {
                            $.tips('提交成功！', 3, function () {
                                postAttachment('panel-hangup', 'SaveHangUpAttachment');
                            });
                        } else {
                            $.tips(res.msg, 0);
                        }
                    });
                }
            }, {
                text: '取消'
            }],
            onInit: function () {
                $('[name="cyc"]', this).on('change', function () {
                    var cyc = $(this).find("option:selected").text();
                    $('[name="cycbj"]').val('').val(cyc);
                })
            }
        });
    });


    //首页提交
    $('#wpbm').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Product/SearchProduct',
            dataType: 'jsonp',
            dataField: null
        },
        width: 400,
        template: '<td>#{cpBm}</td><td>#{cpName}</td><td>#{xsxhName}</td>',
        callback: function (data) {
            $('#cpx').val(data.cpxName).data('data', data);
            $('#wpbm').val(data.cpBm).data('data', data);
            $('#wpxh').val(data.cpName).data('data', data);
            setRevision($('#wpbm').val());
        }
    });

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
                    var opt = '<option value="' + value.revision + '">' + value.revision + '</option>';
                    $('#yjbb').append(opt);
                });
            },
            error: function () {
                alert('fail');
            }
        });


    }


    function submit() {

        var data = {
            Main: {
                ZY: $('[id="qxzy"]').val(),
                QXMS: $('[id="qxms"]').val(),
                CPX: $('[id="cpx"]').val(),
                WPBM: $('[id="wpbm"]').val(),
                WPXH: $('[id="wpxh"]').val(),
                XMDM: $('[id="xmdm"]').val(),
                YJBB: $('[id="yjbb"]').val(),
                RJBB: $('[id="rjbb"]').val(),
                YXJ: $('[id="yxj"]').val(),
                Id: npi_mainId,
                InstanceId: instanceId
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


        $.confirm('确定要提交审批吗？', function (result) {
            if (result) {
                $.tlayer('close');
                $.loading('提交中，请稍后...');
                submitApprove(data);



            }
        });
    }

    function submitApprove(data) {
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


    $('#submit-create').on('click', function () {

        submit();

    });


    $('#xmdm').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Project/GetProjectCodes',
            dataType: 'jsonp',
            dataField: null
        },
        maxNum: 10,
        width: 400,
        template: '<td>#{segment1}</td><td>#{description}</td>',
        callback: function (data) {
            $('#xmdm').val(data.segment1).data('data', data);

        }
    });

    $('#wpxh').autoComplete({
        async: {
            url: 'http://webapi.maipu.com/Selector/Product/SearchProduct',
            dataType: 'jsonp',
            dataField: null
        },
        width: 400,
        template: '<td>#{cpName}</td><td>#{cpBm}</td><td>#{xsxhName}</td>',
        callback: function (data) {
            $('#wpbm').val(data.cpBm).data('data', data);
            $('#wpxh').val(data.cpName).data('data', data);
            $('#cpx').val(data.cpxName).data('data', data);
            setRevision($('#wpbm').val());
        }
    });
});