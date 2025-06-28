/**
 * Контроллер для ввода JSON
 */
Ext.define('JsonViewer.view.main.JsonInputController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.jsoninput',

    /**
     * Вставить JSON из буфера обмена
     */
    onPasteFromClipboard: function() {
        var me = this;
        
        // Используем современный Clipboard API
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText().then(function(text) {
                me.getViewModel().set('jsonContent', text);
                me.onJsonInputChange();
            }).catch(function(err) {
                Ext.Msg.alert('Ошибка', 'Не удалось получить данные из буфера обмена: ' + err.message);
            });
        } else {
            // Fallback для старых браузеров
            Ext.Msg.prompt('Вставка из буфера', 
                'Вставьте JSON содержимое:', 
                function(btn, text) {
                    if (btn === 'ok' && text) {
                        me.getViewModel().set('jsonContent', text);
                        me.onJsonInputChange();
                    }
                }
            );
        }
    },

    /**
     * Форматировать JSON
     */
    onFormatJson: function() {
        var me = this;
        var viewModel = me.getViewModel();
        var jsonContent = viewModel.get('jsonContent');
        
        if (!jsonContent || !jsonContent.trim()) {
            Ext.Msg.alert('Предупреждение', 'Поле ввода пустое');
            return;
        }

        try {
            // Парсим JSON для проверки валидности
            var parsed = JSON.parse(jsonContent);
            // Форматируем с отступами
            var formatted = JSON.stringify(parsed, null, 4);
            viewModel.set('jsonContent', formatted);
            me.onJsonInputChange();
        } catch (e) {
            Ext.Msg.alert('Ошибка', 'Неверный JSON формат: ' + e.message);
        }
    },

    /**
     * Очистить поле ввода
     */
    onClear: function() {
        // Отправляем событие о необходимости очистки через EventBus
        Ext.GlobalEvents.fireEvent('jsonInputClearRequested');
    },

    /**
     * Обработчик изменения содержимого JSON
     */
    onJsonInputChange: function(field) {
        var value = field ? field.getValue() : this.getViewModel().get('jsonContent');
        
        // Обновляем viewModel
        this.getViewModel().set('jsonContent', value);
        
        var hasContent = value && value.trim() !== '';
        var isValidJson = false;
        
        // Проверяем валидность JSON
        if (hasContent) {
            try {
                JSON.parse(value);
                isValidJson = true;
            } catch (e) {
                isValidJson = false;
            }
        }
        
        // Отправляем события через EventBus для управления кнопками
        if (hasContent) {
            Ext.GlobalEvents.fireEvent('jsonInputHasContent');
        } else {
            Ext.GlobalEvents.fireEvent('jsonInputEmpty');
        }
        
        if (isValidJson) {
            Ext.GlobalEvents.fireEvent('jsonInputValid');
        } else if (hasContent) {
            Ext.GlobalEvents.fireEvent('jsonInputInvalid');
        }
        
        if (!hasContent) {
            this.getViewModel().set('isJsonValid', false);
            this.getViewModel().set('parsedJson', null);
            return;
        }

        try {
            var parsed = JSON.parse(value);
            this.getViewModel().set('isJsonValid', true);
            this.getViewModel().set('parsedJson', parsed);
            
            // Уведомляем главный контроллер о валидном JSON через EventBus
            Ext.GlobalEvents.fireEvent('jsonFormatted', value);
            
            // Дополнительное событие для активации вкладки
            Ext.GlobalEvents.fireEvent('jsonValid', value);
        } catch (e) {
            this.getViewModel().set('isJsonValid', false);
            this.getViewModel().set('parsedJson', null);
        }
    },

    onFormatClick: function() {
        var textarea = this.getView().down('textarea');
        var value = textarea.getValue();
        
        if (value) {
            try {
                var parsed = JSON.parse(value);
                var formatted = JSON.stringify(parsed, null, 2);
                textarea.setValue(formatted);
                
                // Уведомляем главный контроллер о валидном JSON
                this.fireEvent('jsonFormatted', formatted);
            } catch (e) {
                Ext.Msg.alert('Error', 'Invalid JSON format: ' + e.message);
            }
        }
    },

    onClearClick: function() {
        var textarea = this.getView().down('textarea');
        textarea.setValue('');
        
        // Уведомляем главный контроллер об очистке
        this.fireEvent('jsonCleared');
    }
}); 