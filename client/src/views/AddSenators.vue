<template>
	<v-container fluid class="ml-2">
		<v-alert prominent type="error" v-if="errored">
			<v-row align="center">
				<v-col class="grow">
					<div class="title">Error!</div>
					<div>
						Something went wrong, but don’t fret — let’s give it another shot.
					</div>
				</v-col>
				<v-col class="shrink">
					<v-btn @click="getStates">Take action</v-btn>
				</v-col>
			</v-row>
		</v-alert>

		<main v-else>
			<h3 class="headline font-weight-medium mb-7">Add Senators</h3>

			<v-row>
				<v-col cols="6">
					<v-card>
						<v-card-text class="py-10 px-8">
							<ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
								<form
									@submit.prevent="handleSubmit(addSenator)"
									@reset.prevent="reset"
								>
									<ValidationProvider
										v-slot="{ errors }"
										name="Name"
										rules="required|min:3"
									>
										<v-text-field
											v-model="data.name"
											:error-messages="errors"
											label="Name"
											outlined
										></v-text-field>
									</ValidationProvider>
									<ValidationProvider
										v-slot="{ errors }"
										name="State"
										rules="required"
									>
										<v-select
											v-model="data.state"
											:items="states"
											:error-messages="errors"
											item-text="state"
											item-value="id"
											label="States"
											:loading="loading.btn"
											outlined
										></v-select>
									</ValidationProvider>

									<ValidationProvider
										v-slot="{ errors }"
										name="Email"
										rules="required|email"
									>
										<v-text-field
											v-model="data.email"
											:error-messages="errors"
											label="Email"
											outlined
										></v-text-field>
									</ValidationProvider>
									<ValidationProvider
										v-slot="{ errors }"
										name="Phone Number"
										rules="required|min:11|max:11"
									>
										<v-text-field
											v-model="data.phoneNumber"
											:error-messages="errors"
											label="Phone Number"
											outlined
										></v-text-field>
									</ValidationProvider>

									<v-btn
										type="submit"
										class="green white--text"
										:loading="loading.btn"
										depressed
										>Add Senator</v-btn
									>
								</form>
							</ValidationObserver>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</main>
	</v-container>
</template>

<script>
import SenatorService from '@/services/SenatorService'
import StateService from '@/services/StateService'
export default {
	data: () => {
		return {
			errored: false,
			loading: {
				input: false,
				btn: false,
			},
			states: [],
			data: { name: '', phoneNumber: '', state: '', email: '' },
		}
	},
	methods: {
		async getStates() {
			this.errored = false
			this.loading.input = true

			const states = await StateService.findAll()
				.catch((err) => {
					console.log(err)
					this.errored = true
				})
				.finally(() => {
					this.loading.input = false
				})

			if (typeof states === 'undefined') return

			this.states = states.data.data
		},
		async addSenator() {
			this.loading.btn = true

			const senator = await SenatorService.create(this.data)
				.catch((err) => {
					// this.errored = true
					// console.log(err.response.data)
					this.$refs.form.setErrors(err.response.data.error)
				})
				.finally(() => {
					this.loading.btn = false
				})

			if (!senator) return
			this.$router.push({ name: 'Senators' })
			this.$store.dispatch('message', 'Senator successfully added')
		},
	},
	mounted() {
		this.getStates()
	},
}
</script>

<style></style>
