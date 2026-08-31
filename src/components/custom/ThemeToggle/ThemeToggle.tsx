import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';

export default function ThemeToggle({
  isDark,
  setIsDark,
}: {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
}) {
  return (
    <Switch
      checked={isDark}
      onChange={setIsDark}
      checkedChildren={<MoonOutlined />}
      unCheckedChildren={<SunOutlined />}
    />
  );
}
