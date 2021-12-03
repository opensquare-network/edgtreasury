import { combineReducers } from "@reduxjs/toolkit";
import tipsReducer from "./tipSlice";
import proposalsReducer from "./proposalSlice";
import bountiesReducer from "./bountySlice";
import burntReducer from "./burntSlice";
import chainReducer from "./chainSlice";
import linksReducer from "./linkSlice";
import accountReducer from "./accountSlice";
import overviewReducer from "./overviewSlice";
import incomeReducer from "./incomeSlice";
import menuReducer from "./menuSlice";
import nodeReducer from "./nodeSlice";
import projectsReducer from "./projectSlice";
import toastReducer from "./toastSlice";
import descriptionReducer from "./descriptionSlice";

export default combineReducers({
  tips: tipsReducer,
  links: linksReducer,
  proposals: proposalsReducer,
  bounties: bountiesReducer,
  burnt: burntReducer,
  chain: chainReducer,
  account: accountReducer,
  overview: overviewReducer,
  toast: toastReducer,
  income: incomeReducer,
  menu: menuReducer,
  node: nodeReducer,
  projects: projectsReducer,
  description: descriptionReducer,
});
