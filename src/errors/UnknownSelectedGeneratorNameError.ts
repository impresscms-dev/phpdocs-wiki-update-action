export default class extends Error {

  constructor() {
    super('Not all required arguments defined for selected engine');
  }

}