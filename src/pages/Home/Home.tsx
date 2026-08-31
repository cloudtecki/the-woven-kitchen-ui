import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useInfiniteQuery from 'common/hooks/useInfiniteQuery';
import { ThemeToggle, ProductCard } from 'components/custom';

import './Home.scss';

const Home = () => {
  const { t } = useTranslation(['common']);
  const [count, setCount] = useState(0);
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const { data } = useInfiniteQuery(scrollContainerRef, {
      sortBy: 'creationAt',
      sortDirection: 'desc',
    });

  return (
    <div className="twk-home">
      <div className="twk-home__main" ref={scrollContainerRef}>
        <h1>{t('welcome')}</h1>
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
