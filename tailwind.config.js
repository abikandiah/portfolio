export default {
	theme: {
		extend: {
			textShadow: {
				// Define your new utilities here
				'sm': '1px 1px 1px var(--tw-shadow-color)',
				'md': '2px 2px 4px var(--tw-shadow-color)',
				'lg': '4px 4px 8px var(--tw-shadow-color)',
				'none': 'none',
			},
			// You can also extend colors for shadows
			// shadowColor: {
			//   'red': '#ff0000',
			// },
		},
		safelist: [
			// Explicitly generate the utility class
			'opac-white',
		],
		colors: {
			'opac-white': 'white'
		}
	},
}