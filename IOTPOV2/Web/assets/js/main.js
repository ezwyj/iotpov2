if (typeof OP_CONFIG != 'undefined' && OP_CONFIG.module && OP_CONFIG.page) {
    require.config({
        baseUrl: OP_CONFIG.rootUrl + 'assets/js',
        paths: {
            'jquery': 'lib/jquery-1.11.3.min',
            'bootstrap': 'lib/bootstrap.min',
            'uploadify': 'lib/jquery.uploadify',
            'tlayer': 'lib/jquery.tlayer',
            'plugins': 'lib/jquery.plugins',
            'util': 'lib/util',
            'ztree': OP_CONFIG.rootUrl + 'assets/plugins/ztree/jquery.ztree.all-3.5.min',
            'datepicker': OP_CONFIG.rootUrl + 'assets/plugins/datepicker/bootstrap-datepicker.min',
            'selector': OP_CONFIG.rootUrl + 'assets/plugins/selector/selector',
            'template': OP_CONFIG.rootUrl + 'assets/plugins/art-template',
            'echarts': OP_CONFIG.rootUrl + 'assets/plugins/echarts/echarts-all',
            'mqtt': 'lib/mqttws31',
        },
        shim: {
            'bootstrap': {
                deps: ['jquery']
            },
            'uploadify': {
                deps: ['jquery']
            },
            'ztree': {
                deps: ['jquery']
            },
            'tlayer': {
                deps: ['jquery']
            },
            'plugins': {
                deps: ['jquery']
            },
            'datepicker': {
                deps: ['jquery']
            },
            'selector': {
                deps: ['jquery', 'tlayer']
            },
            'echarts': {
                deps:['jquery']
            },
            'mqtt': {
                exports: 'mqtt'
            }
        },
        urlArgs: 'bust=' + (new Date()).getTime()   //开发环境下禁用缓存，生成环境要移除
    });

    require(['app/' + OP_CONFIG.module + '/' + OP_CONFIG.page]);
}