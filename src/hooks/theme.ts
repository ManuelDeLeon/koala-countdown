import { useEffect, useState } from "react";
import { extractTheme } from "../misc/theme/theme";
import { Theme } from "../models/Theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>();

  useEffect(() => {
    fetch(
      "https://api.koala.io/marketing/v1/device-configurations/alias/web-config",
      {
        method: "GET",
        headers: {
          "X-Organization-Id": "1",
        },
      }
    )
      .then((res) => res.json())
      .then(
        (result) => setTheme(extractTheme(result)),
        (error) => {
          console.log(error);
          setTheme({ global: <any>{} });
        }
      );
  }, []);

  return theme;
}
