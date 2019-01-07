import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../../templates/components/table-items/expand';
import { tagName, layout, classNames } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import Row from "opti-grid/objects/Row";
import {IOnRowExpand} from "opti-grid/components/opti-grid";
import {removeRow} from "opti-grid/utils/grid-state-storage";
import ITableSettings from "opti-grid/objects/interfaces/ITableSettings";
import {get} from "@ember/object";
@tagName('td')
@layout(template)
@classNames('opti-grid-center-align expand-row')
export default class ExpandTD extends Component {

    row!: Row;
    onRowExpand!: IOnRowExpand;
    tableSettings!: ITableSettings;

    @action
    onCollapse(){
        this.row.set('isExpanded', false);
        let storageName = get(this, 'tableSettings.localStorageName' as any);
        if (storageName) {
            removeRow(parseInt(this.row.record.id), this.tableSettings.localStorageName);
        }
    }

    @action
    onExpand(){
        this.row.set('isExpanded', true);
        this.onRowExpand(this.row);
    }
};
