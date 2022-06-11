export default class extends Error {

  constructor(prop: string, length: number) {
    super(`${prop} must have at least ${length} characters`)
  }

}