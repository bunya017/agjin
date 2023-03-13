import BackButton from 'components/BackButton.vue'
import NotFound404 from 'components/NotFound404.vue'
import ImageCropAndCompress from 'components/ImageCropAndCompress.vue'

// "async" is optional
export default async ({ app }) => {
  app.component('back-btn', BackButton)
  app.component('not-found', NotFound404)
  app.component('image-crop-and-compress', ImageCropAndCompress)
}
