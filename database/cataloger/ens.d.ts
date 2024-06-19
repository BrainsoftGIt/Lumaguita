import tns from "./tns";

namespace ens {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}
}

export default ens;
