const specialDataArr = [
  {
    height: 5513451,
    details: {
      transfer: '0',
      minting: '62000000000000000000',
      stakingRemainder: '0',
      stakingSlash: '0',
      idSlash: '0',
      democracySlash: '0',
      others: '9280000100000000',
    }
  },
  {
    height: 5513642,
    details: {
      transfer: '0',
      minting: '62000000000000000000',
      stakingRemainder: '0',
      stakingSlash: '0',
      idSlash: '0',
      democracySlash: '0',
      others: '11360000100000000',
    }
  },
  {
    height: 5513648,
    details: {
      transfer: '0',
      minting: '62000000000000000000',
      stakingRemainder: '0',
      stakingSlash: '0',
      idSlash: '0',
      democracySlash: '0',
      others: '11360000100000000',
    }
  },
  {
    height: 5513733,
    details: {
      transfer: '0',
      minting: '62000000000000000000',
      stakingRemainder: '0',
      stakingSlash: '0',
      idSlash: '0',
      democracySlash: '0',
      others: '8640000100000000',
    }
  },
  {
    height: 5865185,
    details: {
      transfer: '0',
      minting: '62000000000000000000',
      stakingRemainder: '0',
      stakingSlash: '0',
      idSlash: '0',
      democracySlash: '0',
      others: '11040000100207346',
    }
  },
]

const specialHeights = specialDataArr.map(data => data.height);

module.exports = {
  specialHeights,
  specialDataArr,
}
