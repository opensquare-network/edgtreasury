import { createSlice } from "@reduxjs/toolkit";
import { getApi } from "../../services/chainApi";
import { TreasuryAccount } from "../../constants";
import { getPrecision, symbolFromNetwork, toPrecision } from "../../utils";

const burntSlice = createSlice({
  name: "burnt",
  initialState: {
    treasury: {
      free: 0,
      burnPercent: 0,
    },
  },
  reducers: {
    setTreasury(state, { payload }) {
      state.treasury = payload;
    },
  },
});

export const {
  setTreasury,
} = burntSlice.actions;


export const fetchTreasury = (chain) => async (dispatch) => {
  const api = await getApi(chain);
  const account = (await api.query.system.account(TreasuryAccount)).toJSON();
  const result = {
    free: account
      ? toPrecision(
          account.data.free,
          getPrecision(symbolFromNetwork(chain)),
          false
        )
      : 0,
    burnPercent: toPrecision(api.consts.treasury.burn, 6, false),
  };
  dispatch(setTreasury(result));
};

export const treasurySelector = (state) => state.burnt.treasury;

export default burntSlice.reducer;
