// https://nuxt.com/docs/api/configuration/nuxt-config
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
        // 添加构建配置，包含时间戳
        buildAssetsDir: `_nuxt_${Date.now()}/`,
    },
    // 开发服务器配置
    devServer: {
        port: 7812, // 服务器端口
        host: "0.0.0.0", // This allows access from any IP
    },
    // 添加 vite 配置，确保构建时使用时间戳
    vite: {
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: `[name].[hash]-${Date.now()}.js`,
                    chunkFileNames: `[name].[hash]-${Date.now()}.js`,
                    assetFileNames: `[name].[hash]-${Date.now()}.[ext]`,
                },
            },
        },
    },
});
