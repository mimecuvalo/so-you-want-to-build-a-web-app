/* eslint-disable */
const CircularDependencyPlugin = require('circular-dependency-plugin');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },

  experimental: {
    useDeploymentId: true, // skew protection
    scrollRestoration: true,
  },

  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },

  webpack: (config, { dev, buildId, ...other }) => {
    config.plugins.push(
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // include specific files based on a RegExp
        //include: /client|server|shared/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
      })
    );

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.BUILD_ID': JSON.stringify(buildId),
        'process.env.NEXT_PUBLIC_VERCEL_GITHUB_COMMIT_SHA': process.env.VERCEL_GITHUB_COMMIT_SHA,
      })
    );

    if (!dev) {
      // TODO(mime): try to re-enable this but with SWC it was breaking, was only working with Babel.
      // https://formatjs.io/docs/guides/advanced-usage#react-intl-without-parser-40-smaller
      // config.resolve.alias['@formatjs/icu-messageformat-parser'] = '@formatjs/icu-messageformat-parser/no-parser';
    }

    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
