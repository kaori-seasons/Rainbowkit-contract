import type { WalletConnector, ConnectResult } from '../types';
import { isMobileBrowser } from '../utils';

/**
 * WalletConnect 连接器
 * 支持二维码连接和移动端应用
 */
export class WalletConnectConnector implements WalletConnector {
  id = 'walletconnect';
  name = 'WalletConnect';
  iconUrl = 'https://assets.coingecko.com/coins/images/279/small/ethereum.png';
  iconBackground = '#3396ff';
  downloadUrl = 'https://walletconnect.com/';
  description = 'Connect to any wallet with WalletConnect';
  
  // 检测设备支持情况
  mobile = true;
  desktop = true;
  extension = false;
  
  private projectId?: string;
  private connector?: any;
  
  constructor(projectId?: string) {
    this.projectId = projectId;
  }
  
  // 检查是否已安装（WalletConnect 不需要安装）
  get installed(): boolean {
    return true;
  }
  
  /**
   * 检查 WalletConnect 是否可用
   */
  async isAvailable(): Promise<boolean> {
    // WalletConnect 总是可用的，因为它通过二维码或深链接工作
    return true;
  }
  
  /**
   * 连接到 WalletConnect
   */
  async connect(): Promise<ConnectResult> {
    try {
      // 动态导入 WalletConnect 以避免 SSR 问题
      const { WalletConnectModal } = await import('@walletconnect/modal');
      
      if (!this.projectId) {
        return {
          success: false,
          error: 'Project ID is required for WalletConnect. Please provide a project ID in the configuration.',
        };
      }
      
      // 创建 WalletConnect 模态框
      const modal = new WalletConnectModal({
        projectId: this.projectId,
        chains: [1], // 默认以太坊主网
        enableExplorer: true,
        explorerRecommendedWalletIds: 'ALL',
        explorerExcludedWalletIds: 'ALL',
        mobileWallets: [
          {
            id: 'metamask',
            name: 'MetaMask',
            links: {
              native: 'metamask://',
              universal: 'https://metamask.app.link',
            },
          },
          {
            id: 'rainbow',
            name: 'Rainbow',
            links: {
              native: 'rainbow://',
              universal: 'https://rainbow.me',
            },
          },
        ],
        walletImages: {
          metamask: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          rainbow: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        },
      });
      
      // 打开连接模态框
      await modal.openModal();
      
      // 等待用户连接
      const session = await new Promise((resolve, reject) => {
        const checkSession = () => {
          if (modal.connected) {
            resolve(modal.session);
          } else {
            setTimeout(checkSession, 100);
          }
        };
        checkSession();
        
        // 设置超时
        setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 30000);
      });
      
      if (!session) {
        return {
          success: false,
          error: 'Failed to establish WalletConnect session',
        };
      }
      
      // 获取账户信息
      const accounts = session.namespaces.eip155.accounts;
      const account = accounts[0]?.split(':')[2]; // 格式: eip155:1:0x...
      const chainId = parseInt(accounts[0]?.split(':')[1] || '1');
      
      this.connector = modal;
      
      return {
        success: true,
        account,
        chainId,
      };
    } catch (error) {
      console.error('WalletConnect connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }
  
  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    if (this.connector) {
      await this.connector.disconnect();
      this.connector = undefined;
    }
  }
  
  /**
   * 获取连接状态
   */
  isConnected(): boolean {
    return this.connector?.connected || false;
  }
  
  /**
   * 获取当前账户
   */
  getAccount(): string | undefined {
    if (!this.connector?.session) return undefined;
    const accounts = this.connector.session.namespaces.eip155.accounts;
    return accounts[0]?.split(':')[2];
  }
  
  /**
   * 获取当前链 ID
   */
  getChainId(): number | undefined {
    if (!this.connector?.session) return undefined;
    const accounts = this.connector.session.namespaces.eip155.accounts;
    return parseInt(accounts[0]?.split(':')[1] || '1');
  }
}

// 创建 WalletConnect 连接器工厂函数
export function createWalletConnectConnector(projectId?: string): WalletConnectConnector {
  return new WalletConnectConnector(projectId);
} 