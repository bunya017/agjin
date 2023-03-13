<template>
  <q-card flat bordered class="q-pa-sm">
    <q-card-section v-if="showCamera" class="row q-pa-none justify-center rounded-borders">
      <q-card flat bordered class="col-12 text-center q-pa-sm">
        <video class="full-width" ref="player" autoplay></video>
        <div class="q-pt-sm q-gutter-x-sm">
          <q-btn outline round color="grey-8" icon="close" @click="closeCamera" />
          <canvas ref="canvas" class="hidden" width=640 height=480></canvas>
          <q-btn outline round color="primary" icon="camera" @click="snapImage" />
        </div>
      </q-card>
    </q-card-section>
    <!-- Image Input -->
    <q-card-section v-else class="row q-pa-none">
      <div class="col-12">
        <q-file
          outlined
          ref="imagePayload"
          label="Select Image"
          accept=".jpg, image/*"
          v-model="imagePayload"
          :loading="pickImageLoading"
          :disable="loading || pickImageLoading"
          @update:model-value="attachAndResizeImage"
        />
        <div v-show="$q.platform.is.desktop">
          <div v-if="hideCameraBtn === false" class="text-h5 text-center text-grey-8 q-py-sm">OR</div>
          <q-btn
            no-caps
            outline
            color="primary"
            icon="mdi-webcam"
            class="full-width"
            label="Use Webcam"
            @click="openCamera"
            v-if="hideCameraBtn === false"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-section v-if="(image.src !== '') || pickImageLoading" class="row justify-center q-px-none q-pt-sm q-pb-none">
      <div v-if="cropped" class="col-9">
        <q-card flat bordered class="w300">
          <q-img
            :src="imageDisplayPayload"
            :ratio="350/466"
          />
          <q-card-actions>
            <q-btn
              outline
              class="full-width"
              color="grey-8"
              label="Discard Image"
              @click="reset"
            />
          </q-card-actions>
        </q-card>
      </div>
      <div v-else :class="[$q.screen.lt.sm  ? 'col-12' : 'col-9']">
        <q-card
          flat
          bordered
          :class="[
            $q.screen.lt.sm  ? 'w300' : '',
            pickImageLoading ? 'q-pa-lg' : 'q-pa-sm'
          ]"
        >
          <cropper
            ref="cropper"
            :src="image.src"
            class="upload-example-cropper"
            :stencil-props="{
              handlers: {},
              movable: false,
              scalable: false,
              aspectRatio: 262.5/349.5
            }"
            :resize-image="{
              adjustStencil: false
            }"
            image-restriction="stencil"
            default-boundaries="fit"
          />
          <q-card-actions v-if="(image.src !== '')" class="row q-pt-sm">
            <q-btn
              outline
              class="col-5"
              color="grey-8"
              label="Reset"
              @click="reset"
            />
            <q-space />
            <q-btn
              outline
              label="Crop"
              class="col-5"
              @click="crop"
              color="primary"
            />
          </q-card-actions>
          <q-inner-loading :showing="pickImageLoading">
            <q-spinner-gears size="50px" color="primary" />
            <div class="text-body1">Processing image...</div>
          </q-inner-loading>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from 'vue'
import imageCompression from 'browser-image-compression'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';

export default defineComponent({
  name: 'ImageCropAndCompress',
  components: { cropper: Cropper },
  emits: ['crop', 'discard'],
  data () {
    return {
      cropped: false,
      loading: false,
      showCamera: false,
      imagePayload: null,
      hideCameraBtn: false,
      imageDisplayPayload: '',
      finalImagePayload: null,
      pickImageLoading: false,
      image: {
        src: '',
        type: ''
      },
    }
  },
  props: {},
  computed: {},
  methods: {
    async attachAndResizeImage (payload) {
      this.hideCameraBtn = true
      this.pickImageLoading = true
      if (this.imagePayload.size > 256000) {
        const options = {
          maxSizeMB: 0.25,
          useWebWorker: false
        }
        const compressedPayload = await imageCompression(payload, options)
        const resizedImagePayload = new File(
          [compressedPayload],
          payload.name,
          {
            lastModified: new Date().getTime(),
            type: compressedPayload.type
          }
        )
        const blob = URL.createObjectURL(resizedImagePayload)
        this.image = {
          src: blob,
          type: payload.type
        }
        this.imagePayload = resizedImagePayload
        this.pickImageLoading = false
      } else {
        const blob = URL.createObjectURL(payload)
        this.image = {
          src: blob,
          type: payload.type
        }
        this.imagePayload = payload
        this.pickImageLoading = false
      }
    },
    crop () {
      const { canvas } = this.$refs.cropper.getResult()
      canvas.toBlob((blob) => {
        // set final image payload
        this.finalImagePayload = new File(
          [blob],
          this.imagePayload.name,
          {
            lastModified: new Date().getTime(),
            type: this.image.type
          }
        )
        // set display dataURL for final image payload
        const reader = new FileReader()
        reader.onload = () => {
          this.imageDisplayPayload = reader.result;
        }
        reader.readAsDataURL(this.finalImagePayload)
      }, this.image.type)
      this.cropped = true
      setTimeout(() => {
        this.$emit(
          'crop',
          {
            file: this.finalImagePayload,
            dataURL: this.imageDisplayPayload
          })
      }, 1000)
    },
    reset () {
      this.cropped = false
      this.imagePayload = null
      this.hideCameraBtn = false
      this.imageDisplayPayload = ''
      this.finalImagePayload = null
      this.image = {
        src: '',
        type: ''
      }
      this.$emit('discard')
    },
    openCamera () {
      this.showCamera = true
      setTimeout(() => {
        const player = this.$refs.player
        navigator.mediaDevices.getUserMedia({ video: true })
          .then((stream) => {
            player.srcObject = stream
          })
      }, 50)
    },
    closeCamera () {
      const tracks = this.$refs.player.srcObject.getTracks()
      tracks.forEach(((track) => (track.stop())))
      this.showCamera = false
    },
    snapImage () {
      const canvas = this.$refs.canvas
      const context = canvas.getContext('2d')
      context.drawImage(this.$refs.player, 0, 0, canvas.width, canvas.height)
      const tracks = this.$refs.player.srcObject.getTracks()
      tracks.forEach(((track) => (track.stop())))
      this.showCamera = false
      setTimeout(() => {
        canvas.toBlob((blob) => {
          this.$refs.imagePayload.addFiles([
            new File(
            [blob],
            `IMG_${Date.now()}.png`,
            {
              lastModified: new Date().getTime(),
              type: 'image/png'
            }
          )])
        })
      }, 10)
      this.hideCameraBtn = true
    },
    getFinalImage () {
      return (this.finalImagePayload !== null) ?
        this.finalImagePayload :
        null
    }
  }
})
</script>

<style scoped>
</style>