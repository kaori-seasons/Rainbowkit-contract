import React from 'react';
import {
  WalletProvider,
  ConnectButton,
  WalletModal,
  AccountModal,
  getDefaultConfig,
} from '../src';

/**
 * 示例应用组件
 * 展示如何使用钱包连接库
 */
function App() {
  // 创建钱包配置
  const config = getDefaultConfig('your-walletconnect-project-id');

  return (
    <WalletProvider config={config}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* 导航栏 */}
        <nav className="bg-white shadow-sm dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Web3 钱包连接示例
                </h1>
              </div>
              <div className="flex items-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  欢迎使用 Web3 钱包连接库
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  点击右上角的按钮连接您的钱包，开始体验 Web3 功能
                </p>
                <ConnectButton
                  label="连接钱包"
                  variant="primary"
                  size="large"
                />
              </div>
            </div>
          </div>
        </main>

        {/* 模态框组件 */}
        <WalletModal
          open={false}
          onClose={() => {}}
        />
        <AccountModal
          open={false}
          onClose={() => {}}
        />
      </div>
    </WalletProvider>
  );
}

export default App; 