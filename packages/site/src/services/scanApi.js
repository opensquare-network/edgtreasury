import Api from "./api";

class ScanApi extends Api {}

export default new ScanApi(
  process.env.REACT_APP_SCAN_SERVER || "https://edg-api.dotreasury.com/"
);
