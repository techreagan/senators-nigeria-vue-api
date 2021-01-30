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
					<v-skeleton-loader type="table-tbody" :loading="loading">
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
												<v-icon @click="editItem(item)">
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

		<v-snackbar color="green" v-model="snackbar">
			Senator deleted successfully
			<template v-slot:action="{ attrs }">
				<v-btn
					color="white"
					text
					v-bind="attrs"
					@click="snackbar = false"
					:loading="deleteBtnLoading"
					icon
				>
					<v-icon>mdi-close-circle</v-icon>
				</v-btn>
			</template>
		</v-snackbar>
	</v-container>
</template>

<script>
import SenatorService from '@/services/SenatorService'
export default {
	data: () => {
		return {
			errored: false,
			loading: false,
			deleteBtnLoading: false,
			senators: [],
			page: 1,
			deleteId: null,
			deleteDialog: false,
			snackbar: false,
			search: '',
		}
	},
	methods: {
		async getSenators() {
			this.loading = true

			const senators = await SenatorService.findAll({
				page: this.page,
				search: this.search,
			})
				.catch((err) => {
					console.log(err)
					this.errored = true
				})
				.finally(() => {
					this.loading = false
				})

			if (typeof senators === 'undefined') return

			this.senators = senators.data
		},
		async deleteSenator() {
			this.deleteBtnLoading = true
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
					this.deleteBtnLoading = false
					this.deleteDialog = false

					this.snackbar = true
				})
		},
		deleteBtn(id) {
			console.log(id)
			this.deleteId = id
			this.deleteDialog = true
		},
	},
	mounted() {
		this.getSenators()
	},
}
</script>

<style></style>
