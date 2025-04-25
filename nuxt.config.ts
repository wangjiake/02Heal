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
		"@nuxtjs/i18n",
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
					content: "width=device-width, initial-scale=1",
				},
			],
			templateParams: {
				separator: "·",
			},
		},
		// 设置页面转场效果，减少布局偏移感知
		pageTransition: {
			name: 'page',
			mode: 'out-in'
		}
	},

	// i18n 配置
	i18n: {
		// 定义可用的语言环境
		locales: [
			{ code: "en", iso: "en", file: "en.json" },
			// 注释多语言会变成单语言打包，最好单语言是默认语言
			{ code: "zh_CN", iso: "zh_CN", file: "zh_CN.json" },
			{ code: "ja", iso: "ja", file: "ja.json" },
		],
		defaultLocale: "en", // 设置默认语言为英语
		lazy: true, // 懒加载语言文件
		langDir: "../locales/", // 存放语言文件的目录
		strategy: "prefix", // URL 策略
		detectBrowserLanguage: {
			useCookie: true, // 使用 cookie 来保存用户语言选择
			cookieKey: "lang", // cookie 的键名
			redirectOn: "root", // 在根目录下进行语言重定向
			alwaysRedirect: true, // 总是根据用户浏览器语言进行重定向
			fallbackLocale: "en", // 如果无法检测到语言，则回退到英语
		},
		baseUrl: "https://fatloss.cc", // 需要为SEO添加基础URL
		bundle: {
			optimizeTranslationDirective: false,
		},
	},

	// 开发服务器配置
	devServer: {
		port: 7812, // 服务器端口
		host: "0.0.0.0", // This allows access from any IP
	},

	// 性能优化配置
	nitro: {
		esbuild: {
			options: {
				target: 'esnext'
			}
		},
		minify: true,
		// 预加载常用路由，减少初次访问延迟
		prerender: {
			crawlLinks: true,
			routes: ['/']
		}
	},

	vite: {
		build: {
			// 移除注释和console代码
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: process.env.NODE_ENV === 'production',
					drop_debugger: process.env.NODE_ENV === 'production'
				}
			},
			// 分割代码块
			rollupOptions: {
				output: {
					manualChunks: {
						'vue': ['vue'],
						'vue-router': ['vue-router']
					}
				}
			}
		},
		optimizeDeps: {
			include: ['vue', 'vue-router']
		}
	},

	// 组件自动导入，按需加载
	components: {
		dirs: [
			'~/components',
			{
				path: '~/components/global',
				global: true
			}
		],
		directoryAsNamespace: true
	},

	// 实验性功能
	experimental: {
		// 使用Nuxt3的组件懒加载功能
		componentIslands: true,
		payloadExtraction: true,
		asyncEntry: true,
		reactivityTransform: true
	},

	// 分析构建包大小
	analyze: process.env.ANALYZE === 'true',

	// 按需导入策略
	imports: {
		autoImport: true,
		dirs: ['stores']
	}
});