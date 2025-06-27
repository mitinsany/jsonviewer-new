/**
 * Контроллер для просмотра JSON
 */
Ext.define('JsonViewer.view.main.JsonViewerController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.json-viewer',

    /**
     * Обработчик выбора узла в дереве
     */
    onTreeNodeSelect: function(tree, record) {
        var me = this;
        var viewModel = me.getViewModel();
        
        if (record) {
            // Получаем данные узла разными способами в зависимости от типа record
            var nodeData;
            if (record.getData && typeof record.getData === 'function') {
                nodeData = record.getData();
            } else if (record.data) {
                nodeData = record.data;
            } else {
                nodeData = record;
            }
            
            var properties = me.extractProperties(nodeData);
            
            // Получаем store и обновляем его данные
            var store = viewModel.getStore('selectedNodeProperties');
            if (store) {
                store.loadData(properties);
            } else {
                // Если store не найден, создаем его
                viewModel.setStores({
                    selectedNodeProperties: {
                        type: 'array',
                        fields: ['name', 'value', 'type'],
                        data: properties
                    }
                });
            }
        } else {
            // Очищаем store если ничего не выбрано
            var store = viewModel.getStore('selectedNodeProperties');
            if (store) {
                store.loadData([]);
            }
        }
    },

    /**
     * Извлечение свойств узла для отображения
     */
    extractProperties: function(nodeData) {
        var properties = [];
        
        if (nodeData) {
            // Добавляем основные свойства узла
            properties.push({
                name: 'Тип',
                value: this.getNodeType(nodeData),
                type: 'string'
            });
            
            properties.push({
                name: 'Путь',
                value: nodeData.path || '',
                type: 'string'
            });
            
            if (nodeData.data !== undefined) {
                properties.push({
                    name: 'Значение',
                    value: this.formatValue(nodeData.data),
                    type: typeof nodeData.data
                });
            }
            
            if (nodeData.children && nodeData.children.length > 0) {
                properties.push({
                    name: 'Количество дочерних элементов',
                    value: nodeData.children.length,
                    type: 'number'
                });
            }
        }
        
        return properties;
    },

    /**
     * Определение типа узла
     */
    getNodeType: function(nodeData) {
        if (nodeData.data === null) return 'null';
        if (Array.isArray(nodeData.data)) return 'array';
        if (typeof nodeData.data === 'object') return 'object';
        if (typeof nodeData.data === 'string') return 'string';
        if (typeof nodeData.data === 'number') return 'number';
        if (typeof nodeData.data === 'boolean') return 'boolean';
        return 'unknown';
    },

    /**
     * Форматирование значения для отображения
     */
    formatValue: function(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return '"' + value + '"';
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (e) {
                return '[Object]';
            }
        }
        return String(value);
    },

    /**
     * Обновление дерева при изменении JSON
     */
    updateTree: function(jsonData) {
        console.log('JsonViewerController.updateTree called with:', jsonData);
        var me = this;
        var tree = me.lookupReference('jsonTree');
        console.log('Tree component:', tree);
        var store = tree.getStore();
        console.log('Tree store:', store);
        
        if (jsonData) {
            // Создаем корневой узел с именем "root"
            var rootNode = {
                text: 'root',
                iconCls: 'fa fa-database',
                data: jsonData,
                path: 'root',
                children: [me.convertJsonToTreeData(jsonData, 'root')],
                leaf: false,
                expanded: true
            };
            
            console.log('Root node:', rootNode);
            store.setRoot(rootNode);
        } else {
            store.setRoot(null);
        }
    },

    /**
     * Конвертация JSON в структуру дерева
     */
    convertJsonToTreeData: function(data, path) {
        var me = this;
        path = path || '';
        
        if (data === null) {
            return {
                text: 'null',
                iconCls: 'fa fa-circle',
                data: null,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'string') {
            return {
                text: '"' + data + '"',
                iconCls: 'fa fa-file-text-o',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'number') {
            return {
                text: String(data),
                iconCls: 'fa fa-hashtag',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'boolean') {
            return {
                text: String(data),
                iconCls: data ? 'fa fa-check' : 'fa fa-times',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (Array.isArray(data)) {
            var children = data.map(function(item, index) {
                var childPath = path ? path + '[' + index + ']' : '[' + index + ']';
                return me.convertJsonToTreeData(item, childPath);
            }, me);
            
            return {
                text: 'Array (' + data.length + ')',
                iconCls: 'fa fa-list',
                data: data,
                path: path,
                children: children,
                leaf: false,
                expanded: true
            };
        }
        
        if (typeof data === 'object') {
            var children = [];
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var childPath = path ? path + '.' + key : key;
                    children.push(me.convertJsonToTreeData(data[key], childPath));
                }
            }
            
            return {
                text: 'Object (' + children.length + ')',
                iconCls: 'fa fa-folder',
                data: data,
                path: path,
                children: children,
                leaf: false,
                expanded: true
            };
        }
        
        return {
            text: 'Unknown',
            iconCls: 'fa fa-question',
            data: data,
            path: path,
            leaf: true
        };
    }
}); 