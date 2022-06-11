export default class extends Error {

  constructor(path: string) {
    super(
      path.concat(" is not yet added")
    );
  }

}