import {BoardName} from '../../common/boards/BoardName';

type MAManifestSpec<V> = {
  /** Constructor that a new instance of this MA. */
  Factory: new () => V;
  /** When true, do not include in any new games when picking randomly. */
  deprecated?: true;
  random?: 'modular' | 'both';
}

export type MAManifest<K extends string, V> = {
  all: Record<K, MAManifestSpec<V>>,
  boards: Record<BoardName, ReadonlyArray<K>>,
  create(name: string): V | undefined;
  createOrThrow(name: string): V;
}
