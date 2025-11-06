module.exports = {
  rules: {
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          //  cross-feature imports are forbidden
          {
            target: "./src/features/people",
            from: "./src/features",
            except: ["./people"],
          },
          {
            target: "./src/features/person-graph",
            from: "./src/features",
            except: ["./person-graph"],
          },

          { target: "./src/features", from: "./src/app" },

          // shared: app/features
          {
            target: [
              "./src/components",
              "./src/hooks",
              "./src/lib",
              "./src/types",
              "./src/utils",
            ],
            from: ["./src/features", "./src/app"],
          },
        ],
      },
    ],
  },
};
