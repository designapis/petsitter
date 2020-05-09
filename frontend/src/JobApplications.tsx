import React from 'react'
import {Button, Box, Table, TableBody, TableRow, TableCell, TableHeader} from 'grommet'
import { A } from 'hookrouter'
import { JobApplication, User } from './types'

interface JobApplicationRowProps {
  jobApplication: JobApplication;
  key: string;
  deny: Function;
  accept: Function;
  deleteJobApplication: Function;
  user: User;
}

export function JobApplicationRow(rowProps: JobApplicationRowProps) {

  const {jobApplication, deny, accept, deleteJobApplication, user} = rowProps
  const { job_id, user_id, status} = jobApplication

  // Hacky
  const isOwner = user_id !== user.id

  return (
    <TableRow>

      <TableCell>
        <A href={`/jobs/${job_id}`}>#{job_id}</A>
      </TableCell>

      <TableCell>{status}</TableCell>

      <TableCell gap="small" direction="row">
      {isOwner ? (
        <Box direction="row" gap="small">
          <Button label="Accept" primary onClick={() => accept()} />
          <Button label="Deny" onClick={() => deny()} />
        </Box>
      ) : (
        <Box direction="row" gap="small">
          <Button label="Cancel" color='status-critical' onClick={() => deleteJobApplication()} />
        </Box>
      )}
      </TableCell>

    </TableRow>
  )

}


interface Props {
  jobApplications?: JobApplication[];
  acceptDenyJobApplication: Function;
  deleteJobApplication: (jobId: string) => void;
  user: User;
}

export default function JobApplicationsComp (props: Props) {
  const { jobApplications = [], acceptDenyJobApplication, deleteJobApplication, user} = props

  return (
    <Box gap="medium" fill="horizontal" align="center" pad="medium">

      <Table>
        <TableHeader>
          <TableRow>

            <TableCell scope="col" border="bottom">
              Job ID
            </TableCell>

            <TableCell scope="col" border="bottom">
              Status
            </TableCell>

            <TableCell scope="col" border="bottom">
            </TableCell>

          </TableRow>
        </TableHeader>
        <TableBody>

          {
            jobApplications.map(job => (
              <JobApplicationRow
                jobApplication={job}
                user={user}
                key={job.id || ''}
                deny={() => acceptDenyJobApplication(job.id, 'DENIED')}
                deleteJobApplication={() => deleteJobApplication(job.id as string)}
                accept={() => acceptDenyJobApplication(job.id, 'ACCEPTED')}
              />
            ))
          }

        </TableBody>
      </Table>
    </Box>
  )

}
