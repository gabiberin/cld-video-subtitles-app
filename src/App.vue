<template>
	<div id="app">
		<b-container class="mb-5">
			<b-jumbotron id="main-jumbo" header="Cloudinary Video Subtitles" :header-level="4" lead="Add subtitles to videos hosted on Cloudinary" class="mt-sm-5 mt-3">
				<p>Click watch video to play your video!</p>
				<video v-if="videoUrl" width="480" controls autoplay>
					<source :src="videoUrl" type="video/mp4">
					Your browser does not support the video tag.
				</video>
			</b-jumbotron>

			<b-form @submit.prevent="onSubmit" @reset.prevent="onReset" v-if="show" class="mb-2">
				<b-form-group
					horizontal
					:label-cols-lg="2"
					:label-cols="12"
					label="Cloudinary Cloud Name"
				>
					<b-form-input v-model.trim="cloudName"></b-form-input>
				</b-form-group>

				<b-form-group
					horizontal
					:label-cols-lg="2"
					:label-cols="12"
					label="Video Public ID"
				>
					<b-form-input v-model.trim="publicId"></b-form-input>
				</b-form-group>

				<b-form-group
					horizontal
					:label-cols-lg="2"
					:label-cols="12"
					label="Video Subtitles"
					class="subtitles-list-group"
				>
					<b-list-group>
						<b-list-group-item
							class="flex-column align-items-start"
							v-for="(subtitle, index) in subtitles"
							:subtitle="subtitle"
							v-bind:key="index"
							:index="index"
						>
							<b-form-group
								horizontal
								:label-cols-lg="2"
								:label-cols="12"
								label="Text"
							>
								<b-form-input v-model.trim="subtitle.text"></b-form-input>
							</b-form-group>
							<div class="form-row mb-2">
								<label class="col-12 col-lg-2 mb-4">Start Timing</label>
								<time-editor v-model="subtitle['start-timing']" class="col-lg-4 col-12" style="margin-bottom: 2rem !important;"></time-editor>

								<label class="col-12 col-lg-2 mb-4">End Timing</label>
								<time-editor v-model="subtitle['end-timing']" class="col-lg-4 col-12"></time-editor>
							</div>

							<b-button variant="danger" class="mb-2 mt-4" v-if="subtitles.length > 1" @click.prevent="deleteSubtitle(index)">Delete</b-button>

						</b-list-group-item>
					</b-list-group>
				</b-form-group>

				<div class="mb-5">
					<b-button type="submit" variant="primary" class="mr-2">Watch Video</b-button>
					<b-button variant="outline-primary" @click.prevent="addSubtitle" class="mr-2">Add More Subtitles</b-button>
					<b-button type="reset" variant="outline-danger">Reset</b-button>
				</div>
			</b-form>
		</b-container>
	</div>
</template>

<script>
import cldVideoSubtitles from 'cld-video-json-subtitles'

export default {
	name: 'App',
	data() {
		return {
			show: true,
			cloudName: '',
			publicId: '',
			subtitles: [
				{
					'text': '',
					'start-timing': '0:00.0',
					'end-timing': '0:00.0',
				}
			],
			videoUrl: '',
			errorMessage: '',
		}
	},
	methods: {
		addSubtitle() {
			this.subtitles.push({
				'text': '',
				'start-timing': '0:00.0',
				'end-timing': '0:00.0',
			})
		},
		deleteSubtitle(itemIndex) {
			this.subtitles = this.subtitles.filter((item, index) => index != itemIndex );
		},
		onSubmit() {
			try {
				this.videoUrl = '';
				if ( ! this.publicId || ! this.cloudName ) {
					return this.$bvToast.toast('Please enter the cloud name and public id.', {
						title: 'An error has occured',
						variant: 'danger',
						autoHideDelay: 5000
					})
				}
				let url = cldVideoSubtitles.addSubtitlesToVideo(this.publicId, {
					subtitles: this.subtitles.filter((subtitle) => subtitle.text != '') 
				});

				// The library assumes a default cloud_name of candidate-evaluation and this UI should replace it
				this.$nextTick(() => this.videoUrl = url.replace('https://res.cloudinary.com/candidate-evaluation/', `https://res.cloudinary.com/${this.cloudName}/`) );

				window.document.getElementById('main-jumbo').scrollIntoView({
					behavior: 'smooth'
				});

			} catch (e) {
				console.log(e)
				return this.$bvToast.toast('Could not add subtitles to your video. Please make sure your inputs are correct.', {
					title: 'An error has occured',
					variant: 'danger',
					autoHideDelay: 5000
				})
			}
		},
		onReset() {
			// Reset our form values
			this.cloudName = '';
			this.publicId = '';
			this.subtitles = [{
				'text': '',
				'start-timing': '0:00.0',
				'end-timing': '0:00.0',
			}];
			this.videoUrl = '';

			// Trick to reset/clear native browser form validation state
			this.show = false;
			this.$nextTick(() => this.show = true );
      }
	},
	computed: {

	}
}
</script>

<style lang="scss">

@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

.form-group:not(.subtitles-list-group) .form-row,
.form-group.subtitles-list-group .form-row .form-row {
	align-items: center;
	justify-content: center;
}

.list-group-item {
	.form-control {
		border-radius: 0;
	}
	
	.time-editor.input-group {
		width: auto;

		.text-muted {
			position: absolute;
			left: auto;
			right: 50%;
			bottom: auto;
			transform: translateX(50%);
		}

		.input-group-main {
			width: 100%;
		}
		
	}
}

#main-jumbo video {
	max-width: -webkit-fill-available;
}
</style>
