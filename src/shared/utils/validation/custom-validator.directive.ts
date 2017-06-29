import { FormControl } from '@angular/forms';


export class CustomValidator {
    static NegativeNumberValidator(control: FormControl) {
        var value: number = control.value.toString().replace(/[^0-9]/g, '');

        if (value < 0) {
            return {
                "Número inválido": true
            };
        }

        return null;
    }

    static OnlyNumberValidator(control: FormControl) {
        let regex = /^\d+$/;

        if (!regex.test(control.value)) {
            return { 'Este campo só aceita números': true };
        }

        return null;
    }

    static ZipCodeValidator(control: FormControl) {
        var value: String = control.value.toString().replace(/[^0-9]/g, '').slice(0, 8);        

        if (value.length != 8) {
            return {
                "CEP inválido": true
            };
        }

        return null;
    }

    static SelectValidator(control: FormControl) {
        var value: number = control.value.toString();        

        if (value == 0) {
            return {
                "Selecione uma opção.": true
            };
        }

        return null;
    }

    static EmailValidator(control: FormControl) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(control.value)) {
            return { "E-mail inválido": true };
        }

        return null;
    }

    static CreditCardValidator(control: FormControl) {
        // Visa, MasterCard, American Express, Diners Club, Discover, JCB
        let regex = /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

        if (!regex.test(control.value)) {
            return { 'Cartão de crédito inválido': true };
        }

        return null;
    }
}