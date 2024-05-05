import { defineConfig } from 'vite'
import type { WatcherOptions } from 'rollup'
import solidPlugin from 'vite-plugin-solid'
import { resolve } from 'path'

let target = 'https://dreampay.org'
if (process.env.local_api_target) {
    target = 'http://127.0.0.1:7200'
}

console.log('api target: ' + target)

export default defineConfig(env => {
    let watch: WatcherOptions | null = null
    if (env.mode == 'development') {
        watch = {
            clearScreen: true,
        }
    }

    return {
        plugins: [solidPlugin({ hot: false })],
        server: {
            https: false,
            port: 8200,
            proxy: {
                '/api/': {
                    target,
                    changeOrigin: true,
                },
            },
        },
        build: {
            target: 'esnext',
            outDir: 'dist',
            watch,
            assetsInlineLimit: 0,
            copyPublicDir: false,
        },
        resolve: {
            alias: { '!': resolve(__dirname, 'app') },
        },
    }
})
