/**
 * Представление для ввода JSON с панелью инструментов
 */
Ext.define('JsonViewer.view.main.JsonInput', {
    extend: 'Ext.panel.Panel',
    xtype: 'jsoninput',

    requires: [
        'Ext.form.field.TextArea',
        'Ext.toolbar.Toolbar',
        'Ext.button.Button',
        'JsonViewer.view.main.JsonInputController'
    ],

    controller: 'jsoninput',

    title: 'JSON Input',
    layout: 'fit',

    /**
     * Инициализация компонента
     */
    initComponent: function() {
        var me = this;
        
        me.callParent();
        
        // Подписываемся на события EventBus для управления кнопками
        Ext.GlobalEvents.on({
            jsonInputHasContent: me.onJsonInputHasContent,
            jsonInputEmpty: me.onJsonInputEmpty,
            jsonInputValid: me.onJsonInputValid,
            jsonInputInvalid: me.onJsonInputInvalid,
            jsonInputClearRequested: me.onJsonInputClearRequested,
            scope: me
        });
    },

    /**
     * Обработчик события наличия содержимого в поле ввода
     */
    onJsonInputHasContent: function() {
        var clearBtn = this.lookupReference('clearBtn');
        if (clearBtn) {
            clearBtn.setDisabled(false);
        }
    },

    /**
     * Обработчик события пустого поля ввода
     */
    onJsonInputEmpty: function() {
        var formatBtn = this.lookupReference('formatBtn');
        var clearBtn = this.lookupReference('clearBtn');
        
        if (formatBtn) {
            formatBtn.setDisabled(true);
        }
        if (clearBtn) {
            clearBtn.setDisabled(true);
        }
    },

    /**
     * Обработчик события валидного JSON
     */
    onJsonInputValid: function() {
        var formatBtn = this.lookupReference('formatBtn');
        if (formatBtn) {
            formatBtn.setDisabled(false);
        }
    },

    /**
     * Обработчик события невалидного JSON
     */
    onJsonInputInvalid: function() {
        var formatBtn = this.lookupReference('formatBtn');
        if (formatBtn) {
            formatBtn.setDisabled(true);
        }
    },

    /**
     * Обработчик события запроса на очистку поля ввода
     */
    onJsonInputClearRequested: function() {
        var textarea = this.down('textarea');
        if (textarea) {
            textarea.setValue('');
        }
        
        // Отправляем событие о пустом поле ввода
        Ext.GlobalEvents.fireEvent('jsonInputEmpty');
        
        // Уведомляем главный контроллер об очистке
        Ext.GlobalEvents.fireEvent('jsonCleared');
    },

    items: [{
        xtype: 'textarea',
        name: 'jsonInput',
        emptyText: 'Enter JSON...',
        height: 400,
        allowBlank: false,
        enableKeyEvents: true,
        listeners: {
            keyup: 'onJsonInputChange',
            change: 'onJsonInputChange'
        }
    }],

    tbar: [{
        xtype: 'button',
        text: 'Format',
        iconCls: 'fa fa-bars',
        cls: 'x-btn-format',
        reference: 'formatBtn',
        handler: 'onFormatJson',
        disabled: true
    }, {
        xtype: 'button',
        text: 'Clear',
        iconCls: 'fa fa-times',
        cls: 'x-btn-clear',
        reference: 'clearBtn',
        handler: 'onClear',
        disabled: true
    }
    // , {
    //     xtype: 'button',
    //     text: 'Paste',
    //     iconCls: 'fa fa-paste',
    //     cls: 'x-btn-paste',
    //     reference: 'pasteBtn',
    //     handler: 'onPasteFromClipboard',
    //     disabled: false
    // }
    ]
}); 