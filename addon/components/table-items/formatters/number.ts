import TD from '../td';
import hbs from 'htmlbars-inline-precompile';
import { layout, classNames } from '@ember-decorators/component';
@layout(hbs`<span title="{{number-formatter (get record key)}}">{{number-formatter (get record key)}}</span>`)
@classNames('opti-grid-right-align')
export default class NumberFormatter extends TD {

};
