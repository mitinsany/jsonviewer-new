/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('JsonViewer.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    /**
     * Обработчик изменения JSON данных
     */
    onJsonChanged: function(jsonContent) {
        var viewModel = this.getViewModel();
        var jsonViewer = this.getView().down('jsonviewer');
        
        if (!jsonContent || !jsonContent.trim()) {
            viewModel.set('isJsonValid', false);
            viewModel.set('parsedJson', null);
            if (jsonViewer) {
                jsonViewer.setDisabled(true);
            }
            // Отправляем событие через EventBus
            Ext.GlobalEvents.fireEvent('jsonCleared');
            return;
        }

        try {
            var parsed = JSON.parse(jsonContent);
            viewModel.set('isJsonValid', true);
            viewModel.set('parsedJson', parsed);
            
            if (jsonViewer) {
                jsonViewer.setDisabled(false);
                jsonViewer.updateView(parsed);
                
                // Активируем вторую вкладку через reference
                var jsonViewerTab = this.lookupReference('jsonViewerTab');
                if (jsonViewerTab) {
                    jsonViewerTab.setDisabled(false);
                }
            }
            
            // Отправляем событие через EventBus
            Ext.GlobalEvents.fireEvent('jsonValid', jsonContent);
        } catch (e) {
            viewModel.set('isJsonValid', false);
            viewModel.set('parsedJson', null);
            if (jsonViewer) {
                jsonViewer.setDisabled(true);
            }
            // Отправляем событие через EventBus
            Ext.GlobalEvents.fireEvent('jsonCleared');
        }
    },

    onJsonFormatted: function(formattedJson) {
        this.onJsonChanged(formattedJson);
    },

    onJsonValid: function(jsonContent) {
        // Активируем вторую вкладку при валидном JSON
        var jsonViewerTab = this.lookupReference('jsonViewerTab');
        if (jsonViewerTab) {
            jsonViewerTab.setDisabled(false);
        }
    },

    onJsonCleared: function() {
        var viewModel = this.getViewModel();
        var jsonViewer = this.getView().down('jsonviewer');
        
        viewModel.set('isJsonValid', false);
        viewModel.set('parsedJson', null);
        
        if (jsonViewer) {
            jsonViewer.setDisabled(true);
        }
        
        // Деактивируем вторую вкладку через reference
        var jsonViewerTab = this.lookupReference('jsonViewerTab');
        if (jsonViewerTab) {
            jsonViewerTab.setDisabled(true);
        }
    },

    /**
     * Инициализация контроллера
     */
    init: function() {
        var me = this;
        
        // Подписываемся на события через EventBus
        Ext.GlobalEvents.on({
            jsonFormatted: me.onJsonFormatted,
            jsonValid: me.onJsonValid,
            jsonCleared: me.onJsonCleared,
            scope: me
        });
    },

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    }
});
