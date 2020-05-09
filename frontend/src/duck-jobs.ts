import { Dispatcher, Message } from './types'
import { setError } from './duck-error'
import {userId} from './duck-user'
import Api from './api'
import { JobsPage, Jobs, Job, JobApplication, JobApplicationStatus } from './types'

// Actions
const SET_MY_JOBS = 'jobs/SET-MY-JOBS';
const SET_JOB_APPLICATIONS = 'jobs/SET-JOB-APPLICATIONS';
const SET_CURRENT = 'jobs/SET-CURRENT';
const SET_PAGE = 'jobs/SET-PAGE';

// Reducer
export default function reducer(state: Jobs = {}, action: Message<any> = {}) : Jobs {
  switch (action.type) {
    case SET_MY_JOBS:
      // Perform action
      return {...state, myJobs: action.payload};
    case SET_JOB_APPLICATIONS:
      // Perform action
      return {...state, currentApplications: action.payload};
    case SET_CURRENT:
      // Perform action
      return {...state, current: action.payload};
    case SET_PAGE:
      // Perform action
      return {...state, jobsPage: action.payload};
    default: return state;
  }
}

// Action Creators
export function setMyJobs(jobs: Job[]) : Message<Job[]> {
  return { type: SET_MY_JOBS, payload: jobs };
}

export function setJobApplications(ja: JobApplication[]) : Message<JobApplication[]> {
  return { type: SET_JOB_APPLICATIONS, payload: ja};
}

export function getNextPage() : Dispatcher {
  return (dispatch) => {
    Api.getNextJobsPage().then(jobsPage => {
      dispatch(setPage(jobsPage))
    }).catch(err => {
      dispatch(setError(err))
    })
  }
}


export function getMyJobs() : Dispatcher {
  return (dispatch) => {
    Api.getMyJobs().then(jobs => {
      dispatch(setMyJobs(jobs))
    }).catch(err => {
      dispatch(setError(err))
    })
  }
}

export function applyToJob(id: string)  : Dispatcher {
  return async (dispatch) => {
    return Api.applyToJob(id)
      .catch(err => dispatch(setError(err)))
  }
}

export function createJob(job: Job) : Dispatcher {
  return async (dispatch) => {
    return Api.createJob(job).catch(err => dispatch(setError(err)))
  }
}

export function updateJob(jobId: string, job: Job) : Dispatcher {
  return async (dispatch) => {
    return Api.updateJob(jobId, job).catch(err => dispatch(setError(err)))
  }
}


export function deleteJob(id: string) : Dispatcher {
  return async (dispatch) => {
    return Api.deleteJob(id).catch(err => dispatch(setError(err)))
  }
}

export function fetchJob(id: string) : Dispatcher {
  return async (dispatch) => {
    return Api.fetchJob(id)
      .then((job: Job) => {
        dispatch(setCurrent(job))
        return job
      })
      .catch(err => dispatch(setError(err)))
  }
}

export function fetchMyJobApplications() : Dispatcher {
  return async (dispatch) => {
    return Api.fetchMyJobApplications()
      .then((ja: JobApplication[]) => {
        dispatch(setJobApplications(ja))
      })
      .catch(err => dispatch(setError(err)))
  }
}


export function acceptDenyJobApplication(id: string,  status: JobApplicationStatus) : Dispatcher {
   return async (dispatch) => {
    return Api.acceptDenyJobApplication(id, status)
      .catch(err => dispatch(setError(err)))
  }
}

export function setCurrent(job: Job) : Message<Job> {
  return { type: SET_CURRENT, payload: job };
}

export function setPage(jobsPage: JobsPage) : Message<JobsPage> {
  return { type: SET_PAGE, payload: jobsPage };
}


export function deleteJobApplication(jobId: string) : Dispatcher {
  return async () => {
    return Api.deleteJobApplication(jobId)
  }
}
