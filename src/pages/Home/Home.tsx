import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInfiniteQuery from 'common/hooks/useInfiniteQuery';
import { ThemeToggle, ProductCard } from 'components/custom';
import { HealthService } from 'core/service/health.service';

import './Home.scss';

const Home = () => {
  const { t } = useTranslation(['common']);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [healthStatus, setHealthStatus] = useState<string>('Loading...');

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  useEffect(() => {
    const checkHealth = async () => {
      const result = await HealthService.getHealth();
      if (result.hasErrors) {
        setHealthStatus('Backend is NOT reachable');
      } else {
        setHealthStatus(`Backend: ${result.data?.status}`);
      }
    };
    checkHealth();
  }, []);

  const { data } = useInfiniteQuery(scrollContainerRef, {
      sortBy: 'creationAt',
      sortDirection: 'desc',
    });

  return (
    <div className="twk-home">
      <div className="twk-home__main" ref={scrollContainerRef}>
        <h1>{t('welcome')}</h1>
        <p style={{ padding: '8px 16px', borderRadius: '4px', backgroundColor: healthStatus.includes('OK') ? '#d4edda' : '#f8d7da' }}>
          {healthStatus}
        </p>
        <h1>Whereas a common understanding of these rights and freedoms is</h1>
        <ThemeToggle
          isDark={mode === 'dark'}
          setIsDark={(v) => setMode(v ? 'dark' : 'light')}
        />
        <div className="twk-home__card">
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        {data &&
          data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        <p className="twk-home__read-the-docs">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  );
};

export default Home;
