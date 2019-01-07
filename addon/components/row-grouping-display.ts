import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/row-grouping-display';
import { layout, classNames } from '@ember-decorators/component';
import ArrayProxy from "@ember/array/proxy";
import Column from "opti-grid/objects/Column";
import {IRemoveColumnFromSorting} from "opti-grid/components/table-top-menu";
@layout(template)
@classNames('opti-grid opti-grid-row-sorting-select-block')
export default class RowGroupingDisplay extends Component {

    rowGrouping!: ArrayProxy<Column>;
    /**
     * closure action
     */
    removeColumnFromSorting!: IRemoveColumnFromSorting;

};
