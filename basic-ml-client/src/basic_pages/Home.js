import React from "react";
import PageLayout from "../common/PageLayout";

function Home() {
  return (
    <PageLayout>
      <h1 className="page-layout__header">Welcome</h1>
      <p className="page-layout__content">
        Welcome to BasicML! The goal of this site is to help visualize basic
        machine learning concepts via interactive modules. BasicML's content is
        heavily based off of Andrew Ng's machine learning course on Coursera. In
        fact, the inspiration for this site came from a realization that I had
        forgotten most of what I had learned in the beginning of the course
        after finishing. By making this project, I was able to review the entire
        class again and create a persistent tool that I could use in case I need
        a refresher in the future&mdash;hopefully it can be equally helpful for
        you too!
        <br /> <br />
        There isn't really a "correct" way to use the site. The modules are very
        much designed to be sandboxes that help visualize the impact that
        various parameters, features, and training can have on a model. To get
        the most out of this site, an ideal user would have some primary
        knowledge of the various topics presented here, but as per the site's
        name, all the ideas are beginner-level. You could probably glean any
        requisite information from a blog post or wiki page found via a quick
        Google search.
        <br /> <br />
        As of now, this site is still a WIP. More modules are in the works
        (logistic regression, neural nets, and clustering to name a few). If you
        find any bugs or have suggestions, please visit the contact page.
        Feedback is always appreciated!
        <br />
        <br />
        <b>
          IMPORTANT: Due to the way the API is deployed, it may be asleep if you
          are the first person to use the site in a while. If generating data or
          submitting a form has seemingly no effect, please give it several
          seconds to wake up and try again.
        </b>
      </p>
    </PageLayout>
  );
}

export default Home;
