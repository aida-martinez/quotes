<template>
    <div class="clocks" v-show="time">
		<div class="clock">
			<div class="clock__location">Cambados</div>
			<div class="clock__time">{{ time }}</div>
		</div>
		<div class="clock">
			<div class="clock__location">London</div>
			<div class="clock__time">{{ timeLondon }}</div>
		</div>
		<div class="clock">
			<div class="clock__location">Macau</div>
			<div class="clock__time">{{ timeMacau }}</div>
		</div>
    </div>  
</template>

<script>
    export default {
		data() {
			return {
				interval: null,
				time: null,
				timeLondon: null,
				timeMacau: null,
			}
		},
		beforeDestroy() {
			// prevent memory leak
			clearInterval(this.interval)
		},
		created() {
			// update the time every second
			this.interval = setInterval(() => {
				this.time = Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', timeZone: 'Europe/Madrid' }).format()
				this.timeLondon = Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', timeZone: 'Europe/London' }).format()
				this.timeMacau = Intl.DateTimeFormat('cn-CN', { hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Macau' }).format()
			}, 1000)
		}
	}
</script>

<style scoped>
.clocks{
	display: flex;
	justify-content: end;
	align-items: center;
	flex-wrap: wrap;
}
.clock{
	margin: 5px 0 5px 40px;
	text-align: center;
}
.clock__location{
	font-size: 14px;
	text-transform: uppercase;
}
.clock__time{
	font-size: 15px;
}
@media(max-width: 575px){
	.clock__location{
		font-size: 10px;
	}
	.clock__time{
		font-size: 12px;
	}
}
</style>