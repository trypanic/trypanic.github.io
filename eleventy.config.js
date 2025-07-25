import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import pluginFilters from "./src/_config/filters.js";
import CleanCSS from 'clean-css';
import fs from 'fs';
import path from 'path';

const DIST_CSS_DIR = '_site/css';
const PUBLIC_CSS_DIR = 'public/css';
const CONTENT_DIR = 'src/content';
const BLOG_IMAGES_GLOB = `${CONTENT_DIR}/blog/**/*.{jpg,jpeg,png,gif,webp,avif,svg}`;
const WATCHED_CSS = `${PUBLIC_CSS_DIR}/**/*.css`;
const WATCHED_IMAGES = `${CONTENT_DIR}/**/*.{svg,webp,png,jpg,jpeg,gif}`;
const FEED_STYLESHEET = 'pretty-atom-feed.xsl';
const FEED_OUTPUT_PATH = '/feed/feed.xml';
const STYLES_TO_MINIFY = ['404.css'];

export default async function (eleventyConfig) {
	// Clean CSS output directory
	fs.rmSync(DIST_CSS_DIR, { recursive: true, force: true });
	fs.mkdirSync(DIST_CSS_DIR, { recursive: true });

	// Draft filter: skip drafts in build mode
	eleventyConfig.addPreprocessor("drafts", "*", (data, _) => {
		if (data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
			return false;
		}
	});

	// Passthroughs
	eleventyConfig.addPassthroughCopy(`${CONTENT_DIR}/feed/${FEED_STYLESHEET}`);
	eleventyConfig.addPassthroughCopy(BLOG_IMAGES_GLOB);

	// Watch targets
	eleventyConfig.addWatchTarget(WATCHED_CSS);
	eleventyConfig.addWatchTarget(WATCHED_IMAGES);

	// Plugins
	eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(HtmlBasePlugin);
	eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);
	eleventyConfig.addPlugin(pluginFilters);

	// ID Plugin
	eleventyConfig.addPlugin(IdAttributePlugin);

	// Feed Plugin
	eleventyConfig.addPlugin(feedPlugin, {
		type: "atom",
		outputPath: FEED_OUTPUT_PATH,
		stylesheet: FEED_STYLESHEET,
		templateData: {
			eleventyNavigation: {
				key: "Feed",
				order: 4,
			},
		},
		collection: {
			name: "posts",
			limit: 10,
		},
		metadata: {
			language: "en",
			title: "trypanic blog",
			subtitle:
				"A software engineering and computer science blog where I share my thoughts: the things I've tried and broken, the lessons I’ve learned out of curiosity to reinvent the wheel, understand things more deeply, or just for fun.",
			base: "https://trypanic.github.io",
			author: {
				name: "David Nuñez",
			},
		},
	});

	// Shortcodes
	eleventyConfig.addShortcode("currentBuildDate", () => {
		return new Date().toISOString();
	});

	// After build: minify CSS
	eleventyConfig.on("afterBuild", () => {
		STYLES_TO_MINIFY.forEach((filename) => {
			const inputPath = path.join(PUBLIC_CSS_DIR, filename);
			const outputPath = path.join(DIST_CSS_DIR, filename);

			const input = fs.readFileSync(inputPath, "utf8");
			const output = new CleanCSS().minify(input);

			fs.writeFileSync(outputPath, output.styles, "utf8");
		});
	});

	// script to minify css files to be included in HTML files
	eleventyConfig.addShortcode("includeMinifiedCSS", function (path) {
		const cssFile = `${PUBLIC_CSS_DIR}/${path}`;
		const rawCSS = fs.readFileSync(cssFile, "utf-8");
		const minified = new CleanCSS({}).minify(rawCSS);
		return minified.styles;
	});
}

export const config = {
	templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "src/content",
		includes: "../_includes",
		data: "../_data",
		layouts: "../_includes",
	},
};
