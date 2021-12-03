import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import RelatedLinks from "./RelatedLinks";
import Detail from "./Detail";
import Proposals from "./Proposals";
import {
  setProjectDetail,
  fetchProjectDetail,
  projectDetailSelector,
} from "../../store/reducers/projectSlice";
import InformationTable from "./InformationTable";


const ProjectDetail = () => {
  const { projectId } = useParams();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjectDetail(projectId));
    return () => {
      dispatch(setProjectDetail({}));
    };
  }, [dispatch, projectId]);

  const projectDetail = useSelector(projectDetailSelector);

  const detailData = {
    name: projectDetail.name,
    logo: projectDetail.logo,
    description: projectDetail.description,
    proposals: projectDetail.proposals?.length,
    expense: projectDetail.proposals?.reduce(
      (previous, current) => previous + (current.amount ?? 0),
      0
    ),
    dollar: projectDetail.proposals
      ?.reduce(
        (previous, current) =>
          previous + (current.amount ?? 0) * (current.proposeTimePrice ?? 0),
        0
      )
      .toFixed(2)
      .replace(/\D00/, ""),
  };

  return (
    <>
      <Detail data={detailData} />
      <InformationTable data={detailData} projectData={projectDetail} />
      <RelatedLinks data={projectDetail.relatedLinks} />
      <Proposals data={projectDetail.proposals} />
    </>
  );
};

export default ProjectDetail;
