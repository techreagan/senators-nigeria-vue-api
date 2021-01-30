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
					<v-btn @click="getSenators">Take action</v-btn>
				</v-col>
			</v-row>
		</v-alert>

		<main v-else>
			<h3 class="headline font-weight-medium mb-7">Senators</h3>

			<v-row>
				<v-col cols="9" class="pb-0">
					<v-text-field
						v-model="search"
						solo
						label="Search by name of senator or state"
						type="text"
						@input="getSenators"
					></v-text-field>
				</v-col>
				<v-col cols="9">
					<v-skeleton-loader type="table-tbody" :loading="loading.data">
						<v-simple-table>
							<template v-slot:default>
								<thead>
									<tr>
										<th class="text-left">
											Name
										</th>
										<th class="text-left">
											State
										</th>
										<th class="text-left">
											Email
										</th>
										<th class="text-left">
											Phone Number
										</th>
										<th class="text-left" style="">Actions</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="senator in senators.data" :key="senator.email">
										<td>{{ senator.name }}</td>
										<td>{{ senator.state }}</td>
										<td>{{ senator.email }}</td>
										<td>{{ senator.phoneNumber }}</td>
										<td>
											<v-btn
												title="Send email"
												icon
												small
												text
												class="mr-3"
												color="orange"
											>
												<v-icon @click="openEmailDialog(senator.id)">
													mdi-mail
												</v-icon>
											</v-btn>
											<v-btn
												:href="`tel:${senator.phoneNumber}`"
												icon
												small
												text
												class="mr-3"
												color="green"
											>
												<v-icon>
													mdi-phone
												</v-icon>
											</v-btn>
											<v-btn
												icon
												small
												text
												class="mr-2"
												color="primary"
												:to="`senators/${senator.id}/update`"
											>
												<v-icon>
													mdi-pencil
												</v-icon>
											</v-btn>
											<v-btn
												icon
												text
												small
												@click.stop="deleteBtn(senator.id)"
												color="red"
											>
												<v-icon>
													mdi-delete
												</v-icon>
											</v-btn>
										</td>
									</tr>
								</tbody>
							</template>
						</v-simple-table>
					</v-skeleton-loader>
				</v-col>
				<v-col cols="9">
					<div class="text-center">
						<v-pagination
							@input="getSenators"
							v-model="page"
							:length="senators.totalPage"
						></v-pagination>
					</div>
				</v-col>
			</v-row>
		</main>

		<v-dialog v-model="deleteDialog" max-width="290">
			<v-card>
				<v-card-title class="headline">
					Delete Senator?
				</v-card-title>
				<v-card-text>Are you sure you want to delete?</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="red darken-1" text @click="deleteDialog = false">
						Disagree
					</v-btn>
					<v-btn color="green darken-1" text @click="deleteSenator">
						Agree
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="emailDialog" max-width="500">
			<v-card>
				<v-card-title class="headline">
					Send Email to Senator
				</v-card-title>

				<v-card-text class="py-10 px-8">
					<ValidationObserver ref="form" v-slot="{ handleSubmit, reset }">
						<form
							@submit.prevent="handleSubmit(sendEmail)"
							@reset.prevent="reset"
						>
							<ValidationProvider
								v-slot="{ errors }"
								name="Subject"
								rules="required|min:3"
							>
								<v-text-field
									v-model="data.subject"
									:error-messages="errors"
									label="Subject"
									outlined
								></v-text-field>
							</ValidationProvider>

							<ValidationProvider
								v-slot="{ errors }"
								name="Message"
								rules="required|min:3"
							>
								<v-textarea
									outlined
									v-model="data.message"
									:error-messages="errors"
									label="Message"
								></v-textarea>
							</ValidationProvider>

							<v-btn
								type="submit"
								class="green white--text"
								:loading="loading.btn"
								depressed
								>Send Email</v-btn
							>
						</form>
					</ValidationObserver>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-snackbar color="green" v-model="snackbar">
			{{ message }}
			<template v-slot:action="{ attrs }">
				<v-btn color="white" text v-bind="attrs" @click="snackbar = false" icon>
					<v-icon>mdi-close-circle</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>

<script>
import SenatorService from '@/services/SenatorService'
import { mapGetters } from 'vuex'

export default {
	data: () => {
		return {
			errored: false,
			loading: {
				data: false,
				btn: false,
			},

			senators: [],
			page: 1,
			deleteId: null,
			deleteDialog: false,
			snackbar: false,
			search: '',
			emailDialog: false,
			emailId: null,
			data: {
				subject: '',
				message: '',
			},
		}
	},
	computed: { ...mapGetters(['message']) },
	methods: {
		async getSenators() {
			this.loading.data = true

			const senators = await SenatorService.findAll({
				page: this.page,
				search: this.search,
			})
				.catch((err) => {
					console.log(err)
					this.errored = true
				})
				.finally(() => {
					this.loading.data = false
				})

			if (typeof senators === 'undefined') return

			this.senators = senators.data
		},
		async deleteSenator() {
			this.loading.btn = true
			console.log(this.deleteId)
			await SenatorService.deleteById(this.deleteId)
				.catch((err) => {
					console.log(err)
					this.errored = true
				})
				.finally(() => {
					this.senators.data = this.senators.data.filter(
						(senator) => this.deleteId !== senator.id
					)
					this.loading.btn = false
					this.deleteDialog = false

					this.$store.dispatch('message', 'Senator successfully deleted')
					this.snackbar = true
				})
		},
		async sendEmail() {
			this.loading.btn = true

			const senator = await SenatorService.sendMail({
				id: this.emailId,
				...this.data,
			})
				.catch((err) => {
					this.$refs.form.setErrors(err.response.data.error)
				})
				.finally(() => {
					this.loading.btn = false
				})

			if (!senator) return
			// this.$router.push({ name: 'Senators' })
			this.$store.dispatch('message', 'Email sent succesfully')
			this.emailDialog = false
			this.snackbar = true
		},
		deleteBtn(id) {
			console.log(id)
			this.deleteId = id
			this.deleteDialog = true
		},
		openEmailDialog(id) {
			this.emailId = id
			this.emailDialog = true
		},
	},
	beforeRouteLeave(to, from, next) {
		this.$store.dispatch('message', '')
		next()
	},
	mounted() {
		this.getSenators()
		this.snackbar = this.message !== '' ? true : false
	},
}
</script>

<style></style>
