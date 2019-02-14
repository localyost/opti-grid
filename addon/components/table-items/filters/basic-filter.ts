// @ts-ignore: Ignore import of compiled template
import template from '../../../templates/components/table-items/filters/basic-filter';
import {layout, className} from '@ember-decorators/component';
import {action, computed, observes} from '@ember-decorators/object';
import TH from '../th';
import {isPresent} from "@ember/utils";
import {set} from "@ember/object";
import {IOnColumnSearch} from "opti-grid/components/table-items/grid";

@layout(template)
export default class BasicFilter extends TH {

    onColumnSearch!: IOnColumnSearch;

    @className
    @computed
    get nameClass() {
        return `opti-grid-column-filter-${this.column.className}`;
    }

    @observes('column.searchValue')
    onSearchValueChange(){
        if (this.onColumnSearch) {
            this.onColumnSearch(this.column);
        }
    }

    @computed('columns.settings.searchOperator')
    get operandDisplay(){
        return this.column.settings.searchOperator;
    }

    @computed('column.searchValue')
    get iconToggle(){
        return isPresent(this.column.searchValue);
    }

    @action
    clearSearch(){
        set(this.column, 'searchValue', '')
    }


}
