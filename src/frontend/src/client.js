import fetch from 'unfetch'

const checkStatus = (response) => {
  if (response.ok) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  return Promise.reject(error)
}

export const getAllReports = () => fetch('api/v1/report').then(checkStatus)

export const addNewReport = (report) =>
  fetch('api/v1/report', {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(report)
  }).then(checkStatus)

export const deleteReport = (reportId) =>
  fetch(`api/v1/report/${reportId}`, {
    method: 'DELETE'
  }).then(checkStatus)
