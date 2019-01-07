// @ts-ignore: Ignore import of compiled template
import template from '../../../templates/components/table-items/filters/date';
import { layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import { action } from '@ember-decorators/object';
import {set} from "@ember/object";
import {isPresent} from "@ember/utils";
import BasicFilter from './basic-filter';
@layout(template)
export default class DateFilter extends BasicFilter {


    didInsertElement(){
        this.initiateDatePicker();
        this._super(...arguments);
    }

    @computed('column.searchValue')
    get iconToggle(){
        return isPresent(this.column.searchValue) && this.column.searchValue > 0;
    }

    @action
    clearSearch(){
        // @ts-ignore
        this.$().find('input').datepicker('setDate', null);
        set(this.column, 'searchValue', 0)
    }


    initiateDatePicker() {
        let column = this.column;
        let dateFormat = 'DD.MM';
        dateFormat = dateFormat.toLowerCase();

        // @ts-ignore
        let $dateSelect = this.$().find('input').datepicker({
            dateFormat,
            onSelect(_value: string, inst: { input: JQuery }){
                // @ts-ignore
                let selectDate = inst.input.datepicker('getDate') as Date;
                if (selectDate) {
                    set(column, 'searchValue', selectDate.valueOf());
                } else {
                    set(column, 'searchValue', 0);
                }
            }
        });

        let searchValue = this.column.searchValue;
        if (searchValue) {
            $dateSelect.datepicker( 'setDate', new Date(searchValue) )
        }
    }

};
