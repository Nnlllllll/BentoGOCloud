import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <WebView
      source={{ uri: 'https://bentogo.me' }}
      style={{ flex: 1 }}
    />
  );
}