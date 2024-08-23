import { create } from "zustand";

interface DataGet {
  credViewCount: number;
  data: [];
  verifiedCount: number;
}

interface UserStoreState {
  credViewCount: number;
  data: [];
  verifiedCount: number;
  setData: ()=>{}
}

export const useUserStore = create<UserStoreState>((set) => ({
  data:  []
  credViewCount: 0,
  verifiedCount: 0,
  setData: ((data)=>{data})
}));

// export default useUserStore;
