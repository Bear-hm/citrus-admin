// store.ts
import type { InjectionKey } from "vue";
// @ts-ignore
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  count: number;
  collapse: boolean;
  token: string;
  username: string;
  password: string;
}
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    count: 0,
    collapse: false,
    token: '',
    username: '',
    password: '',
  },
  mutations: {
    setCount(state: State, count: number) {
      state.count = count;
    },
    setCollapse(state: State, collapse: boolean) {
      state.collapse = collapse;
    },
    setToken(state: State, token: string) {
      state.token = token;
    },
    setUsername(state: State, username: string) {
      state.username = username;
    },
    setPassword(state: State, password: string) {
      state.password = password;
    },
  },
  getters: {
    getCount(state: State) {
      return state.count;
    },
    getCollapse(state: State) {
      return state.collapse;
    },
    getToken(state: State) {
      return state.token;
    },
    getUsername(state: State) {
      return state.username;
    },
    getPassword(state: State) {
      return state.password;
    },
  },
});

// 定义自己的 `useStore` 组合式函数
export function useStore() {
  return baseUseStore(key);
}
