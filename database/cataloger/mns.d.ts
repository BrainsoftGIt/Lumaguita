import tns from "./tns";

namespace mns {
  export type TypeProperties = "*";

  export interface TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> {}
}

export default mns;
