// https://nuxt.com/docs/api/configuration/nuxt-config
const timestamp = new Date().getTime()

export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: [
        [
            "@nuxtjs/tailwindcss",
            {
                cssPath: "~/assets/css/tailwind.css",
                configPath: "tailwind.config.js",
                exposeConfig: false,
                injectPosition: 0,
                viewer: true,
            },
        ],
    ],

    compatibilityDate: "2025-04-21",

    app: {
        head: {
            title: "减脂计算",
            link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content:
                        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
                },
            ],
        },
    },

    // 开发服务器配置
    devServer: {
        port: 7812,
        host: "0.0.0.0",
    },

    // 重点：vite 构建配置
    vite: {
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].${timestamp}.js`,
                    chunkFileNames: `assets/[name].${timestamp}.js`,
                    assetFileNames: (assetInfo) => {
                        if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                            return `assets/[name].${timestamp}[extname]`
                        }
                        return `assets/[name].[ext]`
                    },
                },
            },
        },
    },
})
