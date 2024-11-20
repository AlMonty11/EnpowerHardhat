// ethereum-address.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ethers } from 'ethers';
import web3 from 'web3';

export function ethereumAddressValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Si el valor está vacío, consideramos que es válido.
    if (!value) {
      return null;
    }

    // Aquí aplica la lógica de validación de la dirección de Ethereum si no está vacía.
    const isValidEthereumAddress = web3.utils.isAddress(control.value);;
    return isValidEthereumAddress ? null : { invalidEthereumAddress: true };
  };
}
