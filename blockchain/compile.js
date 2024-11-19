const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// Definir las rutas de archivos
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);  // Eliminar la carpeta build si existe

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// Crear el objeto de entrada para la compilación
const input = {
    language: 'Solidity',
    sources: {
        'Campaign.sol': {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode']
            }
        }
    }
};

// Usar la nueva API de solc para compilar
const output = JSON.parse(solc.compile(JSON.stringify(input)));

// Crear la carpeta build
fs.ensureDirSync(buildPath);

// Ver el resultado de la compilación
console.log(output);

// Guardar los contratos compilados en archivos JSON
for (let contract in output.contracts['Campaign.sol']) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output.contracts['Campaign.sol'][contract]
    );
}
