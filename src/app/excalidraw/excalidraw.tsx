'use client';

import { useTheme } from 'next-themes';
import {
  Excalidraw,
  MainMenu,
  WelcomeScreen,
  useHandleLibrary,
} from '@bytedance-dev/excalidraw';
import '@bytedance-dev/excalidraw/index.css';
import { useState } from 'react';

export default function ExcalidrawComp() {
  const { theme } = useTheme();

  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  useHandleLibrary({ excalidrawAPI });

  return (
    <Excalidraw theme={theme as any} excalidrawAPI={setExcalidrawAPI}>
      <WelcomeScreen />
      <MainMenu>
        <MainMenu.DefaultItems.LoadScene />
        <MainMenu.DefaultItems.SaveToActiveFile />
        <MainMenu.DefaultItems.Export />
        <MainMenu.DefaultItems.SaveAsImage />
        <MainMenu.DefaultItems.Help />
        <MainMenu.DefaultItems.ClearCanvas />
        <MainMenu.Separator />
        <MainMenu.DefaultItems.ChangeCanvasBackground />
      </MainMenu>
    </Excalidraw>
  );
}
