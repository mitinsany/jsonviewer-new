/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 */
Ext.define('JsonViewer.view.main.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'JsonViewer.view.main.MainController',
        'JsonViewer.view.main.MainModel',
        'JsonViewer.view.main.JsonInput',
        'JsonViewer.view.main.JsonViewer'
    ],

    controller: 'main',
    viewModel: 'main',

    header: {
        title: {
            bind: {
                text: '{name}'
            },
            flex: 0
        },
        iconCls: 'fa fa-th-list'
    },

    defaults: {
        // bodyPadding: 20 - убрано для более компактного отображения
    },

    items: [{
        title: 'JSON Input',
        iconCls: 'fa fa-edit',
        xtype: 'jsoninput'
    }, {
        title: 'JSON Viewer',
        iconCls: 'fa fa-tree',
        xtype: 'jsonviewer',
        reference: 'jsonViewerTab',
        disabled: true
    }]
});
