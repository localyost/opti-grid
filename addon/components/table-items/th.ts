import Component from '@ember/component';
import hbs from 'htmlbars-inline-precompile';
import { tagName, layout, attribute } from '@ember-decorators/component';
import Column from "opti-grid/objects/Column";
@tagName('th')
@layout(hbs`{{get record column.name}}`)
export default class TH extends Component {

    column!: Column;

    @attribute('scope') scope = 'col';

    didInsertElement(){
        this._super(...arguments);
        // set width
        if (this.column.settings && this.column.settings.width) {
            this.$().css('width', this.column.settings.width);
        }
    }

};
