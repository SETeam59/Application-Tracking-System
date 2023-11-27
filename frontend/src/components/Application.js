import {useState} from 'react'
import AddEditApplicationModal from '../modals/AddEditApplicationModal'
import DeleteModal from '../modals/DeleteModal'
import { deleteApplication } from '../api/applicationHandler'
import { addColumn } from '../api/boardsHandler';

const Application = ({ application, setAppls }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  console.log(application)

  const handleDeleteButtonClick = (applId) => {
    deleteApplication(applId)
  }

  const handleApplComplete = (applId) => {
    setAppls(prevappls => prevappls.filter(appl => appl._id !== applId))
    addColumn({name: "Applied", boardid: application.board, tasks: [{
      title: application.jobTitle,
      description: `Job at ${application.companyName}`,
      subtasks: [],
      status: "Applied"
    }]})
    // deleteApplication(applId)
  }

  return (
  <div className="w-full" style={{minWidth: "78vw"}}>
      <div className="w-full flex flex-col justify-between items-center first:my-5 rounded-lg bg-white dark:bg-[#2b2c37] shadow-[#364e7e1a] py-6 px-6 shadow-lg dark:text-white lg:flex-row gap-x-10">
        <div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Job Title: </p><p className="">{application.jobTitle}</p>
          </div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Company Name: </p><p className="">{application.companyName}</p>
          </div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Job Application Link: </p><p className="">{application.jobLink}</p>
          </div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Job Location: </p><p className="">{application.location}</p>
          </div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Application Status: </p><p className="">{application.status ? "Applied" : "Not Applied"}</p>
          </div>
          <div className='flex gap-2'>
            <p className="font-extrabold tracking-wide mb-2">Application Date: </p><p className="">{application.date}</p>
          </div>
        </div>

        <div className="flex md:flex-col sm:flex-row gap-6 items-center">
          <button className="button md:block h-min" onClick={() => handleApplComplete(application._id)}>
            Mark as applied
          </button>
          <div className="flex gap-6">
            <span className="cursor-pointer"
              onClick={() => {
                setIsApplicationModalOpen(true)
              }}
            >
              &#9998;
            </span>
            <span className="cursor-pointer"
              onClick={() => {
                setIsDeleteModalOpen(true)
              }}
            >
              &#128465;
            </span>
          </div>
        </div>
      </div>

      {isApplicationModalOpen && (
        <AddEditApplicationModal
          setAppls={setAppls}
          setIsApplicationModalOpen={setIsApplicationModalOpen}
          type={'edit'}
          application={application}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteModal
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          type="application"
          title={application.jobTitle}
          onDeleteBtnClick={() => handleDeleteButtonClick(application._id)}
        />
      )}
    </div>
  );
};

export default Application;
