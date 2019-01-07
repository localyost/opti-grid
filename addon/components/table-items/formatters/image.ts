import TD from '../td';
import { layout, classNames } from '@ember-decorators/component';
import hbs from 'htmlbars-inline-precompile';
@layout(hbs`<img src="{{get record column.name}}" />`)
@classNames('opti-grid-center-align')
export default class ImageFormatter extends TD {

    setTitle(){
        return '';
    }

};
