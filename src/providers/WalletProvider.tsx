import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
import { useWalletStore, useWalletConnection, useAvailableWallets } from '../hooks/useWalletStore';
import { ConnectorFactory } from '../connectors';
import type { WalletConfig, WalletContextValue } from '../types';
import { getDefaultChains, getDefaultTheme, getDefaultI18n } from '../utils';

// 创建钱包上下文
const WalletContext = createContext<WalletContextValue | undefined>(undefined);

// Provider 属性接口
interface WalletProviderProps {
  /** 钱包配置 */
  config?: WalletConfig;
  /** 子组件 */
  children: ReactNode;
}

/**
 * 钱包 Provider 组件
 * 提供钱包连接功能给整个应用
 */
export function WalletProvider({ config, children }: WalletProviderProps) {
  // 合并配置
  const mergedConfig = useMemo(() => {
    return {
      projectId: config?.projectId,
      appName: config?.appName || 'Web3 App',
      appDescription: config?.appDescription || 'A Web3 application',
      appIcon: config?.appIcon,
      appUrl: config?.appUrl,
      wallets: config?.wallets || [],
      chains: config?.chains || getDefaultChains(),
      theme: { ...getDefaultTheme(), ...config?.theme },
      i18n: { ...getDefaultI18n(), ...config?.i18n },
    };
  }, [config]);

  // 创建连接器工厂
  const connectorFactory = useMemo(() => {
    return new ConnectorFactory(mergedConfig.projectId);
  }, [mergedConfig.projectId]);

  // 获取状态和方法
  const {
    connector,
    account,
    chainId,
    isConnected,
    isConnecting,
    error,
    setConnector,
    setAccount,
    setChainId,
    setIsConnected,
    setIsConnecting,
    setError,
    clearError,
  } = useWalletStore();

  const { availableWallets, setAvailableWallets } = useAvailableWallets();

  // 初始化可用钱包
  useEffect(() => {
    const initializeWallets = async () => {
      try {
        // 获取可用的连接器
        const availableConnectors = await connectorFactory.getAvailableConnectors();
        
        // 合并自定义钱包和默认连接器
        const allWallets = [
          ...availableConnectors,
          ...mergedConfig.wallets,
        ];
        
        setAvailableWallets(allWallets);
      } catch (error) {
        console.error('Failed to initialize wallets:', error);
      }
    };

    initializeWallets();
  }, [connectorFactory, mergedConfig.wallets, setAvailableWallets]);

  // 连接钱包
  const connect = async (connectorId: string) => {
    try {
      setIsConnecting(true);
      clearError();

      const walletConnector = connectorFactory.getConnector(connectorId);
      if (!walletConnector) {
        throw new Error(`Connector ${connectorId} not found`);
      }

      const result = await walletConnector.connect();
      
      if (result.success && result.account) {
        setConnector(walletConnector);
        setAccount(result.account);
        if (result.chainId) {
          setChainId(result.chainId);
        }
        setIsConnected(true);
      } else {
        throw new Error(result.error || 'Connection failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Connection failed';
      setError(errorMessage);
      console.error('Wallet connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // 断开连接
  const disconnect = async () => {
    try {
      if (connector) {
        await connector.disconnect();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    } finally {
      // 清除所有状态
      useWalletStore.getState().reset();
    }
  };

  // 切换网络
  const switchNetwork = async (newChainId: number) => {
    try {
      if (!connector) {
        throw new Error('No wallet connected');
      }

      // 检查是否支持网络切换
      if (window.ethereum && window.ethereum.request) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${newChainId.toString(16)}` }],
        });
        
        setChainId(newChainId);
      } else {
        throw new Error('Network switching not supported');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network switching failed';
      setError(errorMessage);
      console.error('Network switching error:', error);
    }
  };

  // 监听账户和链变化
  useEffect(() => {
    if (!connector || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // 用户断开了连接
        disconnect();
      } else {
        // 用户切换了账户
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      setChainId(parseInt(chainId, 16));
    };

    // 添加事件监听器
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // 清理函数
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connector, setAccount, setChainId]);

  // 创建上下文值
  const contextValue: WalletContextValue = useMemo(() => ({
    connector,
    account,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    error,
  }), [
    connector,
    account,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    error,
  ]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

/**
 * 使用钱包上下文的 Hook
 */
export function useWallet(): WalletContextValue {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

/**
 * 使用钱包配置的 Hook
 */
export function useWalletConfig() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletConfig must be used within a WalletProvider');
  }
  return context;
} 