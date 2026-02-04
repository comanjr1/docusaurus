import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/login">
            🚀 Login to Dashboard
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/docs/intro">
            📚 Read Documentation
          </Link>
        </div>
      </div>
    </header>
  );
}

function Feature({icon, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Home`}
      description="LunaProxy - Residential Proxy Network for Web Scraping, Market Research & More">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <Feature
                icon="🌍"
                title="Global Coverage"
                description="Access residential IPs from 195+ countries including Indonesia (Telkomsel, Indihome, XL), US (Comcast), UK (BT), Germany (Deutsche Telekom), and more."
              />
              <Feature
                icon="🔄"
                title="Flexible Rotation"
                description="Per-request rotation, timer-based rotation, or sticky sessions. Choose the perfect rotation strategy for your use case."
              />
              <Feature
                icon="📊"
                title="Real-time Dashboard"
                description="Monitor all your proxies with detailed information: IP, Country, City, State, ISP, Protocol, Status, and Response Time in real-time."
              />
            </div>
          </div>
        </section>

        <section className={styles.useCases}>
          <div className="container">
            <div className="text--center margin-bottom--lg">
              <Heading as="h2">Perfect for Multiple Use Cases</Heading>
            </div>
            <div className="row">
              <div className="col col--6">
                <div className={styles.useCaseCard}>
                  <h3>🔍 Web Scraping</h3>
                  <p>Extract data from websites without getting blocked. Bypass rate limits and bot detection with residential IPs.</p>
                </div>
              </div>
              <div className="col col--6">
                <div className={styles.useCaseCard}>
                  <h3>📈 Market Research</h3>
                  <p>Monitor competitor prices, verify ads, and check content localization across different regions.</p>
                </div>
              </div>
              <div className="col col--6">
                <div className={styles.useCaseCard}>
                  <h3>👟 Sneaker Copping</h3>
                  <p>Purchase limited edition items with multiple IPs. Beat bot protection and location verification.</p>
                </div>
              </div>
              <div className="col col--6">
                <div className={styles.useCaseCard}>
                  <h3>📱 Social Media Management</h3>
                  <p>Manage multiple accounts safely with consistent residential IPs. Avoid suspicious login flags.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaContent}>
              <Heading as="h2">Ready to Get Started?</Heading>
              <p>Login to access your proxy dashboard and view all available proxies with complete details.</p>
              <Link
                className="button button--primary button--lg"
                to="/login">
                Access Dashboard Now →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
