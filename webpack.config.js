import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const DIRNAME = dirname(fileURLToPath(import.meta.url))
const DIST_DIR = resolve(DIRNAME, 'build/dist')

export default {
    entry: './src/index.tsx',
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript',
                            '@babel/preset-react',
                        ]
                    }
                },
                exclude: /node-modules/,
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', '@tailwindcss/webpack'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@app': resolve(DIRNAME, 'src/app/'),
            '@context': resolve(DIRNAME, 'src/context/'),
            '@hooks': resolve(DIRNAME, 'src/hooks/'),
            '@api': resolve(DIRNAME, 'src/api/'),
            '@services': resolve(DIRNAME, 'src/services/'),
            '@components': resolve(DIRNAME, 'src/components/'),
            '@stores': resolve(DIRNAME, 'src/stores'),
            '@test': resolve(DIRNAME, 'test/'),
        },
    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: DIST_DIR,
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Garden Manager',
            template: 'assets/index.ejs',
        }),
        new MiniCssExtractPlugin(),
    ],
    devServer: {
        static: {
            directory: DIST_DIR,
        },
        compress: true,
        port: 8080,
        historyApiFallback: true,
        proxy: [
            {
                context: ['/api'],
                target: 'https://api.giga-ai-agent.test.cloud.ra-tech.pro',
                headers: {
                    host: 'giga-ai-agent.test.cloud.ra-tech.pro',
                },
                secure: false,
            },
        ],
    },
}