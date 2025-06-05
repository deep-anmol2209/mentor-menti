import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { USER_STORE_PERSIST } from '../const';

const useUserStore = create(
  persist(
    devtools((set) => ({
      user: null,
      setUser: (user) => set(() => ({ user })),
      
    })),
    {
      name: USER_STORE_PERSIST,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useUserStore;
