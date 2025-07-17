import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 CSS 类名的工具函数
 * 使用 clsx 和 tailwind-merge 来智能合并类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化以太坊地址
 * 显示为 0x1234...5678 的格式
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * 检查是否为有效的以太坊地址
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * 检查是否为有效的链 ID
 */
export function isValidChainId(chainId: number): boolean {
  return Number.isInteger(chainId) && chainId > 0;
}

/**
 * 获取默认的链配置
 */
export function getDefaultChains() {
  return [
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
  ];
}

/**
 * 获取默认主题配置
 */
export function getDefaultTheme() {
  return {
    mode: 'auto' as const,
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
  };
}

/**
 * 获取默认国际化配置
 */
export function getDefaultI18n() {
  return {
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
  };
}

/**
 * 检测用户设备类型
 */
export function detectDevice() {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  
  return {
    isMobile,
    isIOS,
    isAndroid,
    isDesktop: !isMobile,
  };
}

/**
 * 检测是否在移动端浏览器中
 */
export function isMobileBrowser(): boolean {
  return detectDevice().isMobile;
}

/**
 * 检测是否在 MetaMask 浏览器中
 */
export function isMetaMaskBrowser(): boolean {
  return window.ethereum?.isMetaMask === true;
}

/**
 * 检测是否在 Coinbase Wallet 浏览器中
 */
export function isCoinbaseWalletBrowser(): boolean {
  return window.ethereum?.isCoinbaseWallet === true;
}

/**
 * 生成随机 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('复制失败:', error);
    return false;
  }
}

/**
 * 打开外部链接
 */
export function openExternalLink(url: string, target = '_blank'): void {
  window.open(url, target, 'noopener,noreferrer');
} 