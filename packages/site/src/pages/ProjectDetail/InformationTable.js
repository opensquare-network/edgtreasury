import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { Button, Icon, Modal, Form } from "semantic-ui-react";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import User from "../../components/User";
import Balance from "../../components/Balance";
import { useIsAdmin } from "../../utils/hooks";
import { proposalDetailSelector } from "../../store/reducers/proposalSlice";
import {
  descriptionSelector,
  putDescription,
} from "../../store/reducers/descriptionSlice";
import { nowAddressSelector } from "../../store/reducers/accountSlice";
import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";

const IconButton = styled(Icon)`
  margin-left: 6px !important;
  cursor: pointer;
`;

const DescriptionWrapper = styled.div`
  overflow-wrap: break-word;
`;

const StyledTable = styled(Table)`
  table-layout: fixed;
`;

const InformationTable = ({data,  projectData }) => {
  const { name, logo, description, dollar } = data;

  const {
    expenseDot,
    expenseKsm,
    dotProposalsCount,
    ksmProposalsCount,
  } = projectData;



  return (
    <>
      <TableLoading>
        <StyledTable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                Information
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Proposal"}>
                  <ProjectProposals
                    dotProposalsCount={dotProposalsCount}
                    ksmProposalsCount={ksmProposalsCount}
                  />
                </TableCell>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Expense"} justify={"start"}>
                  <ProjectExpense
                    expenseDot={expenseDot}
                    expenseKsm={expenseKsm}
                    dollar={dollar}
                  />
                </TableCell>
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </StyledTable>
      </TableLoading>
    </>
  );
};

export default InformationTable;
