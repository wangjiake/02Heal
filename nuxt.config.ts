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
    },
    // 开发服务器配置
    devServer: {
        port: 7812, // 服务器端口
        host: "0.0.0.0", // This allows access from any IP
    },
    // 确保静态资源有正确的缓存头
    nitro: {
        esbuild: {
            options: {
                define: {
                    "process.env.BUILD_TIME": JSON.stringify(
                        new Date().toISOString()
                    ),
                },
            },
        },
    },
    // 配置文件生成策略
    vite: {
        build: {
            rollupOptions: {
                output: {
                    // 为文件名添加时间戳，但不改变目录结构
                    entryFileNames: `entry.[hash].${Date.now()}.js`,
                    chunkFileNames: `chunk.[hash].${Date.now()}.js`,
                    assetFileNames: (info) => {
                        const timestamp = Date.now();
                        // 安全地检查文件名
                        const fileName = info?.name || "";
                        if (fileName.endsWith(".css")) {
                            return `styles.[hash].${timestamp}.css`;
                        }
                        return `assets/[name].[hash].${timestamp}.[ext]`;
                    },
                },
            },
        },
    },
});
