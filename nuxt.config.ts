// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    modules: [
        "@nuxtjs/tailwindcss",
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
        port: 7812, // 服务器端口
        host: "0.0.0.0", // This allows access from any IP
    },
    nitro: {
        preset: "cloudflare-pages",
    },
});
