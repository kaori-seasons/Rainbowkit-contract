# Rainbowkit-contract

一个生产可用的钱包连接库，类似 RainbowKit，专为 React 应用设计。

## 特性

- 🚀 **开箱即用** - 提供完整的钱包连接解决方案
- 🔌 **多钱包支持** - 支持 MetaMask、WalletConnect 等主流钱包
- 📱 **响应式设计** - 完美适配桌面端和移动端
- 🎨 **主题定制** - 支持浅色、深色主题和自定义样式
- 🌍 **国际化** - 内置中英文支持
- 🔧 **TypeScript** - 完整的类型定义
- ⚡ **高性能** - 基于 Zustand 的状态管理
- 🛡️ **安全可靠** - 遵循 Web3 安全最佳实践

## 快速开始

### 安装

```bash
npm install rainbowkit-contract
# 或
yarn add rainbowkit-contract
```

### 基础使用

```tsx
import React from 'react';
import {
  WalletProvider,
  ConnectButton,
  WalletModal,
  AccountModal,
  getDefaultConfig,
} from 'rainbowkit-contract';

function App() {
  const config = getDefaultConfig('your-walletconnect-project-id');

  return (
    <WalletProvider config={config}>
      <div>
        <ConnectButton />
        <WalletModal open={false} onClose={() => {}} />
        <AccountModal open={false} onClose={() => {}} />
      </div>
    </WalletProvider>
  );
}
```

## API 文档

### WalletProvider

主要的 Provider 组件，提供钱包连接功能。

```tsx
import { WalletProvider, getDefaultConfig } from 'rainbowkit-contract';

const config = getDefaultConfig('your-project-id');

<WalletProvider config={config}>
  {/* 你的应用 */}
</WalletProvider>
```

#### 配置选项

```tsx
interface WalletConfig {
  projectId?: string;           // WalletConnect 项目 ID
  appName?: string;             // 应用名称
  appDescription?: string;      // 应用描述
  appIcon?: string;             // 应用图标 URL
  appUrl?: string;              // 应用 URL
  wallets?: WalletConnector[];  // 自定义钱包列表
  chains?: ChainConfig[];       // 支持的链配置
  theme?: ThemeConfig;          // 主题配置
  i18n?: I18nConfig;           // 国际化配置
}
```

### ConnectButton

连接钱包按钮组件。

```tsx
import { ConnectButton } from 'rainbowkit-contract';

<ConnectButton
  label="连接钱包"
  variant="primary"
  size="medium"
  showAccountInfo={true}
  className="custom-class"
  onClick={() => {}}
/>
```

#### 属性

- `label?: string` - 按钮文本
- `variant?: 'primary' | 'secondary' | 'outline'` - 按钮样式变体
- `size?: 'small' | 'medium' | 'large'` - 按钮大小
- `showAccountInfo?: boolean` - 是否显示账户信息
- `className?: string` - 自定义样式类名
- `onClick?: () => void` - 点击事件回调

### useWallet Hook

获取钱包连接状态和操作方法。

```tsx
import { useWallet } from 'rainbowkit-contract';

function MyComponent() {
  const {
    account,
    chainId,
    isConnected,
    isConnecting,
    connect,
    disconnect,
    switchNetwork,
    error,
  } = useWallet();

  return (
    <div>
      {isConnected ? (
        <p>已连接: {account}</p>
      ) : (
        <button onClick={() => connect('metamask')}>
          连接 MetaMask
        </button>
      )}
    </div>
  );
}
```

### 模态框组件

#### WalletModal

钱包选择模态框。

```tsx
import { WalletModal } from 'rainbowkit-contract';

<WalletModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  className="custom-modal"
/>
```

#### AccountModal

账户信息模态框。

```tsx
import { AccountModal } from 'rainbowkit-contract';

<AccountModal
  open={isOpen}
  onClose={() => setIsOpen(false)}
  account="0x1234..."
  className="custom-modal"
/>
```

## 钱包连接器

### 内置连接器

#### MetaMask

```tsx
import { metamaskConnector } from 'rainbowkit-contract';

// 自动注册到连接器工厂
```

#### WalletConnect

```tsx
import { createWalletConnectConnector } from 'rainbowkit-contract';

const walletConnectConnector = createWalletConnectConnector('your-project-id');
```

### 自定义连接器

```tsx
import { WalletConnector } from 'rainbowkit-contract';

class CustomWalletConnector implements WalletConnector {
  id = 'custom-wallet';
  name = 'Custom Wallet';
  iconUrl = 'https://example.com/icon.png';
  
  async isAvailable(): Promise<boolean> {
    // 检查钱包是否可用
    return true;
  }
  
  async connect(): Promise<ConnectResult> {
    // 实现连接逻辑
    return {
      success: true,
      account: '0x...',
      chainId: 1,
    };
  }
  
  async disconnect(): Promise<void> {
    // 实现断开连接逻辑
  }
}
```

## 主题定制

### 使用默认主题

```tsx
const config = getDefaultConfig('project-id');
```

### 自定义主题

```tsx
const config = {
  ...getDefaultConfig('project-id'),
  theme: {
    mode: 'dark',
    colors: {
      primary: '#ff6b6b',
      secondary: '#4ecdc4',
      // ... 其他颜色
    },
    borderRadius: '1rem',
    fontSize: {
      small: '0.75rem',
      medium: '1rem',
      large: '1.25rem',
    },
  },
};
```

## 国际化

### 使用默认语言

```tsx
const config = getDefaultConfig('project-id');
// 默认使用中文
```

### 自定义语言

```tsx
const config = {
  ...getDefaultConfig('project-id'),
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'zh-CN'],
    messages: {
      'en-US': {
        'connect.wallet': 'Connect Wallet',
        // ... 其他翻译
      },
      'zh-CN': {
        'connect.wallet': '连接钱包',
        // ... 其他翻译
      },
    },
  },
};
```

## 工具函数

### 地址格式化

```tsx
import { formatAddress } from 'rainbowkit-contract';

const shortAddress = formatAddress('0x1234567890abcdef...', 6);
// 输出: 0x123456...abcdef
```

### 地址验证

```tsx
import { isValidAddress } from 'rainbowkit-contract';

const isValid = isValidAddress('0x1234567890abcdef...');
// 输出: true/false
```

### 复制到剪贴板

```tsx
import { copyToClipboard } from 'rainbowkit-contract';

const success = await copyToClipboard('要复制的文本');
```

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建库

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 运行 Storybook

```bash
npm run storybook
```

## 项目结构

```
src/
├── components/          # UI 组件
│   ├── ConnectButton.tsx
│   ├── WalletModal.tsx
│   └── AccountModal.tsx
├── connectors/          # 钱包连接器
│   ├── index.ts
│   ├── metamask.ts
│   └── walletconnect.ts
├── hooks/              # React Hooks
│   └── useWalletStore.ts
├── providers/          # Provider 组件
│   └── WalletProvider.tsx
├── types/              # TypeScript 类型定义
│   └── index.ts
├── utils/              # 工具函数
│   └── index.ts
└── index.ts            # 主入口文件
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 更新日志

### v1.0.0

- 🎉 初始版本发布
- ✨ 支持 MetaMask 和 WalletConnect
- 🎨 响应式 UI 设计
- 🌍 中英文国际化支持
- 🔧 完整的 TypeScript 类型定义
- �� 移动端适配
- 🎨 主题定制系统

