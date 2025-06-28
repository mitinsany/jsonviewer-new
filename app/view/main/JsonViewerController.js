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
        
        // Проверяем, что все параметры существуют
        if (!tree || !record) {
            return;
        }
        
        var viewModel = me.getViewModel();
        if (!viewModel) {
            return;
        }
        
        // Получаем данные узла разными способами в зависимости от типа record
        var nodeData;
        if (record.getData && typeof record.getData === 'function') {
            nodeData = record.getData();
        } else if (record.data) {
            nodeData = record.data;
        } else {
            nodeData = record;
        }
        
        // Если nodeData это массив, берем первый элемент
        if (Array.isArray(nodeData)) {
            nodeData = nodeData[0];
        }
        
        // Если это ExtJS Model, получаем данные из свойства data
        if (nodeData && nodeData.data) {
            nodeData = nodeData.data;
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
    },

    /**
     * Извлечение свойств узла для отображения
     */
    extractProperties: function(nodeData) {
        var properties = [];
        
        if (!nodeData) {
            return properties;
        }
        
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
        
        // Проверяем, есть ли данные в узле
        if (nodeData.data !== undefined) {
            properties.push({
                name: 'Значение',
                value: this.formatValue(nodeData.data),
                type: typeof nodeData.data
            });
        } else if (nodeData.text) {
            // Если нет data, но есть text, используем его
            properties.push({
                name: 'Текст',
                value: nodeData.text,
                type: 'string'
            });
        }
        
        if (nodeData.children && nodeData.children.length > 0) {
            properties.push({
                name: 'Количество дочерних элементов',
                value: nodeData.children.length,
                type: 'number'
            });
        }
        
        // Добавляем дополнительные свойства
        if (nodeData.leaf !== undefined) {
            properties.push({
                name: 'Листовой узел',
                value: nodeData.leaf ? 'Да' : 'Нет',
                type: 'boolean'
            });
        }
        
        if (nodeData.cls) {
            properties.push({
                name: 'CSS Класс',
                value: nodeData.cls,
                type: 'string'
            });
        }
        
        return properties;
    },

    /**
     * Определение типа узла
     */
    getNodeType: function(nodeData) {
        if (!nodeData) {
            return 'unknown';
        }
        
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
        var me = this;
        var tree = me.lookupReference('jsonTree');
        
        if (!tree) {
            return;
        }
        
        var store = tree.getStore();
        if (!store) {
            return;
        }
        
        if (jsonData) {
            // Создаем корневой узел с именем "root"
            var rootNode = {
                text: 'root',
                cls: 'json-type-object',
                data: jsonData,
                path: 'root',
                children: [me.convertJsonToTreeData(jsonData, 'root')],
                leaf: false,
                expanded: true
            };
            
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
                cls: 'json-type-null',
                data: null,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'string') {
            return {
                text: '"' + data + '"',
                cls: 'json-type-string',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'number') {
            return {
                text: String(data),
                cls: 'json-type-number',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (typeof data === 'boolean') {
            return {
                text: String(data),
                cls: data ? 'json-type-boolean' : 'json-type-boolean false',
                data: data,
                path: path,
                leaf: true
            };
        }
        
        if (Array.isArray(data)) {
            var children = data.map(function(item, index) {
                var childPath = path ? path + '[' + index + ']' : '[' + index + ']';
                var childNode = me.convertJsonToTreeData(item, childPath);
                // Добавляем индекс к тексту для массивов
                childNode.text = '[' + index + ']: ' + childNode.text;
                return childNode;
            }, me);
            
            return {
                text: 'Array (' + data.length + ')',
                cls: 'json-type-array',
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
                    var childNode = me.convertJsonToTreeData(data[key], childPath);
                    // Добавляем ключ к тексту для объектов
                    childNode.text = key + ': ' + childNode.text;
                    children.push(childNode);
                }
            }
            
            return {
                text: 'Object (' + children.length + ')',
                cls: 'json-type-object',
                data: data,
                path: path,
                children: children,
                leaf: false,
                expanded: true
            };
        }
        
        return {
            text: 'Unknown',
            cls: 'json-type-unknown',
            data: data,
            path: path,
            leaf: true
        };
    }
}); 