// AppEntry.tsx
import React from 'react';
import { AppRegistry } from 'react-native';
import { App } from './app/page'; // Adjust path to your app/page.tsx

// Register the app entry point
AppRegistry.registerComponent('main', () => App);

export default async function Page() {
  return (
    <div className="flex items-center justify-center h-screen">
      Hello Cinema Guru
    </div>
  );
}
