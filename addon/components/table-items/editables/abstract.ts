import TD from '../td';
import {scheduleOnce} from "@ember/runloop";
import { alias } from '@ember-decorators/object/computed';
export default abstract class AbstractEditable extends TD {

    isEditing = false;
    useEnter = true;
    $input!: JQuery;
    inputTagName = 'input';


    @alias('column.settings.editable') editable!: any;
    @alias('editable.options') editOptions!: any;


    click(){
        if (!this.isEditing) {
            this.set('isEditing', true);
            scheduleOnce('afterRender', this, ()=>{
                let $input = this.$().find(this.inputTagName);
                if ($input.length > 0) {
                    $input.get(0).focus();
                    this.set('$input', $input);
                }
            });
        }
    }

    keyPress(event: any){
        if (this.useEnter) {
            if (event.originalEvent.keyCode === 13) {
                this.stopEditing();
            }
        }
    }

    // triggers focusOut
    stopEditing(){
        this.setProperties({
            isEditing: false,
            $input: null
        })
    }

    protected onFinishEdit(){

    }

    focusOut(){
        this.stopEditing();
        this.onFinishEdit();
    }

    willDestroyElement() {
        this.stopEditing();
        this._super(...arguments);
    }
};
