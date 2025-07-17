import React, { useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { useWalletModals, useAvailableWallets } from '../hooks/useWalletStore';
import { cn, copyToClipboard, openExternalLink } from '../utils';
import type { WalletModalProps } from '../types';

/**
 * 钱包选择模态框组件
 * 显示可用的钱包列表供用户选择
 */
export function WalletModal({ open, onClose, className }: WalletModalProps) {
  const { connect, isConnecting } = useWallet();
  const { closeConnectModal } = useWalletModals();
  const { availableWallets } = useAvailableWallets();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // 处理模态框关闭
  const handleClose = () => {
    setSelectedWallet(null);
    closeConnectModal();
    onClose();
  };

  // 处理钱包选择
  const handleWalletSelect = async (walletId: string) => {
    setSelectedWallet(walletId);
    
    try {
      await connect(walletId);
      handleClose();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setSelectedWallet(null);
    }
  };

  // 处理下载钱包
  const handleDownloadWallet = (downloadUrl: string) => {
    openExternalLink(downloadUrl);
  };

  // 点击模态框背景关闭
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 按 ESC 键关闭模态框
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all dark:bg-gray-800',
          className
        )}
      >
        {/* 模态框头部 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            连接钱包
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 钱包列表 */}
        <div className="space-y-3">
          {availableWallets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 dark:text-gray-400">
                没有可用的钱包
              </div>
            </div>
          ) : (
            availableWallets.map((wallet) => (
              <WalletItem
                key={wallet.id}
                wallet={wallet}
                isSelected={selectedWallet === wallet.id}
                isConnecting={isConnecting}
                onSelect={() => handleWalletSelect(wallet.id)}
                onDownload={() => wallet.downloadUrl && handleDownloadWallet(wallet.downloadUrl)}
              />
            ))
          )}
        </div>

        {/* 模态框底部 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            还没有钱包？{' '}
            <button
              type="button"
              onClick={() => handleDownloadWallet('https://metamask.io/download/')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              下载 MetaMask
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * 钱包项目组件
 */
interface WalletItemProps {
  wallet: any;
  isSelected: boolean;
  isConnecting: boolean;
  onSelect: () => void;
  onDownload: () => void;
}

function WalletItem({ wallet, isSelected, isConnecting, onSelect, onDownload }: WalletItemProps) {
  const isInstalled = wallet.installed;
  const isAvailable = wallet.isAvailable?.() ?? true;

  return (
    <button
      type="button"
      onClick={isInstalled ? onSelect : onDownload}
      disabled={isConnecting || !isAvailable}
      className={cn(
        'flex w-full items-center justify-between rounded-lg border p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-700',
        isSelected && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
        !isInstalled && 'opacity-60',
        !isAvailable && 'opacity-40 cursor-not-allowed',
        isConnecting && 'cursor-wait'
      )}
    >
      <div className="flex items-center space-x-3">
        {/* 钱包图标 */}
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center"
          style={{
            backgroundImage: wallet.iconUrl ? `url(${wallet.iconUrl})` : undefined,
            backgroundColor: wallet.iconBackground || '#f3f4f6',
          }}
        />
        
        {/* 钱包信息 */}
        <div className="text-left">
          <div className="font-medium text-gray-900 dark:text-white">
            {wallet.name}
          </div>
          {wallet.description && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {wallet.description}
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center space-x-2">
        {!isInstalled && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            安装
          </span>
        )}
        {isConnecting && isSelected && (
          <svg
            className="h-4 w-4 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
} 