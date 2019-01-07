import Component from '@ember/component';
import { layout, classNames, className } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import {isPresent} from "@ember/utils";
// const ROW_HEIGHT = 25;
@layout(hbs`{{yield}}`)
@classNames('opti-grid-wrapper')
export default class AutoSizeWrapper extends Component {

    tableSettings!: ITableSettings;

    @className('full') full!: string;

    didInsertElement(){
        this._super(...arguments);
        // is a mainGrid
        if (isPresent(this.tableSettings.level) && this.tableSettings.level === 0) {
            this.set('full', true);
        }

        if (this.tableSettings.maxHeight) {
            this.$().css('max-height', this.tableSettings.maxHeight);
        }

    }



}
