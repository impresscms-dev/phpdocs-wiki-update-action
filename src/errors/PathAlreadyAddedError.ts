export default class extends Error {

  constructor(path: string) {
    super(
      path.concat(" path is already added")
    );
  }

}