/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack (dev)
  turbopack: {
    rules: {
      // import logoUrl from './logo.svg?url'
      "*.svg?url": { loaders: [], as: "*.asset" },
      // import Logo from './logo.svg'  -> React-компонент через SVGR
      "*.svg": { loaders: ["@svgr/webpack"], as: "*.js" },
    },
  },

  // Webpack (prod / или если dev без Turbopack)
  webpack(config) {
    // 1) .svg?url -> URL
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/i,
      resourceQuery: /url/,
      type: "asset/resource",
    });

    // 2) просто .svg -> SVGR (React component)
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/i,
      resourceQuery: { not: [/url/] },
      use: [
        {
          loader: require.resolve("@svgr/webpack"),
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: { overrides: { removeViewBox: false } },
                },
              ],
            },
            titleProp: true,
            ref: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
