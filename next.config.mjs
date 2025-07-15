/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

// @ts-check
await import("./src/env.mjs");
import config from "./next-i18next.config.mjs";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
	return config;
}

export default defineNextConfig({
	reactStrictMode: false,
	experimental: {
		instrumentationHook: true,
		serverComponentsExternalPackages: [
			"sequelize",
			"sequelize-typescript",
			"webpack",
			"typescript",
		],
	},
	/**
	 * If you are using `appDir` then you must comment the below `i18n` config out.
	 *
	 * @see https://github.com/vercel/next.js/issues/41980
	 */
	i18n: config.i18n,

	// ✅ 加入 Webpack loader 處理字型
	webpack(config) {
		config.module.rules.push({
			test: /\.(ttf|otf|woff2?|eot)$/,
			type: 'asset/resource',
			generator: {
				filename: 'static/fonts/[name][ext]',
			},
		});
		return config;
	},
});

