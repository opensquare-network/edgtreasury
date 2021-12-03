import { createSlice } from "@reduxjs/toolkit";
import api from "../../services/scanApi";

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    democracySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    democracySlashListLoading: false,
    identitySlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    identitySlashListLoading: false,
    stakingSlashList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    stakingSlashListLoading: false,
    inflationList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    inflationListLoading: false,
    transferListLoading: false,
    transferList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    othersIncomeList: {
      items: [],
      page: 0,
      pageSize: 10,
      total: 0,
    },
    othersIncomeListLoading: false,
    count: {
      democracySlash: 0,
      identitySlash: 0,
      stakingSlash: 0,
      inflation: 0,
      others: 0,
      transfer: 0,
    },
  },
  reducers: {
    setCount(state, { payload }) {
      state.count = payload;
    },
    setDemocracySlashList(state, { payload }) {
      state.democracySlashList = payload;
    },
    setDemocracySlashListLoading(state, { payload }) {
      state.democracySlashListLoading = payload;
    },
    setIdentitySlashList(state, { payload }) {
      state.identitySlashList = payload;
    },
    setIdentitySlashListLoading(state, { payload }) {
      state.identitySlashListLoading = payload;
    },
    setStakingSlashList(state, { payload }) {
      state.stakingSlashList = payload;
    },
    setStakingSlashListLoading(state, { payload }) {
      state.stakingSlashListLoading = payload;
    },
    setInflationList(state, { payload }) {
      state.inflationList = payload;
    },
    setInflationListLoading(state, { payload }) {
      state.inflationListLoading = payload;
    },
    setOthersIncomeList(state, { payload }) {
      state.othersIncomeList = payload;
    },
    setOthersIncomeListLoading(state, { payload }) {
      state.othersIncomeListLoading = payload;
    },
    setTransferList(state, { payload }) {
      state.transferList = payload;
    },
    setTransferListLoading(state, { payload }) {
      state.transferListLoading = payload;
    },
  },
});

export const {
  setCount,
  setDemocracySlashList,
  setDemocracySlashListLoading,
  setIdentitySlashList,
  setIdentitySlashListLoading,
  setStakingSlashList,
  setStakingSlashListLoading,
  setInflationList,
  setInflationListLoading,
  setOthersIncomeList,
  setOthersIncomeListLoading,
  setTransferList,
  setTransferListLoading,
} = incomeSlice.actions;

export const fetchIncomeCount = () => async (dispatch) => {
  const { result } = await api.fetch(`/income/count`);
  dispatch(
    setCount(
      result || {
        democracySlash: 0,
        identitySlash: 0,
        stakingSlash: 0,
        inflation: 0,
        others: 0,
        transfer: 0,
      }
    )
  );
};


export const fetchDemocracySlashList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setDemocracySlashListLoading(true));

    try {
      const { result } = await api.fetch(`/income/slash/democracy`, {
        page,
        pageSize,
      });
      dispatch(
        setDemocracySlashList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setDemocracySlashListLoading(false));
    }
  };

export const fetchIdentitySlashList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setIdentitySlashListLoading(true));

    try {
      const { result } = await api.fetch(`/income/slash/identity`, {
        page,
        pageSize,
      });
      dispatch(
        setIdentitySlashList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setIdentitySlashListLoading(false));
    }
  };

export const fetchStakingSlashList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setStakingSlashListLoading(true));

    try {
      const { result } = await api.fetch(`/income/slash/staking`, {
        page,
        pageSize,
      });
      dispatch(
        setStakingSlashList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setStakingSlashListLoading(false));
    }
  };

export const fetchInflationList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setInflationListLoading(true));

    try {
      const { result } = await api.fetch(`/income/inflation`, {
        page,
        pageSize,
      });
      dispatch(
        setInflationList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setInflationListLoading(false));
    }
  };

export const fetchTransferList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setTransferListLoading(true));

    try {
      const { result } = await api.fetch(`/income/transfer`, {
        page,
        pageSize,
      });
      dispatch(
        setTransferList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setTransferListLoading(false));
    }
  };

export const fetchOthersIncomeList =
  (page = 0, pageSize = 30) =>
  async (dispatch) => {
    dispatch(setOthersIncomeListLoading(true));

    try {
      const { result } = await api.fetch(`/income/others`, {
        page,
        pageSize,
      });
      dispatch(
        setOthersIncomeList(
          result || {
            items: [],
            page: 0,
            pageSize: 10,
            total: 0,
          }
        )
      );
    } finally {
      dispatch(setOthersIncomeListLoading(false));
    }
  };

export const incomeCountSelector = (state) => state.income.count;
export const democracySlashListSelector = (state) =>
  state.income.democracySlashList;
export const democracySlashListLoadingSelector = (state) =>
  state.income.democracySlashListLoading;
export const identitySlashListSelector = (state) =>
  state.income.identitySlashList;
export const identitySlashListLoadingSelector = (state) =>
  state.income.identitySlashListLoading;
export const stakingSlashListSelector = (state) =>
  state.income.stakingSlashList;
export const stakingSlashListLoadingSelector = (state) =>
  state.income.stakingSlashListLoading;
export const inflationListSelector = (state) => state.income.inflationList;
export const inflationListLoadingSelector = (state) =>
  state.income.inflationListLoading;
export const othersIncomeListSelector = (state) =>
  state.income.othersIncomeList;
export const othersIncomeListLoadingSelector = (state) =>
  state.income.othersIncomeListLoading;
export const transferListSelector = (state) => state.income.transferList;
export const transferListLoadingSelector = (state) =>
  state.income.transferListLoading;

export default incomeSlice.reducer;
