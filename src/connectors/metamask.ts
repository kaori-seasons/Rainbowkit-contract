import type { WalletConnector, ConnectResult } from '../types';
import { isMetaMaskBrowser, isMobileBrowser } from '../utils';

/**
 * MetaMask 钱包连接器
 * 支持浏览器扩展和移动端深链接
 */
export class MetaMaskConnector implements WalletConnector {
  id = 'metamask';
  name = 'MetaMask';
  iconUrl = 'https://assets.coingecko.com/coins/images/279/small/ethereum.png';
  iconBackground = '#f6851b';
  downloadUrl = 'https://metamask.io/download/';
  description = 'The most popular Ethereum wallet';
  
  // 检测设备支持情况
  mobile = true;
  desktop = true;
  extension = true;
  
  // 检查是否已安装
  get installed(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum?.isMetaMask;
  }
  
  /**
   * 检查 MetaMask 是否可用
   */
  async isAvailable(): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    
    // 检查是否在 MetaMask 浏览器中
    if (isMetaMaskBrowser()) return true;
    
    // 检查是否安装了 MetaMask 扩展
    if (window.ethereum?.isMetaMask) return true;
    
    // 移动端支持深链接
    if (isMobileBrowser()) return true;
    
    return false;
  }
  
  /**
   * 连接到 MetaMask
   */
  async connect(): Promise<ConnectResult> {
    try {
      // 检查是否在 MetaMask 浏览器中
      if (isMetaMaskBrowser()) {
        return await this.connectInMetaMaskBrowser();
      }
      
      // 检查是否安装了 MetaMask 扩展
      if (window.ethereum?.isMetaMask) {
        return await this.connectWithExtension();
      }
      
      // 移动端使用深链接
      if (isMobileBrowser()) {
        return await this.connectWithDeepLink();
      }
      
      return {
        success: false,
        error: 'MetaMask not found. Please install MetaMask extension or use MetaMask mobile app.',
      };
    } catch (error) {
      console.error('MetaMask connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }
  
  /**
   * 在 MetaMask 浏览器中连接
   */
  private async connectInMetaMaskBrowser(): Promise<ConnectResult> {
    if (!window.ethereum) {
      return {
        success: false,
        error: 'Ethereum provider not found',
      };
    }
    
    try {
      // 请求账户连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts found',
        };
      }
      
      const account = accounts[0];
      
      // 获取当前链 ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      
      return {
        success: true,
        account,
        chainId: parseInt(chainId, 16),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          return {
            success: false,
            error: 'User rejected connection',
          };
        }
      }
      throw error;
    }
  }
  
  /**
   * 使用浏览器扩展连接
   */
  private async connectWithExtension(): Promise<ConnectResult> {
    if (!window.ethereum) {
      return {
        success: false,
        error: 'Ethereum provider not found',
      };
    }
    
    try {
      // 请求账户连接
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (!accounts || accounts.length === 0) {
        return {
          success: false,
          error: 'No accounts found',
        };
      }
      
      const account = accounts[0];
      
      // 获取当前链 ID
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      
      return {
        success: true,
        account,
        chainId: parseInt(chainId, 16),
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          return {
            success: false,
            error: 'User rejected connection',
          };
        }
      }
      throw error;
    }
  }
  
  /**
   * 使用深链接连接（移动端）
   */
  private async connectWithDeepLink(): Promise<ConnectResult> {
    // MetaMask 深链接格式
    const deepLink = 'https://metamask.app.link/dapp/' + encodeURIComponent(window.location.href);
    
    // 尝试打开 MetaMask 应用
    window.location.href = deepLink;
    
    // 由于深链接会跳转到 MetaMask 应用，这里返回一个特殊状态
    return {
      success: false,
      error: 'Redirecting to MetaMask mobile app...',
    };
  }
  
  /**
   * 断开连接
   */
  async disconnect(): Promise<void> {
    // MetaMask 没有标准的断开连接方法
    // 我们只需要清除本地状态即可
    console.log('MetaMask disconnect: clearing local state');
  }
  
  /**
   * 监听账户变化
   */
  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  }
  
  /**
   * 监听链变化
   */
  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', callback);
    }
  }
  
  /**
   * 移除事件监听器
   */
  removeListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeAllListeners();
    }
  }
}

// 创建 MetaMask 连接器实例
export const metamaskConnector = new MetaMaskConnector(); 