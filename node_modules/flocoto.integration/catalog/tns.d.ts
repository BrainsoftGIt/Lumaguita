import { db } from "kitres";
import cns from "./cns";
import rns from "./rns";
import fns from "./fns";
import dfns from "./dfns";
import mfns from "./mfns";
import tfns from "./tfns";
import def from "./def";
import mns from "./mns";
import ens from "./ens";
import tmns from "./tmns";
import emns from "./emns";

namespace tns {
  export type TypeOfMaps<T extends { [K in TypeProperties]?: T[K] }> =
    cns.TypeOfMaps<T> &
      def.TypeOfMaps<T> &
      dfns.TypeOfMaps<T> &
      emns.TypeOfMaps<T> &
      ens.TypeOfMaps<T> &
      fns.TypeOfMaps<T> &
      mfns.TypeOfMaps<T> &
      mns.TypeOfMaps<T> &
      tfns.TypeOfMaps<T> &
      tmns.TypeOfMaps<T> &
      rns.TypeOfMaps<T>;

  export type TypeProperties = cns.TypeProperties &
    def.TypeProperties &
    dfns.TypeProperties &
    emns.TypeProperties &
    ens.TypeProperties &
    fns.TypeProperties &
    mfns.TypeProperties &
    mns.TypeProperties &
    tfns.TypeProperties &
    tmns.TypeProperties &
    rns.TypeProperties;

  type SuffixOf<T, Prefix extends string> = {
    [K in keyof T as T[K] extends any
      ? K extends `${Prefix}${infer Rest}`
        ? Rest
        : never
      : never]: T[K];
  };

  type KeyofSuffixOf<T, Prefix extends string> = keyof SuffixOf<T, Prefix>;

  export type TypedPartialOf<
    R extends keyof tns.TypeOfMaps<T>,
    Prefix extends string,
    S extends KeyofSuffixOf<tns.TypedOf<R, T>, Prefix>,
    T extends { [K in tns.TypeProperties]?: T[K] },
  > = {
    [K in `${Prefix}${S}` & keyof tns.TypedOf<R, T>]: tns.TypedOf<R, T>[K];
  };
  export type PartialOf<
    R extends keyof tns.TypeOfMaps<any>,
    Prefix extends string,
    S extends KeyofSuffixOf<tns.TypedOf<R, any>, Prefix>,
  > = TypedPartialOf<R, Prefix, S, any>;
  export type UnionsOf<U> = (U extends any ? (k: U) => void : never) extends (
    k: infer I,
  ) => void
    ? I
    : never;
  export type TypeOf<R extends keyof TypeOfMaps<any>> =
    UnionsOf<TypeOfMaps<any>[R]> extends never
      ? TypeOfMaps<any>[R]
      : UnionsOf<TypeOfMaps<any>[R]>;
  export type TypedOf<
    R extends keyof TypeOfMaps<T>,
    T extends { [K in TypeProperties]?: T[K] },
  > =
    UnionsOf<TypeOfMaps<T>[R]> extends never
      ? TypeOfMaps<T>[R]
      : UnionsOf<TypeOfMaps<T>[R]>;
  export type InternalOf<R extends keyof InternalOfRef> = InternalOfRef[R];

  export interface InternalOfRef {}
}

export default tns;
