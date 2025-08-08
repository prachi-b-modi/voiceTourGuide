declare module "react-joyride" {
  import * as React from "react";
  export type CallBackProps = any;
  export const STATUS: { FINISHED: string; SKIPPED: string };
  const Joyride: React.ComponentType<any>;
  export default Joyride;
} 