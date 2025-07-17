// 导出类型定义
export type {
  WalletConnector,
  ConnectResult,
  WalletConfig,
  ChainConfig,
  ThemeConfig,
  I18nConfig,
  WalletContextValue,
  ModalState,
  ConnectButtonProps,
  WalletModalProps,
  AccountModalProps,
  ChainModalProps,
} from './types';

// 导出工具函数
export {
  cn,
  formatAddress,
  isValidAddress,
  isValidChainId,
  getDefaultChains,
  getDefaultTheme,
  getDefaultI18n,
  detectDevice,
  isMobileBrowser,
  isMetaMaskBrowser,
  isCoinbaseWalletBrowser,
  generateId,
  debounce,
  throttle,
  copyToClipboard,
  openExternalLink,
} from './utils';

// 导出 Provider 组件
export { WalletProvider, useWallet, useWalletConfig } from './providers/WalletProvider';

// 导出状态管理
export {
  useWalletStore,
  useWalletConnection,
  useWalletModals,
  useAvailableWallets,
} from './hooks/useWalletStore';

// 导出连接器
export {
  ConnectorFactory,
  createConnectorFactory,
  metamaskConnector,
  createWalletConnectConnector,
} from './connectors';

// 导出 UI 组件
export { ConnectButton, DisconnectButton } from './components/ConnectButton';
export { WalletModal } from './components/WalletModal';
export { AccountModal } from './components/AccountModal';

// 导出默认配置生成器
export function getDefaultConfig(projectId?: string): WalletConfig {
  return {
    projectId,
    appName: 'Web3 App',
    appDescription: 'A Web3 application',
    chains: [
      {
        id: 1,
        name: 'Ethereum',
        iconUrl: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
        blockExplorerUrl: 'https://etherscan.io',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
      },
      {
        id: 137,
        name: 'Polygon',
        iconUrl: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
        rpcUrl: 'https://polygon-rpc.com',
        blockExplorerUrl: 'https://polygonscan.com',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
      },
      {
        id: 56,
        name: 'BNB Smart Chain',
        iconUrl: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
        rpcUrl: 'https://bsc-dataseed.binance.org',
        blockExplorerUrl: 'https://bscscan.com',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18,
        },
      },
    ],
    theme: {
      mode: 'auto',
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#8b5cf6',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1e293b',
        textSecondary: '#64748b',
        border: '#e2e8f0',
        error: '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
      },
      borderRadius: '0.5rem',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.125rem',
      },
    },
    i18n: {
      defaultLocale: 'zh-CN',
      locales: ['zh-CN', 'en-US'],
      messages: {
        'zh-CN': {
          'connect.wallet': '连接钱包',
          'connect.metamask': 'MetaMask',
          'connect.walletconnect': 'WalletConnect',
          'connect.coinbase': 'Coinbase Wallet',
          'connect.connecting': '连接中...',
          'connect.connected': '已连接',
          'connect.disconnect': '断开连接',
          'connect.switch.network': '切换网络',
          'connect.copy.address': '复制地址',
          'connect.view.explorer': '查看区块浏览器',
          'connect.install.wallet': '安装钱包',
          'connect.download.wallet': '下载钱包',
          'connect.error.connection.failed': '连接失败',
          'connect.error.user.rejected': '用户拒绝连接',
          'connect.error.network.not.supported': '不支持的网络',
          'connect.error.wallet.not.found': '未找到钱包',
          'account.address': '地址',
          'account.balance': '余额',
          'account.network': '网络',
          'modal.close': '关闭',
          'modal.cancel': '取消',
          'modal.confirm': '确认',
        },
        'en-US': {
          'connect.wallet': 'Connect Wallet',
          'connect.metamask': 'MetaMask',
          'connect.walletconnect': 'WalletConnect',
          'connect.coinbase': 'Coinbase Wallet',
          'connect.connecting': 'Connecting...',
          'connect.connected': 'Connected',
          'connect.disconnect': 'Disconnect',
          'connect.switch.network': 'Switch Network',
          'connect.copy.address': 'Copy Address',
          'connect.view.explorer': 'View on Explorer',
          'connect.install.wallet': 'Install Wallet',
          'connect.download.wallet': 'Download Wallet',
          'connect.error.connection.failed': 'Connection failed',
          'connect.error.user.rejected': 'User rejected connection',
          'connect.error.network.not.supported': 'Network not supported',
          'connect.error.wallet.not.found': 'Wallet not found',
          'account.address': 'Address',
          'account.balance': 'Balance',
          'account.network': 'Network',
          'modal.close': 'Close',
          'modal.cancel': 'Cancel',
          'modal.confirm': 'Confirm',
        },
      },
    },
  };
} 