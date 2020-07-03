<template>
	<b-input-group class="mb-2">
		<b-input-group-prepend class="col-4 p-0">
			<span class="w-100"><b-form-input :value="timeValue.minutes" ref="minuteEditor" @input="updateTime" aria-label="Minutes" min="0" type="number"></b-form-input><small class="text-muted">Minutes</small></span>
		</b-input-group-prepend>

		<span class="col-4 p-0 input-group-main"><b-form-input :value="timeValue.seconds" ref="secondEditor" @input="updateTime" aria-label="Seconds" min="0" max="60" type="number"></b-form-input><small class="text-muted">Seconds</small></span>
		
		<b-input-group-append class="col-4 p-0">
			<span class="w-100"><b-form-input :value="timeValue.miliseconds" ref="milisecondEditor" @input="updateTime" aria-label="Miliseconds" min="0" type="number"></b-form-input><small class="text-muted">Miliseconds</small></span>
		</b-input-group-append>
	</b-input-group>
</template>
<script>
export default {
	name: 'TimeEditor',
	props: [ 'value' ],
	methods: {
		updateTime() {
			this.$emit('input', this.stringTime());
		},
		stringTime() {
			let time = '';
			
			time += ( +this.$refs.minuteEditor.$el.value ) ? `${+this.$refs.minuteEditor.$el.value}:`: '0:';
			
			if ( +this.$refs.secondEditor.$el.value ) {
				if ( +this.$refs.secondEditor.$el.value < 10 ) {
					time += `0${+this.$refs.secondEditor.$el.value}.`
				} else if ( +this.$refs.secondEditor.$el.value > 60 ) {
					time += '60.';
				} else {
					time += `${+this.$refs.secondEditor.$el.value}.`;
				}
			} else {
				time += '00.';
			}
			
			time += ( +this.$refs.milisecondEditor.$el.value ) ? `${+this.$refs.milisecondEditor.$el.value}`: '0';

			console.log(time)

			return time;
		}
	},
	computed: {
		timeValue() {
			let t = this.value.split(':');
			let m = t[0], s = t[1], ms = 0;

			if ( s.indexOf('.') ) {
				ms = s.split('.')[1];
				s = s.split('.')[0];
			}

			return {
				minutes: m,
				seconds: s,
				miliseconds: ms,
			}
		}
	},
}
</script>