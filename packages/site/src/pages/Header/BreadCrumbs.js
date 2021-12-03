import { NavLink } from "react-router-dom";
import React from "react";

const Caret = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.875 5.625L11.25 9L7.875 12.375"
      stroke="black"
      strokeOpacity="0.15"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function BreadCrumbs ({breadCrumbs = []}) {
  return <>
    <NavLink to={``}>Home</NavLink>
    {breadCrumbs.map((breadCrumb, index)=>{
      return <div key={index}>
        {Caret}
        <NavLink to={breadCrumb.to}>{breadCrumb.name}</NavLink>
      </div>;
    })}
  </>
}
