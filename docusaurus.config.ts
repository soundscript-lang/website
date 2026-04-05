import type {PrismTheme} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const algoliaAppId = process.env.DOCSEARCH_APP_ID;
const algoliaApiKey = process.env.DOCSEARCH_API_KEY;
const algoliaIndexName = process.env.DOCSEARCH_INDEX_NAME;

const accessibleLightTheme: PrismTheme = {
  plain: {
    color: '#0f172a',
    backgroundColor: '#f8fafc',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#475569',
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'builtin', 'changed'],
      style: {
        color: '#7c2d12',
      },
    },
    {
      types: ['string', 'char', 'attr-value', 'inserted'],
      style: {
        color: '#166534',
      },
    },
    {
      types: ['function', 'class-name', 'operator', 'entity', 'url'],
      style: {
        color: '#1d4ed8',
      },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: {
        color: '#9a3412',
      },
    },
    {
      types: ['attr-name', 'regex', 'important', 'variable'],
      style: {
        color: '#6d28d9',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#334155',
      },
    },
  ],
};

const accessibleDarkTheme: PrismTheme = {
  plain: {
    color: '#f8fafc',
    backgroundColor: '#1a1e27',
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: {
        color: '#d4def7',
        fontStyle: 'italic',
      },
    },
    {
      types: ['keyword', 'builtin', 'changed'],
      style: {
        color: '#f9a8d4',
      },
    },
    {
      types: ['string', 'char', 'attr-value', 'inserted'],
      style: {
        color: '#bef264',
      },
    },
    {
      types: ['function', 'class-name', 'operator', 'entity', 'url'],
      style: {
        color: '#93c5fd',
      },
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol'],
      style: {
        color: '#fca5a5',
      },
    },
    {
      types: ['attr-name', 'regex', 'important', 'variable'],
      style: {
        color: '#fcd34d',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: '#e5e7eb',
      },
    },
  ],
};

const config: Config = {
  title: 'soundscript',
  tagline: 'Soundness for regular TypeScript apps.',
  favicon: 'img/favicon.svg',
  future: {
    v4: true,
  },
  url: 'https://soundscript.dev',
  baseUrl: '/',
  organizationName: 'soundscript-lang',
  projectName: 'website',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  scripts: ['/canonical-host-redirect.js'],
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
          lastVersion: 'current',
          editUrl:
            'https://github.com/soundscript-lang/website/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    ...(algoliaAppId && algoliaApiKey && algoliaIndexName
      ? {
          algolia: {
            appId: algoliaAppId,
            apiKey: algoliaApiKey,
            indexName: algoliaIndexName,
            contextualSearch: true,
          },
        }
      : {}),
    navbar: {
      logo: {
        alt: 'soundscript',
        src: 'img/logo-light.svg',
      },
      items: [
        {to: '/docs/', label: 'Docs', position: 'right', activeBaseRegex: '^/docs/'},
        {to: '/', label: 'Home', position: 'right'},
        {
          href: 'https://github.com/soundscript-lang/soundscript',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/',
            },
            {
              label: 'Quick Start',
              to: '/docs/getting-started/quick-start',
            },
          ],
        },
        {
          title: 'Project',
          items: [
            {
              label: 'Repository',
              href: 'https://github.com/soundscript-lang/soundscript',
            },
            {
              label: 'Website Source',
              href: 'https://github.com/soundscript-lang/website',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Annotation Spec',
              to: '/docs/reference/annotation-spec',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/soundscript-lang/soundscript',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} soundscript.`,
    },
    prism: {
      theme: accessibleLightTheme,
      darkTheme: accessibleDarkTheme,
    },
    metadata: [
      {
        name: 'keywords',
        content:
          'soundscript, typescript, sound type system, type safety, programming language, macros, nominal types, value classes',
      },
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
