import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/row-grouping';
import { layout, classNames, tagName } from '@ember-decorators/component';
import ArrayProxy from "@ember/array/proxy";
import Column from "opti-grid/objects/Column";

import {IOnRowSortSelect} from "opti-grid/components/table-top-menu";
const FIRST_ELEMENT = '_BLANK';
@layout(template)
@tagName('select')
// @classNames('ui multiple selection dropdown')
@classNames('opti-grid-row-group-select')
export default class RowGrouping extends Component {

    columns!: ArrayProxy<Column>;
    onRowSortSelect!: IOnRowSortSelect;

    firstElement = FIRST_ELEMENT;

    didInsertElement(){
        this._super(...arguments);
        let self = this;
        // @ts-ignore
        this.$().dropdown({
            clearable: true,
            onChange(value: string) {
                let selectedColumn = self.columns.findBy('name', value) as Column;
                self.onRowSortSelect(selectedColumn);
            }
        });


    }
}
