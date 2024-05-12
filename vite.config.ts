import { defineConfig } from 'vite'
import type { WatcherOptions } from 'rollup'
import solidPlugin from 'vite-plugin-solid'

import tsconfigPaths from 'vite-tsconfig-paths'

let target = 'https://dreampay.org'
let root = 'app'
if (process.env.local_api_target) {
    target = 'http://127.0.0.1:7200'
}

if (process.env.root == 'admin') root = 'admin'

console.log(`api target: ${target}\nroot: ${root}`)

export default defineConfig(env => {
    let watch: WatcherOptions | null = null
    if (env.mode == 'development') {
        watch = {
            clearScreen: true,
        }
    }

    return {
        plugins: [tsconfigPaths(), solidPlugin({ hot: false })],
        server: {
            port: 8200,
            proxy: {
                '/api/': {
                    target,
                    changeOrigin: true,
                },
                '/record/': target,
            },
        },
        root,
        build: {
            target: 'esnext',
            outDir: 'dist',
            watch,
            assetsInlineLimit: 0,
            copyPublicDir: false,
            assetsDir: root + '-assets',
        },
    }
})
