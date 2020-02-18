import GeneratorInterface from "../GeneratorInterface";

/**
 * Validates generator data
 *
 * @param object generator Generator to validate
 */
export default function validateGenerator(generator: GeneratorInterface): void {
  if (!generator.checkIfAllInputOptionsDefined()) {
    throw new TypeError(
      'Not all required arguments defined for selected engine'
    )
  }
}