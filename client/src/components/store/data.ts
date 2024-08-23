import create from "zustand";

interface Data {
  _id: string; // MongoDB ObjectId as a string
  date: string; // Date in string format
  name: string;
  university: string;
  passyear: number;
  hashedAadhar: string;
  hash: string;
  courseProgram: string;
}

interface DataStore {
  data: Data[];
  open: boolean;
  isChanged: boolean;
  setChanged: (isChanged: boolean) => void;
  setData: (newData: Data[]) => void;
  addData: (newEntry: Data) => void;
  setOpen: (isOpen: boolean) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  data: [],
  open: false, // Initialize the 'open' state
  isChanged: false,

  setChanged: (isChanged) => set({ isChanged: isChanged }),
  setData: (newData) => set({ data: newData }),
  addData: (newEntry) => set((state) => ({ data: [...state.data, newEntry] })),
  setOpen: (isOpen) => set({ open: isOpen }), // Define the 'setOpen' action
}));
