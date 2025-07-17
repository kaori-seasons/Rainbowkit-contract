// 钱包连接器相关类型定义
export interface WalletConnector {
  /** 连接器唯一标识符 */
  id: string;
  /** 连接器名称 */
  name: string;
  /** 连接器图标 URL */
  iconUrl?: string;
  /** 连接器图标背景色 */
  iconBackground?: string;
  /** 连接器下载链接 */
  downloadUrl?: string;
  /** 连接器描述 */
  description?: string;
  /** 是否已安装 */
  installed?: boolean;
  /** 是否支持移动端 */
  mobile?: boolean;
  /** 是否支持桌面端 */
  desktop?: boolean;
  /** 是否支持浏览器扩展 */
  extension?: boolean;
  /** 连接方法 */
  connect: () => Promise<ConnectResult>;
  /** 断开连接方法 */
  disconnect: () => Promise<void>;
  /** 检查是否可用 */
  isAvailable: () => Promise<boolean>;
}

// 连接结果类型
export interface ConnectResult {
  /** 连接是否成功 */
  success: boolean;
  /** 错误信息 */
  error?: string;
  /** 账户地址 */
  account?: string;
  /** 链 ID */
  chainId?: number;
}

// 钱包配置类型
export interface WalletConfig {
  /** 项目 ID (用于 WalletConnect 等) */
  projectId?: string;
  /** 应用名称 */
  appName?: string;
  /** 应用描述 */
  appDescription?: string;
  /** 应用图标 URL */
  appIcon?: string;
  /** 应用 URL */
  appUrl?: string;
  /** 钱包列表 */
  wallets?: WalletConnector[];
  /** 默认链配置 */
  chains?: ChainConfig[];
  /** 主题配置 */
  theme?: ThemeConfig;
  /** 国际化配置 */
  i18n?: I18nConfig;
}

// 链配置类型
export interface ChainConfig {
  /** 链 ID */
  id: number;
  /** 链名称 */
  name: string;
  /** 链图标 URL */
  iconUrl?: string;
  /** RPC URL */
  rpcUrl: string;
  /** 区块浏览器 URL */
  blockExplorerUrl?: string;
  /** 原生代币符号 */
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// 主题配置类型
export interface ThemeConfig {
  /** 主题模式 */
  mode?: 'light' | 'dark' | 'auto';
  /** 主题颜色 */
  colors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
    text?: string;
    textSecondary?: string;
    border?: string;
    error?: string;
    success?: string;
    warning?: string;
  };
  /** 圆角大小 */
  borderRadius?: string;
  /** 字体大小 */
  fontSize?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

// 国际化配置类型
export interface I18nConfig {
  /** 默认语言 */
  defaultLocale?: string;
  /** 支持的语言列表 */
  locales?: string[];
  /** 语言包 */
  messages?: Record<string, Record<string, string>>;
}

// Provider 上下文类型
export interface WalletContextValue {
  /** 当前连接的钱包 */
  connector?: WalletConnector;
  /** 当前账户地址 */
  account?: string;
  /** 当前链 ID */
  chainId?: number;
  /** 是否已连接 */
  isConnected: boolean;
  /** 是否正在连接 */
  isConnecting: boolean;
  /** 连接钱包 */
  connect: (connectorId: string) => Promise<void>;
  /** 断开连接 */
  disconnect: () => Promise<void>;
  /** 切换网络 */
  switchNetwork: (chainId: number) => Promise<void>;
  /** 错误信息 */
  error?: string;
}

// 模态框状态类型
export interface ModalState {
  /** 是否显示连接模态框 */
  isConnectModalOpen: boolean;
  /** 是否显示账户模态框 */
  isAccountModalOpen: boolean;
  /** 是否显示网络切换模态框 */
  isChainModalOpen: boolean;
}

// 组件属性类型
export interface ConnectButtonProps {
  /** 按钮文本 */
  label?: string;
  /** 按钮样式变体 */
  variant?: 'primary' | 'secondary' | 'outline';
  /** 按钮大小 */
  size?: 'small' | 'medium' | 'large';
  /** 是否显示账户信息 */
  showAccountInfo?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 点击事件回调 */
  onClick?: () => void;
}

export interface WalletModalProps {
  /** 是否显示 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 自定义样式类名 */
  className?: string;
}

export interface AccountModalProps {
  /** 是否显示 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 账户地址 */
  account?: string;
  /** 自定义样式类名 */
  className?: string;
}

export interface ChainModalProps {
  /** 是否显示 */
  open: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 当前链 ID */
  currentChainId?: number;
  /** 自定义样式类名 */
  className?: string;
} 