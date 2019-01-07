/* eslint-env node */
'use strict';

module.exports = {
    name: 'opti-grid',

    isDevelopingAddon() {
        return true;
    },

    included(app, parentAddon) {
        this._super.included.apply(this, arguments);

        let target = (parentAddon || app);
        target.options = target.options || {}; // Ensures options exists for Scss/Less below

        target.import('vendor/opti-grid-styles.css');
        target.import('vendor/tableHeadFixer.js');
        target.import('vendor/colResizable-1.6.js');

        target.import('node_modules/tableexport/src/stable/js/tableexport.js');

    },
};
