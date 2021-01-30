<template>
	<v-app>
		<v-app-bar color="white " dense app>
			<v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

			<v-toolbar-title>Nigeria Senators</v-toolbar-title>

			<v-spacer></v-spacer>
		</v-app-bar>
		<v-navigation-drawer v-model="drawer" app class="green darken-3" dark>
			<v-list>
				<v-list-item
					v-for="link in links"
					:key="link.title"
					link
					:to="link.href"
				>
					<v-list-item-icon>
						<v-icon>{{ link.icon }}</v-icon>
					</v-list-item-icon>

					<v-list-item-content>
						<v-list-item-title>{{ link.title }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main id="main">
			<router-view />
		</v-main>
	</v-app>
</template>

<script>
export default {
	name: 'App',

	data: () => ({
		drawer: true,
		links: [
			{ title: 'Senators', icon: 'mdi-account-box', href: '/' },
			{
				title: 'Add Senators',
				icon: 'mdi-account-plus',
				href: '/add-senators',
			},
		],
	}),
}
</script>

<style>
#main {
	background-color: #ebedf1 !important;
}
</style>
