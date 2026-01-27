# rn-web-preview

A React Native native module for web preview with advanced features for Android and iOS.

## Features

- 🌐 **URL preview** with HTML content
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
npm install rn-web-preview
# or
yarn add rn-web-preview
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
import WebPreview from 'rn-web-preview';

// Preview URL
const result = await WebPreview.previewURL('https://example.com');
console.log(result.title);
console.log(result.text);
```

### Preview HTML

```typescript
// Preview HTML content
const html = '<html><body><h1>Hello World</h1></body></html>';
const result = await WebPreview.previewHTML(html);
console.log(result.html);
```

### Advanced Options

```typescript
const result = await WebPreview.previewURL('https://example.com', {
  width: 1080,
  height: 1920,
  enableJavaScript: true,
  enableCache: true,
  timeout: 30000,
  waitForSelector: '.content',
  waitForNavigation: true,
});
```

## API Reference

### Methods

#### `previewURL(url: string, options?: WebPreviewOptions): Promise<WebPreviewResult>`

Previews a URL and returns the content.

```typescript
interface WebPreviewOptions {
  url?: string;
  width?: number;
  height?: number;
  enableJavaScript?: boolean;
  enableCache?: boolean;
  userAgent?: string;
  headers?: Record<string, string>;
  timeout?: number;
  waitForSelector?: string;
  waitForNavigation?: boolean;
}

interface WebPreviewResult {
  html?: string;
  text?: string;
  title?: string;
  screenshot?: string; // base64
  width?: number;
  height?: number;
  url?: string;
  loadTime?: number;
}
```

#### `previewHTML(html: string, options?: WebPreviewOptions): Promise<WebPreviewResult>`

Previews HTML content and returns the rendered result.

#### `clearCache(): Promise<void>`

Clears the web preview cache.

#### `clearCookies(): Promise<void>`

Clears all cookies.

#### `getUserAgent(): Promise<string>`

Gets the current user agent string.

#### `setUserAgent(userAgent: string): Promise<void>`

Sets a custom user agent string.

### Events

- **onLoad**: Preview loaded successfully
- **onError**: Error occurred during preview
- **onProgress**: Loading progress (0-100)

```typescript
interface WebPreviewError {
  code: string;
  message: string;
}
```

### Error Codes

`INVALID_URL`, `NETWORK_ERROR`, `TIMEOUT`, `NOT_AVAILABLE`, `UNKNOWN`

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
