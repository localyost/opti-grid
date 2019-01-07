import AbstractInput from './abstract';
// @ts-ignore: Ignore import of compiled template
import template from '../../../templates/components/table-items/editables/select';
import { layout } from '@ember-decorators/component';
import { action } from '@ember-decorators/object';
import { computed } from '@ember-decorators/object';
import { alias } from '@ember-decorators/object/computed';
// import DS from 'ember-data';
@layout(template)
export default class SelectEdit extends AbstractInput {

    inputTagName = 'select';
    @alias('editOptions.key') selectKey!: string; // the select key for records display in dropDown
    @alias('editOptions.records') selectRecords!: any;
    @alias('editable.callBack') callBack!: Function;
    useEnter = false;
    DEFAULT = 'DEFAULT';

    constructor(){
        super(...arguments);
        if (this.editOptions) {
            if (!this.editOptions.key) {
                this.set('selectKey', this.key); // use column key
            }
        }
    }

    @computed
    get recordsToSelect(){

        return this.selectRecords.rejectBy('id', this.record.id);
    }

    @action
    onSelectEntityType(value: any){
        if (value !== this.DEFAULT && this.editOptions && this.callBack) {
            this.callBack(value, this.record);
        }
        this.set('isEditing', false);
    }
};
