// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'features',
    'architecture',
    {
      type: 'category',
      label: 'Use Cases',
      items: [
        'use-cases/web-scraping',
        'use-cases/market-research',
        'use-cases/sneaker-copping',
        'use-cases/social-media-management',
      ],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: [
        'configuration/getting-started',
        'configuration/rotation-modes',
        'configuration/geolocation',
        'configuration/authentication',
      ],
    },
    {
      type: 'category',
      label: 'Code Examples',
      items: [
        'examples/python',
        'examples/javascript',
        'examples/advanced',
      ],
    },
    'performance',
    'troubleshooting',
  ],
};

export default sidebars;
