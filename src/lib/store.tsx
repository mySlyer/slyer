import { createContext, ReactNode, useContext, useMemo } from 'react';
import { proxy, useSnapshot } from 'valtio';
import { GeckoPkg } from './types/gecko';

class GlobalStore {
  selectedGeckoPkg: GeckoPkg | null = null;
}

let store: GlobalStore;

export const StoreContext = createContext<GlobalStore | undefined>(undefined);

export function initializeStore(initialData?: Partial<GlobalStore>) {
  const _store = store ?? proxy(new GlobalStore());

  if (initialData) {
    Object.entries(initialData).forEach(([key, value]) => {
      (_store as any)[key] = value;
    });
  }
  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
}

export function StoreProvider({
  children,
  initialState: initialData,
}: {
  children: ReactNode;
  initialState?: Partial<GlobalStore>;
}) {
  const store = initializeStore(initialData);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within StoreProvider');
  }

  return context;
}

export function useStoreSnap() {
  const store = useStore();
  return useSnapshot(store);
}

export function useActions() {
  const store = useStore();
  const actions = useMemo(
    () => ({
      setGeckoPkg(geckoPkg: GeckoPkg | null) {
        store.selectedGeckoPkg = geckoPkg;
      },
    }),
    [store],
  );
  return actions;
}
