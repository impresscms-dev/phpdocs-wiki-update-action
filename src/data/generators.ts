/**
 * This defines list of generators by names that can be accessible from action configs
 */

import PHPDocsMD from '../generators/phpdoc-md'
import GeneratorInterface from '../GeneratorInterface'

const generators: {[key: string]: GeneratorInterface} = {
  'phpdoc-md': new PHPDocsMD()
}
export default generators
