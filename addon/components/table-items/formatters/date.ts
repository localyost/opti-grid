import TD from '../td';
import { layout, classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import hbs from 'htmlbars-inline-precompile';
@layout(hbs`<span title="{{date-display column=column value=(get record key)}}">{{date-display column=column value=(get record key)}}</span>`)
@classNames('opti-grid-right-align')
export default class DateFormatter extends TD {

    @computed('column.options.formatterOptions', 'record.@each')
    get dateFormat(){
        let formatterOptions = this.column.settings.formatterOptions;
        return formatterOptions || 'DD.MM';
    }

};
