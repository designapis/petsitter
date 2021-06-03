import fetch from 'isomorphic-fetch'
import { User, JobsPage, Job, JobApplication, Session } from './types'


const ME = '%40me';

export class PetSitterAPI {
  url: string;
  token?: string;

// @me - a magic ID that refers to the user idenitifed by the Authorization header
  ME = ME;

  constructor(url: string) {
    this.url = url
  }

  setAuthHeader(token?: string) {
    this.token = token
  }

  clearAuthHeader() {
    this.token = ''
  }

  headers(emptyBody?: boolean) : Headers {
    const headers = new Headers({
      "Authorization": `${this.token}`
    })
    if(!emptyBody)
      headers.append("Content-Type", 'application/json')
    return headers
  }

  async createUser(user: User) : Promise<Response> {
    return fetch(`${this.url}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        'content-type': 'application/json',
      },
    })
  }

  async updateUser(user: User) : Promise<User> {
    const writeableUser: User = {
      email: user.email,
      full_name: user.full_name,
      password: user.password,
      roles: user.roles,
    }

    return fetch(`${this.url}/users/${ME}`, {
      method: 'PUT',
      body: JSON.stringify(writeableUser),
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async deleteUser(id: string = ME) : Promise<any> {
    return fetch(`${this.url}/users/${id}`, {
      method: 'DELETE',
      headers: this.headers(true),
    })
  }

  async getUser(id: string, user?: User) : Promise<User> {
    return fetch(`${this.url}/users/${id}`, {
      headers: this.headers(),
    }).then((res: Response) => {
      if(res.status !== 200)
        throw new Error(`Failed to fetch user ${id}`)
      return res.json()
    })
  }

  async getNextJobsPage() : Promise<JobsPage> {
    return fetch(`${this.url}/jobs`, {
      headers: this.headers()
    }).then((res: Response) => res.json())
  }

  async getMyJobs() : Promise<Job[]> {
    return fetch(`${this.url}/users/${ME}/jobs`, {
      headers: this.headers()
    }).then((res: Response) => res.json())
  }

  async updateJob(jobId: string, job: Job) : Promise<Job> {
    return fetch(`${this.url}/jobs/${jobId}`, {
      method: 'PUT',
      body: JSON.stringify(job),
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async deleteJob(id: string) : Promise<any> {
    return fetch(`${this.url}/jobs/${id}`, {
      method: 'DELETE',
      headers: this.headers(true),
    })
  }

  async fetchJobApplictaions(jobId: string) : Promise<JobApplication[]> {
    return fetch(`${this.url}/jobs/${jobId}/applications`, {
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async deleteJobApplication(id: string) : Promise<void> {
    return fetch(`${this.url}/job-applications/${id}`, {
      method: 'DELETE',
      headers: this.headers()
    }).then((res: Response) => {
      if((res.status+'')[0] !== '2')
        throw new Error(`Failed to delete Job Application ${id}`)
    })
  }

  async createJob(job: Job) : Promise<Job> {
    return fetch(`${this.url}/jobs`, {
      method: 'POST',
      body: JSON.stringify(job),
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async fetchJob(id: string) : Promise<Job> {
    return fetch(`${this.url}/jobs/${id}`, {
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async fetchMyJobApplications() : Promise<JobApplication[]> {
    return fetch(`${this.url}/users/${ME}/job-applications`, {
      headers: this.headers(),
    }).then((res: Response) => res.json())
  }

  async acceptDenyJobApplication(id: string, status: 'ACCEPTED' | 'DENIED') : Promise<any> {
    return fetch(`${this.url}/job-applications/${id}`, {
      method: 'PUT',
      headers: this.headers(),
      body: JSON.stringify({
        status
      }),
    }).then((res: Response) => res.json())
  }

  async applyToJob(id: string) : Promise<any> {
    return fetch(`${this.url}/jobs/${id}/job-applications`, {
      method: 'POST',
      headers: this.headers(),
      body: JSON.stringify({
        status: "APPLYING"
      }),
    })
  }

  async createSession(email?: string, password?: string) : Promise<Session> {
    return fetch(`${this.url}/sessions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      }),
    }).then((res: Response) => {
      if(!res.ok)
        throw new Error(`Failed to login user ${email}`)
      return res.json()
    })
  }
}

const instance = new PetSitterAPI('/api')
// Used to extend the Window object

declare global {
    interface Window { api: any; }
}
window.api = instance

export default instance
