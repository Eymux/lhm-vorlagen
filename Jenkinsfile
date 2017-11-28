pipline {
    agent any

    tools {nodejs 'node6.11.3'}

    stages {
        stage('Build') {
            steps {
                npm install
                ng build --progress false --prod --aot
            }
        }
        stage('Test') {
            steps {
                ng test --progress false --watch false
                junit '**/test-results.xml'
            }
        }
    }
}