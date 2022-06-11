export default class extends Error {

  constructor(out: string) {
    super(`Execution failed`)

    this.stack = out
  }

}