<template>
	<v-app>
		<v-app-bar color="white " dense app>
			<v-app-bar-nav-icon></v-app-bar-nav-icon>

			<v-toolbar-title>Nigeria Senators</v-toolbar-title>

			<v-spacer></v-spacer>
		</v-app-bar>
		<v-navigation-drawer app class="green darken-3" dark permanent>
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
	<!-- <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <HelloWorld/>
    </v-main>
  </v-app> -->
</template>

<script>
export default {
	name: 'App',

	data: () => ({
		links: [
			{ title: 'Dashboard', icon: 'mdi-view-dashboard', href: '/dashboard' },
			{ title: 'Senators', icon: 'mdi-account-box', href: '/senators' },
			{ title: 'Add Senators', icon: 'mdi-gavel', href: '/add-senators' },
		],
	}),
}
</script>

<style>
#main {
	background-color: #ebedf1 !important;
}
</style>
