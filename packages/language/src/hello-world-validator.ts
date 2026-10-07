import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { HelloWorldAstType, Struct } from './generated/ast.js';
import type { HelloWorldServices } from './hello-world-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: HelloWorldServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.HelloWorldValidator;
    const checks: ValidationChecks<HelloWorldAstType> = {
        Struct: [
            validator.checkStructName,
            validator.checkStructPropertyNames,
        ]
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class HelloWorldValidator {

    checkStructName(struct: Struct, accept: ValidationAcceptor): void {
        if (struct.name === 'int') {
            accept(
                'error',
                'int is no valid name for structs.',
                { node: struct, property: 'name' }
            );
        }
    }

    checkStructPropertyNames(struct: Struct, accept: ValidationAcceptor): void {
        const names = new Set<string>();
        for (const property of struct.properties) {
            if (names.has(property.name)) {
                accept(
                    'error',
                    `'${property.name}' is no unique property name.`,
                    { node: property, property: 'name' }
                );
            } else {
                names.add(property.name);
            }
        }
    }

    // More possible validations:
    // - different names of structs and variables;
    //   or upper case names for structs and lower case names for variables
    // - expressions use only int variables, no struct variables;
    //   or VariableAccess needs to have a property, if it accesses a struct variable

}
