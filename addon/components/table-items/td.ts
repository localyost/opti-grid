import Component from '@ember/component';
import { tagName, layout, attribute, className } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import Column from "opti-grid/objects/Column";
import DS from 'ember-data';
import hbs from 'htmlbars-inline-precompile';
@tagName('td')
@layout(hbs`{{get record key}}`)
export default class TD extends Component {

    column!: Column;
    record!: DS.Model;
    @attribute() title = '';

    @className('opti-grid-right-align') alignRight = this.column.settings.alignRight || false;

    protected key = this.column.name;

    @computed('record')
    protected get value(){
        // @ts-ignore
        return this.record.get(this.key)
    }

    didRender(){
        this._super(...arguments);
        this.set('title', this.setTitle());
    }

    protected setTitle() : string | number | undefined{
        return this.value;
    }

};
