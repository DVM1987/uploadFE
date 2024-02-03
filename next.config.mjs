import withTM from 'next-transpile-modules';

/** @type {import('next').NextConfig} */
const nextConfig = withTM(['rc-util', '@ant-design/icons', 'rc-pagination', 'rc-picker'])({
  reactStrictMode: true,
  images: {
    disableStaticImages: true
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.(jpg|jpeg|png|svg)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 8192,
          publicPath: '/_next/static/images/',
          outputPath: 'static/images/',
          name: '[name].[ext]',
          esModule: config.esModule || false,
        },
      },
    });

    return config;
  },
});

export default nextConfig;