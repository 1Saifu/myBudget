"use client";

import React from "react";
import Navbar from '../../components/layout/Navbar';
import ChartComponent from "../../components/chart/categoryChart";

const ChartPage: React.FC = () => {
  return (
    <div>
      <Navbar />
      <ChartComponent />
    </div>
  );
};

export default ChartPage;
