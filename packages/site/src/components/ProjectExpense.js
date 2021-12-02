import React from "react";
import styled from "styled-components";
import { toLocaleStringWithFixed } from "../utils";

const ExpenseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.65);
  white-space: nowrap;
`;

const DollarWrapper = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  text-align: left;
`;

export default function ProjectExpense({ expense, dollar }) {
  const numberDollar = Number(dollar);
  return (
    <div>
      <ExpenseWrapper>
        {expense > 0 && <div>{`${expense.toLocaleString()} EDG`}</div>}
      </ExpenseWrapper>
      {!isNaN(numberDollar) && (
        <DollarWrapper>
          {`${numberDollar === 0 ? "" : "≈ "}$${toLocaleStringWithFixed(
            numberDollar,
            2
          )}`}
        </DollarWrapper>
      )}
    </div>
  );
}
