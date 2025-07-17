import React, { useEffect, useState } from 'react';
import { useWallet } from '../providers/WalletProvider';
import { useWalletModals } from '../hooks/useWalletStore';
import { cn, formatAddress, copyToClipboard, openExternalLink } from '../utils';
import type { AccountModalProps } from '../types';

/**
 * 账户信息模态框组件
 * 显示当前连接的账户信息和相关操作
 */
export function AccountModal({ open, onClose, account, className }: AccountModalProps) {
  const { account: currentAccount, chainId, disconnect, switchNetwork } = useWallet();
  const { closeAccountModal } = useWalletModals();
  const [copied, setCopied] = useState(false);
  const [balance, setBalance] = useState<string>('0');

  // 使用传入的账户或当前连接的账户
  const displayAccount = account || currentAccount;

  // 处理模态框关闭
  const handleClose = () => {
    closeAccountModal();
    onClose();
  };

  // 复制地址
  const handleCopyAddress = async () => {
    if (displayAccount) {
      const success = await copyToClipboard(displayAccount);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  // 查看区块浏览器
  const handleViewExplorer = () => {
    if (displayAccount && chainId) {
      const explorerUrls: Record<number, string> = {
        1: 'https://etherscan.io',
        137: 'https://polygonscan.com',
        56: 'https://bscscan.com',
      };
      
      const baseUrl = explorerUrls[chainId] || 'https://etherscan.io';
      openExternalLink(`${baseUrl}/address/${displayAccount}`);
    }
  };

  // 断开连接
  const handleDisconnect = async () => {
    await disconnect();
    handleClose();
  };

  // 获取链名称
  const getChainName = () => {
    const chainNames: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      56: 'BNB Smart Chain',
    };
    return chainNames[chainId || 1] || 'Unknown';
  };

  // 获取链图标
  const getChainIcon = () => {
    const chainIcons: Record<number, string> = {
      1: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      137: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      56: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    };
    return chainIcons[chainId || 1];
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
            账户信息
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

        {/* 账户信息 */}
        <div className="space-y-4">
          {/* 地址 */}
          <div className="rounded-lg border p-4 dark:border-gray-700">
            <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              地址
            </div>
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-900 dark:text-white">
                {displayAccount ? formatAddress(displayAccount, 6) : 'N/A'}
              </code>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                title="复制地址"
              >
                {copied ? (
                  <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* 网络 */}
          <div className="rounded-lg border p-4 dark:border-gray-700">
            <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              网络
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={getChainIcon()}
                alt={getChainName()}
                className="h-5 w-5 rounded-full"
              />
              <span className="text-sm text-gray-900 dark:text-white">
                {getChainName()}
              </span>
            </div>
          </div>

          {/* 余额 */}
          <div className="rounded-lg border p-4 dark:border-gray-700">
            <div className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              余额
            </div>
            <div className="text-sm text-gray-900 dark:text-white">
              {balance} {getChainName() === 'Ethereum' ? 'ETH' : getChainName() === 'Polygon' ? 'MATIC' : 'BNB'}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={handleViewExplorer}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>查看区块浏览器</span>
          </button>

          <button
            type="button"
            onClick={handleDisconnect}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>断开连接</span>
          </button>
        </div>
      </div>
    </div>
  );
} 