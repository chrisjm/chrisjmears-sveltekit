import type { PageLoad } from "./$types";
import * as resume from "../../data/resume.json";

export const load: PageLoad = () => {
  return {
    resume,
  };
};
