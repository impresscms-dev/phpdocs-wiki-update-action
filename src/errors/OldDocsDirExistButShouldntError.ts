export default class extends Error {

  constructor(dir: string) {
    super(
      dir.concat(" already exists but shouldn't")
    );
  }

}