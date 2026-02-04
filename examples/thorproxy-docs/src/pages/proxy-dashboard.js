import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './proxy-dashboard.module.css';

// Mock proxy data generator
const generateProxyData = () => {
  const countries = [
    { code: 'ID', name: 'Indonesia', cities: ['Jakarta', 'Surabaya', 'Bandung', 'Medan'], 
      states: ['DKI Jakarta', 'Jawa Timur', 'Jawa Barat', 'Sumatera Utara'],
      isps: ['Telkomsel', 'Indihome', 'XL Axiata', 'Biznet', 'First Media'] },
    { code: 'US', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Houston'],
      states: ['New York', 'California', 'Illinois', 'Texas'],
      isps: ['Comcast', 'Verizon', 'AT&T', 'Charter'] },
    { code: 'UK', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Leeds'],
      states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
      isps: ['BT', 'Virgin Media', 'Sky Broadband', 'TalkTalk'] },
    { code: 'DE', name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'],
      states: ['Berlin', 'Bavaria', 'Hamburg', 'Hesse'],
      isps: ['Deutsche Telekom', 'Vodafone', 'O2', '1&1'] },
    { code: 'JP', name: 'Japan', cities: ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama'],
      states: ['Tokyo', 'Osaka', 'Kyoto', 'Kanagawa'],
      isps: ['NTT', 'KDDI', 'SoftBank', 'Rakuten'] },
  ];

  const statuses = ['Active', 'Active', 'Active', 'Checking', 'Inactive'];
  const protocols = ['HTTP', 'HTTPS', 'SOCKS5'];
  
  const proxies = [];
  for (let i = 0; i < 50; i++) {
    const country = countries[Math.floor(Math.random() * countries.length)];
    const cityIndex = Math.floor(Math.random() * country.cities.length);
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    const port = [80, 443, 8080, 22225, 1080][Math.floor(Math.random() * 5)];
    
    proxies.push({
      id: i + 1,
      ip: ip,
      port: port,
      fullAddress: `${ip}:${port}`,
      country: country.name,
      countryCode: country.code,
      city: country.cities[cityIndex],
      state: country.states[cityIndex],
      isp: country.isps[Math.floor(Math.random() * country.isps.length)],
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      responseTime: Math.floor(Math.random() * 3000) + 500,
      lastChecked: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      uptime: (95 + Math.random() * 5).toFixed(2),
    });
  }
  
  return proxies;
};

export default function ProxyDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [proxies, setProxies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    // Check if user is logged in
    const auth = localStorage.getItem('thorproxy_auth');
    const user = localStorage.getItem('thorproxy_user');
    
    if (auth === 'true' && user) {
      setIsLoggedIn(true);
      setUsername(user);
      
      // Simulate proxy checking process
      setTimeout(() => {
        const proxyData = generateProxyData();
        setProxies(proxyData);
        setLoading(false);
      }, 1500);
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('thorproxy_auth');
    localStorage.removeItem('thorproxy_user');
    window.location.href = '/login';
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const proxyData = generateProxyData();
      setProxies(proxyData);
      setLoading(false);
    }, 1500);
  };

  const filteredProxies = proxies.filter(proxy => {
    const matchesSearch = filter === '' || 
      proxy.ip.includes(filter) ||
      proxy.country.toLowerCase().includes(filter.toLowerCase()) ||
      proxy.city.toLowerCase().includes(filter.toLowerCase()) ||
      proxy.isp.toLowerCase().includes(filter.toLowerCase());
    
    const matchesCountry = countryFilter === 'All' || proxy.country === countryFilter;
    const matchesStatus = statusFilter === 'All' || proxy.status === statusFilter;
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const countries = ['All', ...new Set(proxies.map(p => p.country))];
  const statuses = ['All', 'Active', 'Checking', 'Inactive'];

  const stats = {
    total: proxies.length,
    active: proxies.filter(p => p.status === 'Active').length,
    checking: proxies.filter(p => p.status === 'Checking').length,
    inactive: proxies.filter(p => p.status === 'Inactive').length,
  };

  if (!isLoggedIn) {
    return null; // Will redirect
  }

  return (
    <Layout
      title="Proxy Dashboard"
      description="ThorProxy Dashboard - View and manage your residential proxies">
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <div>
            <h1>Proxy Dashboard</h1>
            <p>Welcome back, <strong>{username}</strong></p>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.total}</div>
            <div className={styles.statLabel}>Total Proxies</div>
          </div>
          <div className={`${styles.statCard} ${styles.statActive}`}>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
          <div className={`${styles.statCard} ${styles.statChecking}`}>
            <div className={styles.statValue}>{stats.checking}</div>
            <div className={styles.statLabel}>Checking</div>
          </div>
          <div className={`${styles.statCard} ${styles.statInactive}`}>
            <div className={styles.statValue}>{stats.inactive}</div>
            <div className={styles.statLabel}>Inactive</div>
          </div>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search by IP, Country, City, or ISP..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filters}>
            <select 
              value={countryFilter} 
              onChange={(e) => setCountryFilter(e.target.value)}
              className={styles.filterSelect}
            >
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <button onClick={handleRefresh} className={styles.refreshButton}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Checking all proxy details...</p>
          </div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.proxyTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>IP Address</th>
                  <th>Port</th>
                  <th>Full Address</th>
                  <th>Country</th>
                  <th>State</th>
                  <th>City</th>
                  <th>ISP</th>
                  <th>Protocol</th>
                  <th>Status</th>
                  <th>Response Time</th>
                  <th>Uptime %</th>
                  <th>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {filteredProxies.map(proxy => (
                  <tr key={proxy.id}>
                    <td>{proxy.id}</td>
                    <td className={styles.ipCell}>{proxy.ip}</td>
                    <td>{proxy.port}</td>
                    <td className={styles.fullAddressCell}>{proxy.fullAddress}</td>
                    <td>
                      <span className={styles.countryBadge}>
                        {proxy.countryCode} - {proxy.country}
                      </span>
                    </td>
                    <td>{proxy.state}</td>
                    <td>{proxy.city}</td>
                    <td className={styles.ispCell}>{proxy.isp}</td>
                    <td>
                      <span className={styles.protocolBadge}>{proxy.protocol}</span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles['status' + proxy.status]}`}>
                        {proxy.status}
                      </span>
                    </td>
                    <td>{proxy.responseTime}ms</td>
                    <td>{proxy.uptime}%</td>
                    <td className={styles.dateCell}>
                      {new Date(proxy.lastChecked).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProxies.length === 0 && (
              <div className={styles.noResults}>
                No proxies found matching your filters.
              </div>
            )}
          </div>
        )}

        <div className={styles.footer}>
          <p>Showing {filteredProxies.length} of {proxies.length} proxies</p>
        </div>
      </div>
    </Layout>
  );
}
