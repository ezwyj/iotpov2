/**
 * 公用js文件
 */
define('common', ['jquery'], function ($) {
    //导航栏选中
    $('#menu-' + OP_CONFIG.module + '-' + OP_CONFIG.page).addClass('active');

    //设置弹出框图片路径
    //$.tlayer('global', { imgPath: OP_CONFIG.rootUrl + 'assets/img/', theme: 'blue' });

    ////选择器配置
    //selector.baseUrl = OP_CONFIG.rootUrl + 'assets/plugins/selector/';

    //禁用ajax缓存
    $.ajaxSetup({ cache: false });

    //设置页面最小高度
    var minHeight = $(window).height() - $('#footer').outerHeight(true);
    $('#main').css('min-height', minHeight);
    
    //panel展开/收起
    $(document).on('click', '.panel[data-expand] .panel-heading', function () {
        var panel = $(this).parent();
        var expand = panel.attr('data-expand');

        panel.children('.panel-body').slideToggle('fast', function () {
            if (expand == 'Y') {
                panel.attr('data-expand', 'N');
            } else {
                panel.attr('data-expand', 'Y');
            }
        });
    });

    $(document).on('click', '.panel[data-expand] .btn', function (e) {
        e.stopPropagation();
    });    

    //选择组织架构
    $(document).on('click', '.selector-organiztion', function () {
        var type = $(this).data('type');
        var input = $(this).parent().prev();

        selector[type]({
            callback: function (data) {
                $.tlayer('close');
                input.data('data', data);

                switch (type) {
                    case 'singleDep':
                        input.val(data.DepName);
                        break;
                    case 'singlePeople':
                        input.val(data.Name);
                        break;
                    case 'multiPeople':
                        var name = [];

                        for (var i = 0, l = data.length; i < l; i++) {
                            name.push(data[i].Name);
                        }

                        input.val(name.join(','));
                        break;
                }
            }
        });
    });

    //选择产品
    $(document).on('click', '.selector-product', function () {
        var level = $(this).data('level');
        var multi = $(this).data('multi');
        var input = $(this).parent().prev();

        selector.product({
            level: level,
            multi: multi,
            callback: function (data) {
                $.tlayer('close');
                input.val(data.Name).data('data', data);
            }
        });
    });

   
    Date.prototype.toCSharpTime = function () {
        return '/Date(' + this.getTime() + ')/';
    }

    //清除选择器结果
    $(document).on('click', '.selector-clear', function () {
        $(this).parent().prev().val('').removeData('data');
    });

    return $;
});