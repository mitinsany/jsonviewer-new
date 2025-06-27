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
                
                // Активируем вторую вкладку в TabBar
                var tabPanel = this.getView();
                var tabBar = tabPanel.getTabBar();
                if (tabBar) {
                    var secondTab = tabBar.getComponent(1);
                    if (secondTab) {
                        secondTab.setDisabled(false);
                    }
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
        console.log('onJsonValid called with:', jsonContent);
        // Активируем вторую вкладку при валидном JSON
        var tabPanel = this.getView();
        var tabBar = tabPanel.getTabBar();
        console.log('TabPanel:', tabPanel);
        console.log('TabBar:', tabBar);
        if (tabBar) {
            var secondTab = tabBar.getComponent(1);
            console.log('Second tab:', secondTab);
            if (secondTab) {
                console.log('Enabling second tab');
                secondTab.setDisabled(false);
                console.log('Second tab disabled after:', secondTab.disabled);
            } else {
                console.log('Second tab not found');
            }
        } else {
            console.log('TabBar not found');
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
        
        // Деактивируем вторую вкладку в TabBar
        var tabPanel = this.getView();
        var tabBar = tabPanel.getTabBar();
        if (tabBar) {
            var secondTab = tabBar.getComponent(1);
            if (secondTab) {
                secondTab.setDisabled(true);
            }
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
