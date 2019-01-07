import Helper from '@ember/component/helper';

export default class NumberFormatterHelper extends Helper{

    compute(params: number[] | string[]){

        // @ts-ignore
        let value = params[0];

        if (typeof value === 'string') {
            value = value.replace(/[^0-9]/, '');
            value = parseInt(value);
        }

        if (isNaN(value)) {
            return '';
        }
        return formatNumber(value);
    }

}

export function formatNumber(x: number){
    return x.toLocaleString(navigator.language);
}
