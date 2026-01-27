# rn-html-render

A React Native native module for HTML rendering with advanced features for Android and iOS.

## Features

- 🌐 **HTML rendering** from strings or URLs
- 📱 **Cross-platform** support for Android and iOS
- 🔗 **Auto-linking** support (React Native ≥ 0.60)
- 🎯 **TypeScript** type definitions included
- ⚡ **Promise-based API**
- 📊 **Screenshot capture** (base64)
- 🎨 **Customizable dimensions**
- 🔧 **JavaScript control**
- 📦 **Zero dependencies** (peer dependencies only)

## Installation

```bash
npm install rn-html-render
# or
yarn add rn-html-render
```

For React Native ≥ 0.60, the library will auto-link. After installation, rebuild your app:

```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## Platform Setup

### iOS Setup

Add the following permission to your `ios/YourApp/Info.plist`:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Android Setup

The library automatically adds required permissions (INTERNET, ACCESS_NETWORK_STATE).

## Usage

### Basic Example

```typescript
import HTMLRender from 'rn-html-render';

// Render HTML string
const html = '<html><body><h1>Hello World</h1></body></html>';
const result = await HTMLRender.renderHTML(html);
console.log(result.title);
console.log(result.text);
```

### Render URL

```typescript
// Render URL
const result = await HTMLRender.renderURL('https://example.com');
console.log(result.url);
console.log(result.text);
```

### Advanced Options

```typescript
const result = await HTMLRender.renderHTML(html, {
  width: 1080,
  height: 1920,
  enableJavaScript: true,
  enableCache: true,
  timeout: 30000,
  executeJavaScript: 'document.body.innerHTML',
});
```

## API Reference

### Methods

#### `renderHTML(html: string, options?: HTMLOptions): Promise<HTMLRenderResult>`

Renders HTML content and returns the result.

```typescript
interface HTMLOptions {
  width?: number;
  height?: number;
  enableJavaScript?: boolean;
  enableCache?: boolean;
  userAgent?: string;
  headers?: Record<string, string>;
  timeout?: number;
  waitForSelector?: string;
  waitForNavigation?: boolean;
  executeJavaScript?: string;
  css?: string;
}

interface HTMLRenderResult {
  html?: string;
  text?: string;
  title?: string;
  screenshot?: string; // base64
  width?: number;
  height?: number;
  loadTime?: number;
  executedJavaScript?: string;
}
```

#### `renderURL(url: string, options?: HTMLOptions): Promise<HTMLRenderResult>`

Renders a URL and returns the content.

#### `clearCache(): Promise<void>`

Clears the HTML render cache.

#### `clearCookies(): Promise<void>`

Clears all cookies.

#### `getUserAgent(): Promise<string>`

Gets the current user agent string.

#### `setUserAgent(userAgent: string): Promise<void>`

Sets a custom user agent string.

### Events

- **onLoad**: Render loaded successfully
- **onError**: Error occurred during render
- **onProgress**: Loading progress (0-100)

```typescript
interface HTMLError {
  code: string;
  message: string;
}
```

### Error Codes

`INVALID_HTML`, `NETWORK_ERROR`, `TIMEOUT`, `NOT_AVAILABLE`, `UNKNOWN`

## Platform Differences

**Android**: Uses WebView for rendering, supports custom user agents and headers

**iOS**: Uses WKWebView for rendering, requires iOS 12.0+, supports advanced features like JavaScript control

## Requirements

- React Native ≥ 0.64.0
- Android: minSdkVersion 21
- iOS: iOS 12.0+

## License

MIT

## Author

afzaal
