declare module "next/dist/server/config-shared" {
  interface ExperimentalConfig {
    turbo?: {
      rules?: {
        [glob: string]: {
          as?: "asset" | "raw" | "empty";
          loaders?: string[];
        };
      };
    };
  }
}
