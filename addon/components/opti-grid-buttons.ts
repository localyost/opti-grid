import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/opti-grid-buttons';
import { layout, classNames } from '@ember-decorators/component';
import $ from 'jquery';
import {ExportTypes} from "opti-grid/objects/ExportTypes";
@layout(template)
@classNames('ui mini icon buttons')
export default class OptiGridButtons extends Component {

    exportTypes = ExportTypes;

    didInsertElement(){
        this._super(...arguments);
        // @ts-ignore
        $(`#${this.elementId}-exportButtons`).dropdown();
    }

};
