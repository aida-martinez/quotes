<template>
	<div class="site">
		<header class="site-header">
			<h1>"s</h1>
			
			<clock-locale></clock-locale>
		</header>
		
		<main class="main" v-if="quote">
			<blockquote>
				{{quote.quote}}

				<cite>{{ quote.by }}</cite>
			</blockquote>

			<template v-if="picture">
				<img :src="picture.urls.regular" :alt="picture.alt_description" role="presentation">
				<p class="credit">
					Photo by <a :href="`https://unsplash.com/@${picture.user.username}?utm_source=your_app_name&utm_medium=referral`" target="_blank" rel="noopener">{{picture.user.name}}</a>
					on <a :href="`https://unsplash.com/?utm_source=quotes&utm_medium=referral`" target="_blank" rel="noopener">Unsplash</a>
				</p>
			</template>	
			
			<div class="overlay"></div>
		</main>

		<footer class="site-footer">
			<button  @click="getRandomQuote(true)" class="button button--nuka">One more, please!</button>
		</footer>
	</div>
</template>


<script >
	import ClockLocale from './components/clockLocale.vue'
	import { supabase } from './utils/supabase'
	import { unsplash } from './utils/unsplash'

	export default {
		data() {
			return {
				quotes: null,
				quote: null,
				picture: null,
				totalQuotes: null
			}
		},
		components: {
			ClockLocale,
		},
		mounted () {
			this.getQuotes()
		},
		methods: {
			async getQuotes() {
				let { data: quotes, error } = await supabase
				.from('quotes')
				.select('*')

				if ( error ){
					//console.log(error);
				}
				else {
					this.quotes = quotes
					this.totalQuotes = quotes.length
					this.getRandomQuote()
				}
			},
			async getQuotesById(id) {
				let { data: quotes, error } = await supabase
					.from('quotes')
					.select('*')
					.eq('id', id)
					.single()

				if ( error ){
					//console.log(error);
				}
				else {
					this.quote = quotes
					this.getBackgroundImage(quotes.keyword)
				}
			},
			getRandomQuote(reset){
				// If reset is true, we remove the param quote (which force the show of a quote with that ID)
				if ( reset ){
					if (location.href.includes('?')) { 
						history.pushState({}, null, location.href.split('?')[0]); 
					}
				}

				let uri        = window.location.search.substring(1); 
				let params     = new URLSearchParams(uri)
				let quoteId    = params.get("quote")
				let selectedId = 0

				
				if ( quoteId && Number.isInteger(parseInt(quoteId)) && this.totalQuotes >= quoteId ){
					selectedId = quoteId
				} else {
					selectedId = Math.floor(Math.random() * this.totalQuotes) + 1;
				}

				return this.getQuotesById( selectedId )
			},
			getBackgroundImage(key){
				unsplash.search
				.getPhotos({ query: key, orientation: "landscape", page: 1, perPage: 10 })
				.then(result => {
					// The api returns an array of picture, to not get always the same, we generate a random number
					let getRandomNumber = Math.floor(Math.random() * result.response.results.length)

					this.picture = result.response.results[getRandomNumber]
				})
				.catch(() => {
					//console.log("something went wrong!");
				});
			}
		},
	}
</script>


<style scoped>
.site{
	position: relative;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
}
.site-header{
	display: flex;
	align-items: center;
	justify-content: space-between;
	background-color: black;
	color: white;
	padding: 5px 20px;
}
.site-header h1{
	font-family: 'Keania One', cursive;
	font-weight: 400;
}
main.main{
    display: flex;
	flex: 1 0 0;
    justify-content: center;
    align-items: center;
    padding: 50px;
	color: white;
}
blockquote{
	font-size: 40px;
	line-height: 1.4;
	max-width: 750px;
}
cite{
	display: block;
	font-size: 20px;
	line-height: 1.2;
	margin-top: 20px;
}
img{
	position: absolute;
    z-index: -1;
    top: 0px;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.credit {
    position: absolute;
    bottom: 30px;
    right: 20px;
	opacity: 0.5;
	transition: opacity .4s ease-in;
}
.credit,
.credit a{
	font-size: 12px;
	color: white;
	text-decoration: none;
}
.credit:hover,
.credit:focus,
.credit:active{
	opacity: 1;
}
.overlay{
	position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
	background: rgba(0, 0, 0, 0.55);
}
.site-footer{
	background-color: transparent;
	padding: 10px 20px;
}
.button {
	position: relative;
	z-index: 1;
	display: block;
    cursor: pointer;
	padding: 10px 20px;
	margin: 10px auto;
}
.button:focus {
	outline: none;
}
.button > span {
	vertical-align: middle;
}
.button--nuka {
	transition: color 0.3s;
	transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}
.button--nuka::before,
.button--nuka::after {
	content: '';
	position: absolute;
	z-index: -1;
	border-radius: inherit;
	background: #00d1b2;
}
.button--nuka::before {
	top: -4px;
	bottom: -4px;
	left: -4px;
	right: -4px;
	opacity: 0.2;
	transform: scale3d(0.7, 1, 1);
	transition: transform 0.3s, opacity 0.3s;
}
.button--nuka::after {
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	transform: scale3d(1.1, 1, 1);
	transition: transform 0.3s, background-color 0.3s;
}
.button--nuka::before,
.button--nuka::after {
	transition-timing-function: cubic-bezier(0.2, 1, 0.3, 1);
}
.button--nuka:hover::before {
	opacity: 1;
}
.button--nuka:hover::after {
	background-color: #59ddc9;
}.button--nuka:hover::after,
.button--nuka:hover::before {
	-webkit-transform: scale3d(1, 1, 1);
	transform: scale3d(1, 1, 1);
}


@media ( max-width: 575px ){
	.site-header h1{
		font-size: 25px;
	}
}
@media ( max-width: 767px ){
	main.main{
		padding: 80px 30px;
	}
	blockquote{
		font-size: 24px;
	}
	cite{
		font-size: 16px;
	}
	.credit{
		bottom: 80px;
		right: auto;
		text-align: center;
	}
}
</style>