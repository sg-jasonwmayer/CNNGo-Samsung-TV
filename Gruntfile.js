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
	spyke.loadNpmTasks('spyke-contrib-compass');
	grunt.loadNpmTasks('spyke-contrib-spyke');
	grunt.registerTask('default',['spyke']);
}
