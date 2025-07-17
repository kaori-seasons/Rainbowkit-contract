import type { WalletConnector } from '../types';
import { metamaskConnector } from './metamask';
import { createWalletConnectConnector } from './walletconnect';

/**
 * 连接器工厂类
 * 负责管理和创建各种钱包连接器
 */
export class ConnectorFactory {
  private connectors: Map<string, WalletConnector> = new Map();
  private projectId?: string;
  
  constructor(projectId?: string) {
    this.projectId = projectId;
    this.initializeDefaultConnectors();
  }
  
  /**
   * 初始化默认连接器
   */
  private initializeDefaultConnectors(): void {
    // 注册 MetaMask 连接器
    this.registerConnector(metamaskConnector);
    
    // 注册 WalletConnect 连接器
    if (this.projectId) {
      const walletConnectConnector = createWalletConnectConnector(this.projectId);
      this.registerConnector(walletConnectConnector);
    }
  }
  
  /**
   * 注册连接器
   */
  registerConnector(connector: WalletConnector): void {
    this.connectors.set(connector.id, connector);
  }
  
  /**
   * 获取连接器
   */
  getConnector(id: string): WalletConnector | undefined {
    return this.connectors.get(id);
  }
  
  /**
   * 获取所有连接器
   */
  getAllConnectors(): WalletConnector[] {
    return Array.from(this.connectors.values());
  }
  
  /**
   * 获取可用的连接器
   */
  async getAvailableConnectors(): Promise<WalletConnector[]> {
    const availableConnectors: WalletConnector[] = [];
    
    for (const connector of this.connectors.values()) {
      try {
        const isAvailable = await connector.isAvailable();
        if (isAvailable) {
          availableConnectors.push(connector);
        }
      } catch (error) {
        console.warn(`Failed to check availability for connector ${connector.id}:`, error);
      }
    }
    
    return availableConnectors;
  }
  
  /**
   * 移除连接器
   */
  removeConnector(id: string): boolean {
    return this.connectors.delete(id);
  }
  
  /**
   * 清空所有连接器
   */
  clearConnectors(): void {
    this.connectors.clear();
  }
  
  /**
   * 获取连接器数量
   */
  getConnectorCount(): number {
    return this.connectors.size;
  }
  
  /**
   * 检查连接器是否存在
   */
  hasConnector(id: string): boolean {
    return this.connectors.has(id);
  }
}

// 创建默认的连接器工厂实例
export function createConnectorFactory(projectId?: string): ConnectorFactory {
  return new ConnectorFactory(projectId);
}

// 导出默认连接器
export { metamaskConnector } from './metamask';
export { createWalletConnectConnector } from './walletconnect'; 