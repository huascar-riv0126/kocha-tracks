import type { StringsLoader } from '../strings-token';

const STRINGS_URL = '/strings/es.json';

export const clientStringsLoader: StringsLoader = () =>
  fetch(STRINGS_URL).then((response) => response.json());
