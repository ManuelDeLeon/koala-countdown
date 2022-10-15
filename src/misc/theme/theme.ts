import { Theme } from "../../models/Theme";

export function extractTheme(config: any): Theme {
  const data = config && config.data && config.data.data;
  return { global: data.global };
}
