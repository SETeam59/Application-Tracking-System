import React, { useEffect } from "react";
import Application from "../components/Application";
import { getApplications } from "../api/applicationHandler";

const Applications = ({appls, setAppls}) => {
  useEffect(() => {
      getApplications().then(res => setAppls(res)).catch(err => console.log(err))
  }, [setAppls])

  return (
    <div className="flex flex-1 flex-col mt-20 mr-6 ml-0 md:ml-0 sm:ml-6">
      {appls.length === 0 && <h1 className="md:text-2xl md:inline-block font-bold font-sans">You do not have any applications</h1>}
      {appls.map((application, index) => (
        <Application key={application.id} application={application} setAppls={setAppls} />
      ))}
    </div>
  );
};

export default Applications;
