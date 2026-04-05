import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/quick-start',
        'getting-started/soundscript-vs-typescript',
        'getting-started/adopt-in-existing-typescript-apps',
        'getting-started/adoption-faq',
      ],
    },
    {
      type: 'category',
      label: 'Adoption Guides',
      items: [
        'guides/interop-boundaries',
        'guides/errors-and-failures',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/soundness-model',
        'concepts/runtime-and-builtins',
      ],
    },
    {
      type: 'category',
      label: 'How-to Guides',
      items: [
        'guides/tooling-and-js-target',
        'guides/ci-and-editor-setup',
        'guides/publishing-packages',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/cli',
        'reference/builtin-modules',
        'reference/macros',
        'reference/machine-numerics',
        'reference/newtypes-and-value-classes',
        'reference/variance-contracts',
        'reference/annotation-spec',
        'reference/diagnostics',
        'reference/banned-and-restricted',
      ],
    },
    {
      type: 'category',
      label: 'Release Notes / Versions',
      items: [
        'release-notes/versions-and-release-notes',
        'release-notes/v1-launch-notes',
      ],
    },
  ],
};

export default sidebars;
