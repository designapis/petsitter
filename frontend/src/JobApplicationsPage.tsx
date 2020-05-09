import { Box, Heading } from 'grommet'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import JobApplications from './JobApplications'
import { RootState, JobApplication, User } from './types'
import {fetchMyJobApplications, acceptDenyJobApplication, deleteJobApplication} from './duck-jobs'

interface Props {
  jobApplications?: JobApplication[];
  fetchMyJobApplications: Function;
  acceptDenyJobApplication: Function;
  deleteJobApplication: Function;
  user: User;
}

export function JobApplicationsPage(props: Props) {

  const { jobApplications=[], fetchMyJobApplications, acceptDenyJobApplication, deleteJobApplication, user} = props

  useEffect(() => {
    fetchMyJobApplications()
  },[fetchMyJobApplications])

  const acceptDenyJobApplicationThenReload = (...props: any[]) => {
    acceptDenyJobApplication(...props).then(() => {
      fetchMyJobApplications()
    })
  }

  const confirmThenDeleteJobApplication = (jobId: string) =>  {
    if(window.confirm(`Are you sure you want to delete the Job Application ${jobId}`)) {
      deleteJobApplication(jobId).then(() => {
        fetchMyJobApplications()
      })
    }
  }

  return (
    <Box gap="medium" fill="horizontal" align="center" pad="medium">
      <Heading level={3}>Pending Job Applications</Heading>
      <JobApplications
        user={user}
        jobApplications={jobApplications}
        acceptDenyJobApplication={acceptDenyJobApplicationThenReload}
        deleteJobApplication={confirmThenDeleteJobApplication}
      />
    </Box>
  )
}

export default connect((state: RootState) => {
  return {
    jobApplications: state.jobs.currentApplications,
    user: state.user,
  }
}, {
  fetchMyJobApplications,
  acceptDenyJobApplication,
  deleteJobApplication,
})(JobApplicationsPage)
