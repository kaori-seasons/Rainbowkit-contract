import React from 'react';
import { useWallet } from '../providers/WalletProvider';
import { useWalletModals } from '../hooks/useWalletStore';
import { cn, formatAddress } from '../utils';
import type { ConnectButtonProps } from '../types';

/**
 * 连接按钮组件
 * 根据连接状态显示不同的内容和行为
 */
export function ConnectButton({
  label,
  variant = 'primary',
  size = 'medium',
  showAccountInfo = true,
  className,
  onClick,
}: ConnectButtonProps) {
  const { account, isConnected, isConnecting, connect, disconnect } = useWallet();
  const { openConnectModal, openAccountModal } = useWalletModals();

  // 处理按钮点击
  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (isConnected) {
      // 已连接时打开账户模态框
      openAccountModal();
    } else {
      // 未连接时打开连接模态框
      openConnectModal();
    }
  };

  // 获取按钮文本
  const getButtonText = () => {
    if (isConnecting) {
      return '连接中...';
    }
    
    if (isConnected && account) {
      if (showAccountInfo) {
        return formatAddress(account);
      }
      return '已连接';
    }
    
    return label || '连接钱包';
  };

  // 获取按钮样式类名
  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    };
    
    const sizeClasses = {
      small: 'h-8 px-3 text-sm',
      medium: 'h-10 px-4 py-2',
      large: 'h-12 px-6 text-lg',
    };
    
    return cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );
  };

  // 获取按钮图标
  const getButtonIcon = () => {
    if (isConnecting) {
      return (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
      );
    }
    
    if (isConnected) {
      return (
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
          />
        </svg>
      );
    }
    
    return (
      <svg
        className="mr-2 h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
        />
      </svg>
    );
  };

  return (
    <button
      type="button"
      className={getButtonClasses()}
      onClick={handleClick}
      disabled={isConnecting}
      aria-label={isConnected ? '查看账户信息' : '连接钱包'}
    >
      {getButtonIcon()}
      {getButtonText()}
    </button>
  );
}

/**
 * 断开连接按钮组件
 */
export function DisconnectButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { disconnect } = useWallet();

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2',
        className
      )}
      onClick={disconnect}
    >
      {children || '断开连接'}
    </button>
  );
} 