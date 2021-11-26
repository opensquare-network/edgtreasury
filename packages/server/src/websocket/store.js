const data = {
  scanHeight: 0,
  overview: null,
};

function setScanHeight(height) {
  data.scanHeight = height;
}

function getScanHeight() {
  return data.scanHeight;
}

function setOverview(arg) {
  data.overview = arg;
}

function getOverview() {
  return data.overview;
}

module.exports = {
  setScanHeight,
  getScanHeight,
  setOverview,
  getOverview,
};
