declare module 'recursive-readdir-sync' {
  function fn(cwd: string): string[]

  export = fn
}
