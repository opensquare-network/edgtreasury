import React from "react";
import styled from "styled-components";

import Table from "../../components/Table";
import TableLoading from "../../components/TableLoading";
import TableCell from "../../components/TableCell";
import ProjectProposals from "../../components/ProjectProposals";
import ProjectExpense from "../../components/ProjectExpense";

const StyledTable = styled(Table)`
  table-layout: fixed;
`;

const InformationTable = ({data,  projectData }) => {
  const { dollar } = data;

  const {
    expense,
    proposalsCount,
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
                  <ProjectProposals proposalsCount={proposalsCount} />
                </TableCell>
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>
                <TableCell title={"Expense"} justify={"start"}>
                  <ProjectExpense expense={expense} dollar={dollar} />
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
