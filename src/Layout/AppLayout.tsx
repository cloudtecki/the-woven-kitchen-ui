import './AppLayout.scss';

export type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="twk-app-layout">
      <main className="twk-app-layout__main">{children}</main>
    </div>
  );
};

export default AppLayout;
