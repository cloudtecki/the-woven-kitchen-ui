type ContentProps = {
  children: React.ReactNode;
};
const Content = ({ children }: ContentProps) => {
  return <div className="twk-app-content">{children}</div>;
};
export default Content;
