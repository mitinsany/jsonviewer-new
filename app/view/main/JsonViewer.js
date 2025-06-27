/**
 * Представление для просмотра JSON
 */
Ext.define('JsonViewer.view.main.JsonViewer', {
    extend: 'Ext.panel.Panel',
    xtype: 'jsonviewer',

    requires: [
        'JsonViewer.view.main.JsonViewerController'
    ],

    controller: 'json-viewer',

    layout: 'border',
    bodyPadding: 10,

    /**
     * Обновление представления с новыми JSON данными
     */
    updateView: function(jsonData) {
        console.log('JsonViewer.updateView called with:', jsonData);
        var controller = this.getController();
        console.log('JsonViewer controller:', controller);
        if (controller && controller.updateTree) {
            console.log('Calling controller.updateTree');
            controller.updateTree(jsonData);
        } else {
            console.log('Controller or updateTree method not found');
        }
    },

    items: [{
        xtype: 'treepanel',
        region: 'west',
        reference: 'jsonTree',
        title: 'Структура JSON',
        width: 400,
        split: true,
        collapsible: true,
        rootVisible: true,
        useArrows: true,
        listeners: {
            selectionchange: 'onTreeNodeSelect'
        },
        store: {
            type: 'tree',
            root: {
                text: 'Корень',
                expanded: true,
                children: []
            }
        }
    }, {
        xtype: 'grid',
        region: 'center',
        title: 'Свойства выбранного элемента',
        bind: {
            store: '{selectedNodeProperties}'
        },
        columns: [{
            text: 'Свойство',
            dataIndex: 'name',
            width: 200,
            sortable: false
        }, {
            text: 'Значение',
            dataIndex: 'value',
            flex: 1,
            sortable: false,
            renderer: function(value, meta, record) {
                var type = record.get('type');
                var cssClass = '';
                
                switch(type) {
                    case 'string':
                        cssClass = 'json-string';
                        break;
                    case 'number':
                        cssClass = 'json-number';
                        break;
                    case 'boolean':
                        cssClass = 'json-boolean';
                        break;
                    case 'null':
                        cssClass = 'json-null';
                        break;
                    default:
                        cssClass = 'json-default';
                }
                
                meta.tdCls = cssClass;
                return value;
            }
        }, {
            text: 'Тип',
            dataIndex: 'type',
            width: 100,
            sortable: false,
            renderer: function(value) {
                return '<span class="type-' + value + '">' + value + '</span>';
            }
        }]
    }]
}); 