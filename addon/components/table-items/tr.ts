import Component from '@ember/component';
import { tagName, layout, attribute, className, classNames } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import hbs from 'htmlbars-inline-precompile';
import Row from "opti-grid/objects/Row";
import $ from 'jquery';
import DS from 'ember-data';
import {IDidSelectRow} from "opti-grid/components/table-items/grid";
import { camelize } from '@ember/string';
import {IExposedOnRowRendered} from "opti-grid/components/opti-grid";
import IDnDComponent from "opti-grid/objects/interfaces/IDnDComponent";
@tagName('tr')
@layout(hbs`{{yield}}`)
@classNames('opti-grid data-row')
export default class TR extends Component implements IDnDComponent {

    index!: number;
    row!: Row;
    onRowSelected!: IDidSelectRow;
    onRowRendered!: IExposedOnRowRendered;

    @attribute('data-ot-type') otType!: string;
    @attribute('data-ot-id') otId!: string;
    @attribute('scope') scope = 'row';

    @className('opti-grid-selected')
    @computed('row.isSelected')
    get isSelected(){
        return this.row.isSelected;
    }

    willRender(){
        if (this.row.record) {

            if (this.row.record instanceof DS.Model) {
                // @ts-ignore
                this.set('otType', camelize(this.row.record.constructor.modelName));
            } else {
                this.set('otType', camelize(this.row.record.type));
            }

            this.set('otId', this.row.record.id);
            this.row.set('$element', this.$());
        }
        this._super(...arguments);
    }

    didRender(){
        if (this.row.record && this.row.$element && this.onRowRendered) {
            if (this.$().attr('opti-row-rendered') !== 'true') {
                this.$().attr('opti-row-rendered', 'true');
                this.onRowRendered(this.row);
            }
        }
        this._super(...arguments);
    }

    click(event: any){
       if (this.row.record && !isExpandSelect(event)) {
           this.onRowSelected(this.row, event.originalEvent, false);
       }
    }

    contextMenu(event: any){
        if (this.row.record && !isExpandSelect(event)) {
            event.originalEvent.preventDefault();
            this.onRowSelected(this.row, event.originalEvent, true);
        }
    }

    dragEnter(event: DragEvent): void {
        event.preventDefault();
        this.$().addClass('data-row-dragOver');
    }

    dragLeave(event: DragEvent): void {
        event.preventDefault();
        this.$().removeClass('data-row-dragOver');
    }

    dragOver(event: DragEvent): void {
        event.preventDefault();
    }

    drop(event: DragEvent): void {
        event.preventDefault();
        this.$().removeClass('data-row-dragOver');
    }

};

function isExpandSelect(event: any){
    if (event.originalEvent) {
        return $(event.originalEvent.target).hasClass('expand-row');
    }
    return false;

}
