import React from "react";
import PageLayout from './PageLayout'

function NoPage() {
  return (
    <PageLayout>
      <h1 className="page-layout__header">Oops! This page doesn't exist.</h1>
      <p className="page-layout__content">Please click on any of the pages in the navigation bar</p>
    </PageLayout>
  );
}

export default NoPage;
