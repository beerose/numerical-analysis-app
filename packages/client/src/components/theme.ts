export namespace theme {
  // immutable part of the theme -- known on type level to improve DX

  export enum Padding {
    Standard = '40px',
    Half = '20px',
    Quarter = '10px',
  }

  // mutable part of the theme -- this will probably change at runtime
}
