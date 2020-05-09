import { Box, Heading, Button } from 'grommet'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import Jobs from './Jobs'
import { navigate } from 'hookrouter'
import { RootState, JobsPage, User } from './types'
import { getNextPage, deleteJob, applyToJob } from './duck-jobs'

interface Props {
  jobsPage?: JobsPage;
  user: User;
  getNextPage: Function;
  deleteJob: Function;
  applyToJob: Function;
}

export function JobsPageComponent(props: Props) {

  const { jobsPage, getNextPage, applyToJob, deleteJob, user } = props
  const jobs = jobsPage?.items

  const editJob = (id: string) => navigate(`/jobs/${id}`)

  useEffect(() => {
    getNextPage()
  },[getNextPage])

  return (
    <Box gap="medium" fill="horizontal" align="center" pad="medium">
      <Heading level={3}>All Jobs</Heading>

      <Jobs
        jobs={jobs}
        user={user}
        applyToJob={applyToJob}
        deleteJob={deleteJob}
        editJob={editJob}
      />
    </Box>
  )
}

export default connect((state: RootState) => {
  return {
    jobsPage: state.jobs.jobsPage,
    user: state.user,
  }
}, {
  getNextPage,
  deleteJob,
  applyToJob,
})(JobsPageComponent)
