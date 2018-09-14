module.exports = function(spyke) {
	spyke.initConfig({
		pkg: spyke.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					sassDir: 'assets/styles/',
					cssDir: 'assets/styles/'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass']
			}
		}
	});
	spyke.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-spyke');
	grunt.registerTask('default',['spyke']);
}
