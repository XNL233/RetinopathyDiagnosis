import { post } from '../utils/request'

export const uploadMedicalData = (data) => {
  return post('/upload/medical-data', data)
}

export const uploadImage = (formData) => {
  return post('/upload/image', formData)
}

export const uploadVideo = (formData) => {
  return post('/upload/video', formData)
}

export const uploadText = (formData) => {
  return post('/upload/text', formData)
}

export const getEncryptionMethods = () => {
  return post('/encryption/methods')
}

export const verifyUpload = (uploadId) => {
  return post(`/upload/verify/${uploadId}`)
}
