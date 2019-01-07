import AbstractEditable from './abstract';
// @ts-ignore: Ignore import of compiled template
import template from '../../../templates/components/table-items/editables/number';
import { computed } from '@ember-decorators/object';
import { layout } from '@ember-decorators/component';

@layout(template)
export default class NumberEdit extends AbstractEditable {

    initialValue!: number;

    @computed
    get inputValue(){
        let value = this.record.get( this.column.name as any );
        if (typeof value === 'string') {
            value = value.replace(/[^0-9]/, '');
        }
        this.set('initialValue', value);
        return value;
    }
    set inputValue(value){
        // @ts-ignore
        return value;
    }

    onFinishEdit(){
        if (this.editOptions && this.editable.callBack) {
            if (this.initialValue !== this.inputValue) {
                this.editable.callBack(parseInt(this.inputValue), this.record);
            }
        }
    }

}
