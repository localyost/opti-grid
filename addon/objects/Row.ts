import EmberObject from '@ember/object';
import DS from "ember-data";
export default class Row extends EmberObject {

    isExpanded!: boolean;
    isExpandable!: boolean;
    selectable!: boolean;
    isSelected!: boolean;
    record!: DS.Model | any;
    $element!: JQuery;

    constructor(args?: {record: DS.Model}){
        super(...arguments);
        if (args) {
            this.record = args.record;
        }
    }



}
