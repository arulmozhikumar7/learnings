import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
 title: 'Arulmozhikumar | Technical Notes',
tagline: 'Learning to building systems that don’t fall apart at scale',

  future: {
    v4: true, 
  },

  url: 'https://docs.arulmozhikumar.dev', 
  baseUrl: '/',
  organizationName: 'arulmozhikumar7', 
  projectName: 'learnings', 

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
  [
    'classic',
    {
      docs: {
        sidebarPath: './sidebars.ts',
        editUrl: 'https://github.com/arulmozhikumar7/learnings/edit/main/',
      },
      blog: false,
      theme: {
        customCss: './src/css/custom.css',
      },
      sitemap: {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
    } satisfies Preset.Options,
  ],
],



  themeConfig: {
    metadata: [
    { name: 'google-site-verification', content: '-uh5C_JGuAYnUxSyL4uEG3ICS43XGV6GzJqZcoGhxX8' },
    { name: 'author', content: 'Arulmozhikumar' },
    { name: 'keywords', content: 'arulmozhikumar, software engineer, system design, AWS, cloud, scale, technical blog' },
    { name: 'description', content: 'Notes, system design, cloud concepts, and learning logs by Arulmozhikumar.' },
    { name: 'og:title', content: 'Arulmozhikumar | Tech Notes' },
    { name: 'og:description', content: 'Explore systems, cloud, architecture, and software learning from Arulmozhikumar.' },
    { name: 'og:url', content: 'https://docs.arulmozhikumar.dev' },
    { name: 'og:image', content: 'https://docs.arulmozhikumar.dev/preview.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Arulmozhikumar | Tech Notes' },
    { name: 'twitter:description', content: 'Explore systems, cloud, architecture, and software learning from Arulmozhikumar.' },
    { name: 'twitter:image', content: 'https://docs.arulmozhikumar.dev/preview.png' },

  ],
    image: 'img/logo.png',
    navbar: {
      title: 'Arulmozhikumar',
      logo: {
        alt: 'Arulmozhikumar Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/arulmozhikumar7',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Code, break, repeat. © ${new Date().getFullYear()} Arul`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
