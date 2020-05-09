import React from 'react'
import {Button, Table, TableBody, TableRow, TableCell, TableHeader, Box} from 'grommet'
import { A, navigate } from 'hookrouter'
import { hasPetSitterRole } from './duck-user'
import { Job, User } from './types'


interface Props {
  jobs?: Job[];
  deleteJob: Function;
  applyToJob: Function;
  editJob: Function;
  user: User;
}

function formatDate(str: string) {
  const d = new Date(str)
  const dtf = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' })
  const [{ value: mo },,{ value: da }] = dtf.formatToParts(d)
  return `${mo}-${da}`
}

function duration(starts: string, ends: string) {
  const first = new Date(starts).getTime()
  const second = new Date(ends).getTime()
  const days = Math.round((second-first)/(1000*60*60*24)) + 1;
  return days + (days > 1 ? ' days' : ' day')
}

interface JobRowProps {
  job: Job;
  deleteJob: Function;
  editJob: Function;
  applyToJob: Function;
  user: User;
}

function JobRow({job, deleteJob, applyToJob, editJob, user} : JobRowProps) {

  const {id, dog, starts_at, ends_at, activities=[], creator_user_id, worker_user_id } = job
  const startsAtStr = formatDate(starts_at)
  const endsAtStr = formatDate(ends_at)

  const withConfirm = (msg: string, action: Function, ...args: any[]) => () => {
    if(window.confirm(msg)) {
      action(...args)
    }
  }

  const isOwner = creator_user_id === user.id
  const isPetSitter = hasPetSitterRole(user)
  const alreadyApplied = worker_user_id === user.id

  return (
    <TableRow>

      <TableCell>
        <A href={`/jobs/${id}`}>#{id}</A>
      </TableCell>

      <TableCell>{dog?.name}</TableCell>

      <TableCell>{duration(starts_at, ends_at)}</TableCell>

      <TableCell>{startsAtStr} to {endsAtStr}</TableCell>

      <TableCell>{activities.join(',')}</TableCell>

      <TableCell gap="small" direction="row" >
        {isOwner ? (
          <Box direction="row" gap="small">
            <Button label="Edit" onClick={() => navigate(`/jobs/${id}`)} />
            <Button label="Delete" color="status-critical" onClick={withConfirm(`Are you sure you want to delete job #${id}`, deleteJob, id)} />
          </Box>
        ) : null }
        {isPetSitter ? (
          <Button label="Apply" disabled={alreadyApplied} primary onClick={withConfirm("Are you sure you want to apply to this Job?", applyToJob, id)} />
        ) : null }
      </TableCell>

    </TableRow>
  )

}

export default function Jobs(props: Props) {
  const { deleteJob, applyToJob, editJob,  user, jobs=[] } = props

  return (
    <Table>
      <TableHeader>
        <TableRow>

          <TableCell scope="col" border="bottom">
            Job ID
          </TableCell>

          <TableCell scope="col" border="bottom">
            Dog
          </TableCell>

          <TableCell scope="col" border="bottom">
            Duration
          </TableCell>

          <TableCell scope="col" border="bottom">
            Date
          </TableCell>

          <TableCell scope="col" border="bottom">
            Activities
          </TableCell>

          <TableCell scope="col" border="bottom">
          </TableCell>

        </TableRow>
      </TableHeader>
      <TableBody>

        {!jobs.length ? (
          <TableRow><TableCell> No Jobs! </TableCell></TableRow>
        ) : null }

        {jobs.map(job => <JobRow
                           key={job.id}
                           job={job}
                           editJob={editJob}
                           deleteJob={deleteJob}
                           applyToJob={applyToJob}
                           user={user}
                         />)}

      </TableBody>
    </Table>
  )
}
