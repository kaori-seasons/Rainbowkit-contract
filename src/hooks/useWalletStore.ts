import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { WalletConnector, ConnectResult, ModalState } from '../types';

// 钱包状态接口
interface WalletState {
  // 连接状态
  connector?: WalletConnector;
  account?: string;
  chainId?: number;
  isConnected: boolean;
  isConnecting: boolean;
  error?: string;
  
  // 模态框状态
  modalState: ModalState;
  
  // 可用钱包列表
  availableWallets: WalletConnector[];
  
  // 操作方法
  setConnector: (connector: WalletConnector) => void;
  setAccount: (account: string) => void;
  setChainId: (chainId: number) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error?: string) => void;
  clearError: () => void;
  
  // 模态框操作
  openConnectModal: () => void;
  closeConnectModal: () => void;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  openChainModal: () => void;
  closeChainModal: () => void;
  
  // 钱包列表操作
  setAvailableWallets: (wallets: WalletConnector[]) => void;
  addAvailableWallet: (wallet: WalletConnector) => void;
  removeAvailableWallet: (walletId: string) => void;
  
  // 重置状态
  reset: () => void;
}

// 创建钱包状态管理 store
export const useWalletStore = create<WalletState>()(
  subscribeWithSelector((set, get) => ({
    // 初始状态
    isConnected: false,
    isConnecting: false,
    modalState: {
      isConnectModalOpen: false,
      isAccountModalOpen: false,
      isChainModalOpen: false,
    },
    availableWallets: [],
    
    // 设置连接器
    setConnector: (connector: WalletConnector) => {
      set({ connector });
    },
    
    // 设置账户地址
    setAccount: (account: string) => {
      set({ account });
    },
    
    // 设置链 ID
    setChainId: (chainId: number) => {
      set({ chainId });
    },
    
    // 设置连接状态
    setIsConnected: (isConnected: boolean) => {
      set({ isConnected });
    },
    
    // 设置连接中状态
    setIsConnecting: (isConnecting: boolean) => {
      set({ isConnecting });
    },
    
    // 设置错误信息
    setError: (error?: string) => {
      set({ error });
    },
    
    // 清除错误信息
    clearError: () => {
      set({ error: undefined });
    },
    
    // 打开连接模态框
    openConnectModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isConnectModalOpen: true,
        },
      }));
    },
    
    // 关闭连接模态框
    closeConnectModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isConnectModalOpen: false,
        },
      }));
    },
    
    // 打开账户模态框
    openAccountModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isAccountModalOpen: true,
        },
      }));
    },
    
    // 关闭账户模态框
    closeAccountModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isAccountModalOpen: false,
        },
      }));
    },
    
    // 打开链切换模态框
    openChainModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isChainModalOpen: true,
        },
      }));
    },
    
    // 关闭链切换模态框
    closeChainModal: () => {
      set((state) => ({
        modalState: {
          ...state.modalState,
          isChainModalOpen: false,
        },
      }));
    },
    
    // 设置可用钱包列表
    setAvailableWallets: (wallets: WalletConnector[]) => {
      set({ availableWallets: wallets });
    },
    
    // 添加可用钱包
    addAvailableWallet: (wallet: WalletConnector) => {
      set((state) => ({
        availableWallets: [...state.availableWallets, wallet],
      }));
    },
    
    // 移除可用钱包
    removeAvailableWallet: (walletId: string) => {
      set((state) => ({
        availableWallets: state.availableWallets.filter(
          (wallet) => wallet.id !== walletId
        ),
      }));
    },
    
    // 重置所有状态
    reset: () => {
      set({
        connector: undefined,
        account: undefined,
        chainId: undefined,
        isConnected: false,
        isConnecting: false,
        error: undefined,
        modalState: {
          isConnectModalOpen: false,
          isAccountModalOpen: false,
          isChainModalOpen: false,
        },
        availableWallets: [],
      });
    },
  }))
);

// 导出便捷的 hooks
export const useWalletConnection = () => {
  return useWalletStore((state) => ({
    connector: state.connector,
    account: state.account,
    chainId: state.chainId,
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    error: state.error,
  }));
};

export const useWalletModals = () => {
  return useWalletStore((state) => ({
    modalState: state.modalState,
    openConnectModal: state.openConnectModal,
    closeConnectModal: state.closeConnectModal,
    openAccountModal: state.openAccountModal,
    closeAccountModal: state.closeAccountModal,
    openChainModal: state.openChainModal,
    closeChainModal: state.closeChainModal,
  }));
};

export const useAvailableWallets = () => {
  return useWalletStore((state) => ({
    availableWallets: state.availableWallets,
    setAvailableWallets: state.setAvailableWallets,
    addAvailableWallet: state.addAvailableWallet,
    removeAvailableWallet: state.removeAvailableWallet,
  }));
}; 