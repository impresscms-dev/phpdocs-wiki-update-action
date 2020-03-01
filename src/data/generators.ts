/**
 * This defines list of generators by names that can be accessible from action configs
 */

import CleanPHPDocsMD from '../generators/clean-phpdoc-md'
import GeneratorInterface from '../GeneratorInterface'
import EvertPHPDocsMD from '../generators/evert-phpdoc-md'

const generators: {[key: string]: GeneratorInterface} = {
  'clean/phpdoc-md': new CleanPHPDocsMD(),
  'phpdoc-md': new CleanPHPDocsMD(),
  'evert/phpdoc-md': new EvertPHPDocsMD()
}
export default generators
