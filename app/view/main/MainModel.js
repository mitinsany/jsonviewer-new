/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('JsonViewer.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',

    alias: 'viewmodel.main',

    data: {
        name: 'JsonViewer',
        jsonContent: '',
        isJsonValid: false,
        parsedJson: null
    },

    stores: {
        selectedNodeProperties: {
            type: 'array',
            fields: ['name', 'value', 'type'],
            data: []
        }
    },

    formulas: {
        // Формула для определения доступности второй вкладки
        isViewerTabEnabled: function(get) {
            return get('isJsonValid');
        }
    }
});
